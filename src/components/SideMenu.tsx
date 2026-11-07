import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, usePathname } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import {
  AccessibilityInfo, Animated, Easing, Modal, Pressable,
  ScrollView, StyleSheet, Text, useWindowDimensions, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeProvider';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../theme/colors';

const destinations = [
  { label: 'Discover', path: '/home', icon: 'compass-outline' },
  { label: 'Services', path: '/services', icon: 'grid-outline' },
  { label: 'Gallery', path: '/gallery', icon: 'images-outline' },
  { label: 'Contact', path: '/contact', icon: 'chatbubble-ellipses-outline' },
  { label: 'Artist profile', path: '/about', icon: 'person-circle-outline' },
  { label: 'Privacy', path: '/privacy', icon: 'document-text-outline' },
  { label: 'Notifications', path: '/notifications', icon: 'notifications-outline' },
  { label: 'Preferences', path: '/settings', icon: 'settings-outline' },
] as const;

export function SideMenu({ onDismiss }: { onDismiss: () => void }) {
  const { colors } = useAppTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(width * 0.84, 340);
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const progress = useRef(new Animated.Value(0)).current;
  const reduceMotion = useRef(false);
  const closing = useRef(false);

  useEffect(() => {
    let active = true;
    const show = (reduced: boolean) => {
      if (!active) return;
      reduceMotion.current = reduced;
      Animated.timing(progress, {
        toValue: 1,
        duration: reduced ? 0 : 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };
    AccessibilityInfo.isReduceMotionEnabled().then(show).catch(() => show(false));
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (reduced) => {
      reduceMotion.current = reduced;
    });
    return () => {
      active = false;
      progress.stopAnimation();
      subscription.remove();
    };
  }, [progress]);

  const close = (navigate?: () => void) => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(progress, {
      toValue: 0,
      duration: reduceMotion.current ? 0 : 190,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onDismiss();
        navigate?.();
      } else {
        closing.current = false;
      }
    });
  };

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={() => close()}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.scrim, { opacity: progress }]}>
          <Pressable
            onPress={() => close()}
            accessibilityRole="button"
            accessibilityLabel="Close navigation menu"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          accessibilityViewIsModal
          style={[
            styles.drawer,
            { width: drawerWidth, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl },
            { transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [-drawerWidth, 0] }) }] },
          ]}
        >
          <View style={styles.heading}>
            <Image source={require('../../assets/brand-mark.png')} contentFit="contain" style={styles.logo} />
            <Pressable onPress={() => close()} accessibilityRole="button" accessibilityLabel="Close menu" style={styles.close}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <Text style={styles.name}>Directional Works</Text>
          <Text style={styles.description}>Original art by Praveen S.</Text>
          <View style={styles.rule} />
          <ScrollView contentContainerStyle={styles.links} showsVerticalScrollIndicator={false}>
            {destinations.map((item) => {
              const selected = pathname === item.path;
              return (
                <Pressable
                  key={item.path}
                  onPress={() => close(() => router.navigate(item.path))}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={({ pressed }) => [styles.link, selected && styles.selected, pressed && styles.pressed]}
                >
                  <Ionicons name={item.icon} size={22} color={selected ? colors.accent : colors.textMuted} />
                  <Text style={[styles.linkText, selected && styles.selectedText]}>{item.label}</Text>
                  {selected && <View style={styles.activeDot} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: { flex: 1 },
  scrim: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: colors.overlay },
  drawer: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: colors.surface, paddingHorizontal: spacing.xl },
  heading: { height: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logo: { width: 92, height: 62 },
  close: { minWidth: touchTargets.minimum, minHeight: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  name: { color: colors.text, fontSize: 24, fontFamily: serifFont, marginTop: spacing.lg },
  description: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xl },
  links: { gap: spacing.sm },
  link: { flexDirection: 'row', alignItems: 'center', minHeight: 56, borderRadius: radii.md, paddingHorizontal: spacing.md, gap: spacing.lg },
  selected: { backgroundColor: colors.tabSelected },
  pressed: { opacity: 0.65 },
  linkText: { color: colors.text, fontSize: 16, flex: 1 },
  selectedText: { color: colors.accent, fontWeight: '600' },
  activeDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent },
});
