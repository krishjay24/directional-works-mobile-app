import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeProvider';
import { spacing, touchTargets, type ThemeColors } from '../theme/colors';
import { SideMenu } from './SideMenu';

export function AppHeader() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.row}>
          <Pressable
            onPress={() => { Keyboard.dismiss(); setMenuOpen(true); }}
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Ionicons name="menu-outline" size={27} color={colors.text} />
          </Pressable>
          <View pointerEvents="none" style={styles.brand}>
            <Image source={require('../../assets/brand-mark.png')} contentFit="contain" style={styles.logo} />
          </View>
          <Pressable
            onPress={() => { Keyboard.dismiss(); router.push('/notifications'); }}
            accessibilityRole="button"
            accessibilityLabel="Open notifications and messages"
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>
      {menuOpen && <SideMenu onDismiss={() => setMenuOpen(false)} />}
    </>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    height: 54,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  action: {
    width: touchTargets.minimum,
    height: touchTargets.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.55 },
  brand: { position: 'absolute', left: 64, right: 64, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 86, height: 54 },
});
