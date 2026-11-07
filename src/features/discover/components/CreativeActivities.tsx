import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radii, spacing, touchTargets, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { DashboardSectionHeader } from './DashboardSectionHeader';

const PRACTICES = [
  { slug: 'painting-drawing-mentoring', icon: 'easel-outline' as const, title: 'Studio practice' },
  { slug: 'calligraphy-handwriting', icon: 'create-outline' as const, title: 'Calligraphy' },
  { slug: 'art-therapy-workshops', icon: 'pencil-outline' as const, title: 'Group drawing' },
];

export function CreativeActivities() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.section}>
      <DashboardSectionHeader title="Creative Practice" />
      <View style={styles.row}>
        {PRACTICES.map((item) => (
          <Pressable
            key={item.slug}
            onPress={() => router.push({ pathname: '/service/[slug]', params: { slug: item.slug } })}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. Open related service`}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
          >
            <View style={styles.iconWell}>
              <Ionicons name={item.icon} size={24} color={colors.accent} />
            </View>
            <Text style={styles.caption} numberOfLines={2}>{item.title}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: { paddingTop: spacing.xl },
    row: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      gap: spacing.sm,
    },
    tile: {
      flex: 1,
      minHeight: touchTargets.minimum + 28,
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xs,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    pressed: { opacity: 0.72 },
    iconWell: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    caption: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      lineHeight: 16,
    },
  });
