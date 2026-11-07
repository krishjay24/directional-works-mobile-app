import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { spacing, type ThemeColors } from '../theme/colors';

export function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width, height } = useWindowDimensions();
  const size = Math.min(width * 0.68, height * 0.48, 280);
  const reveal = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(18)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const curtain = useRef(new Animated.Value(1)).current;
  const started = useRef(false);
  const cancelled = useRef(false);
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => () => {
    cancelled.current = true;
    animation.current?.stop();
  }, []);

  const start = async () => {
    if (started.current) return;
    started.current = true;
    const reduced = await AccessibilityInfo.isReduceMotionEnabled().catch(() => false);
    if (cancelled.current) return;
    await SplashScreen.hideAsync().catch(() => {});
    if (cancelled.current) return;
    if (reduced) {
      onDone();
      return;
    }
    animation.current = Animated.sequence([
      Animated.parallel([
        Animated.timing(reveal, { toValue: 1, duration: 750, useNativeDriver: true }),
        Animated.timing(lift, {
          toValue: 0, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: true,
        }),
      ]),
      Animated.timing(progress, { toValue: 1, duration: 3550, useNativeDriver: true }),
      Animated.timing(curtain, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]);
    animation.current.start(({ finished }) => {
      if (finished && !cancelled.current) onDone();
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: curtain }]}>
      <Animated.View style={{ opacity: reveal, transform: [{ translateY: lift }], alignItems: 'center' }}>
        <Image
          source={require('../../assets/brand-logo.png')}
          contentFit="contain"
          style={{ width: size, height: size }}
          onLoad={start}
          onError={start}
          accessibilityLabel="Directional Works logo"
        />
        <Animated.View style={[styles.line, { transform: [{ scaleX: progress }] }]} />
        <Text style={styles.caption}>FINE ART BY PRAVEEN S.</Text>
      </Animated.View>
    </Animated.View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background,
  },
  line: { width: 72, height: 2, marginTop: spacing.lg, backgroundColor: colors.accent, borderRadius: 1 },
  caption: { color: colors.textMuted, fontSize: 11, letterSpacing: 2, marginTop: spacing.lg },
});
