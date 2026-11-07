import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  AppState,
  type AppStateStatus,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { radii, spacing, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { HERO_SLIDES } from '../data/dashboardSlides';

const INTERVAL_MS = 3000;
const n = HERO_SLIDES.length;
const LOOP = [HERO_SLIDES[n - 1], ...HERO_SLIDES, HERO_SLIDES[0]];

export function CreativeHeroCarousel() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const height = Math.min(Math.round(width * 0.52), width >= 768 ? 340 : 232);

  const listRef = useRef<FlatList<(typeof LOOP)[number]>>(null);
  const loopIndex = useRef(1);
  const dragging = useRef(false);
  const jumping = useRef(false);
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearFallback = () => {
    if (fallbackRef.current) {
      clearTimeout(fallbackRef.current);
      fallbackRef.current = null;
    }
  };

  const [page, setPage] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const [cycle, setCycle] = useState(0);

  const scrollTo = useCallback(
    (index: number, animated: boolean) => {
      listRef.current?.scrollToOffset({ offset: index * width, animated });
      loopIndex.current = index;
    },
    [width],
  );

  const settle = useCallback(
    (index: number) => {
      clearFallback();
      if (index <= 0) {
        jumping.current = true;
        scrollTo(n, false);
        setPage(n - 1);
        requestAnimationFrame(() => {
          jumping.current = false;
        });
        return;
      }
      if (index >= n + 1) {
        jumping.current = true;
        scrollTo(1, false);
        setPage(0);
        requestAnimationFrame(() => {
          jumping.current = false;
        });
        return;
      }
      loopIndex.current = index;
      setPage(index - 1);
    },
    [scrollTo],
  );

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => setAppActive(state === 'active');
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    scrollTo(1, false);
  }, [scrollTo, width]);

  useEffect(() => {
    if (reduceMotion || !appActive) return;
    const id = setInterval(() => {
      if (dragging.current || jumping.current) return;
      const next = loopIndex.current + 1;
      scrollTo(next, true);
      fallbackRef.current = setTimeout(() => {
        if (!dragging.current) settle(next);
      }, 360);
    }, INTERVAL_MS);
    return () => {
      clearInterval(id);
      clearFallback();
    };
  }, [reduceMotion, appActive, scrollTo, settle, cycle]);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      settle(index);
      dragging.current = false;
      setCycle((value) => value + 1);
    },
    [settle, width],
  );

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={`Creative banner, image ${page + 1} of ${n}. Swipe to change.`}
    >
      <FlatList
        ref={listRef}
        data={LOOP}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        extraData={width}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        initialScrollIndex={1}
        onScrollBeginDrag={() => {
          dragging.current = true;
          clearFallback();
        }}
        onMomentumScrollEnd={onMomentumEnd}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={[styles.frame, { height }]}>
              <Image
                source={item.image}
                style={styles.image}
                contentFit="cover"
                cachePolicy="memory-disk"
                accessibilityIgnoresInvertColors
                accessibilityLabel={item.accessibilityLabel}
              />
            </View>
          </View>
        )}
      />
      <View style={styles.dots} accessible accessibilityLabel={`Slide ${page + 1} of ${n}`}>
        {HERO_SLIDES.map((slide, index) => (
          <View key={slide.id} style={[styles.dot, index === page && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    frame: {
      marginHorizontal: spacing.lg,
      borderRadius: radii.lg,
      overflow: 'hidden',
      backgroundColor: colors.card,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing.sm,
      paddingTop: spacing.md,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
    },
    dotOn: {
      width: 16,
      backgroundColor: colors.accent,
    },
  });
