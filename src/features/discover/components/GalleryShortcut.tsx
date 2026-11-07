import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';

export function GalleryShortcut() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={() => router.navigate('/gallery')}
        accessibilityRole="button"
        accessibilityLabel="Explore original paintings. Opens Gallery"
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      >
        <View style={styles.icon}>
          <Ionicons name="images" size={22} color={colors.accent} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.title}>Explore Original Paintings</Text>
          <Text style={styles.detail}>Discover the original artwork collection.</Text>
        </View>
        <View style={styles.action}>
          <Ionicons name="chevron-forward" size={20} color={colors.accent} />
        </View>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xl,
    },
    card: {
      minHeight: touchTargets.minimum + 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    pressed: { opacity: 0.82 },
    icon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: { flex: 1 },
    title: {
      fontSize: 16,
      fontFamily: serifFont,
      color: colors.text,
    },
    detail: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textMuted,
    },
    action: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
