import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { services } from '../../../data/services';
import { serifFont, spacing, touchTargets, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';
import { DashboardSectionHeader } from './DashboardSectionHeader';

export function ServiceDiscovery() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const preview = services.slice(0, 6);

  return (
    <View style={styles.section}>
      <DashboardSectionHeader title="Explore Our Services" />
      <View style={styles.grid}>
        {preview.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => router.push({ pathname: '/service/[slug]', params: { slug: item.slug } })}
            accessibilityRole="button"
            accessibilityLabel={`${item.title}. Open service details`}
            style={({ pressed }) => [styles.cell, pressed && styles.pressed]}
          >
            <View style={styles.inner}>
              <Ionicons name={item.icon} size={26} color={colors.accent} />
            </View>
            <Text style={styles.label} numberOfLines={2}>{item.title.split('—')[0]}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable
        onPress={() => router.navigate('/services')}
        accessibilityRole="button"
        accessibilityLabel="View all twelve services"
        style={({ pressed }) => [styles.all, pressed && styles.pressed]}
      >
        <Text style={styles.allText}>View all 12 services</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: { paddingTop: spacing.xl },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: spacing.lg,
    },
    cell: {
      width: '33.33%',
      alignItems: 'center',
      paddingVertical: spacing.md,
      minHeight: touchTargets.minimum + 36,
    },
    pressed: { opacity: 0.58 },
    inner: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.sm,
    },
    label: {
      fontSize: 11,
      lineHeight: 15,
      textAlign: 'center',
      fontFamily: serifFont,
      color: colors.text,
      paddingHorizontal: 4,
    },
    all: {
      marginHorizontal: spacing.xl,
      minHeight: touchTargets.minimum,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.sm,
    },
    allText: { fontSize: 14, fontWeight: '600', color: colors.accent },
  });
