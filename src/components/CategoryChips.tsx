import { useMemo } from 'react';
import { ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import paintings, { CATEGORY_LABELS, type Category } from '../data/paintings';
import { radii, spacing, touchTargets, type ThemeColors } from '../theme/colors';
import { useAppTheme } from '../theme/ThemeProvider';

export type Filter = Category | 'all';
export const FILTERS: Filter[] = ['all', 'nature', 'devotional', 'calligraphy', 'spiritual'];

export function CategoryChips({
  selected,
  onSelect,
  showCounts = false,
}: {
  selected?: Filter;
  onSelect: (category: Filter) => void;
  showCounts?: boolean;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroller}
      accessibilityRole="none"
    >
      {FILTERS.map((category) => {
        const active = selected === category;
        const label = category === 'all' ? 'All' : CATEGORY_LABELS[category];
        const count = category === 'all' ? paintings.length : paintings.filter((painting) => painting.category === category).length;
        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${label}, ${count} artworks`}
            style={({ pressed }) => [styles.chip, active && styles.active, pressed && styles.pressed]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>
              {label}{showCounts ? `  ${count}` : ''}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  scroller: { flexGrow: 0 },
  row: { gap: spacing.sm, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  chip: {
    minHeight: touchTargets.minimum,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  pressed: { opacity: 0.65 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  activeLabel: { color: colors.accentText },
});
