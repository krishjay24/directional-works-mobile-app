import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CategoryChips, FILTERS, type Filter } from '../../src/components/CategoryChips';
import { PaintingCard } from '../../src/components/PaintingCard';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import paintings, { CATEGORY_LABELS } from '../../src/data/paintings';
import { spacing, type ThemeColors } from '../../src/theme/colors';

const COLLECTION_COUNT = Object.keys(CATEGORY_LABELS).length;
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function Gallery() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const params = useLocalSearchParams<{ category?: string; selection?: string }>();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const routeFilter = FILTERS.find((key) => key === params.category);
  const [filter, setFilter] = useState<Filter>(routeFilter ?? 'all');

  useEffect(() => {
    if (routeFilter) setFilter(routeFilter);
  }, [routeFilter, params.selection]);

  const filtered = useMemo(() => filter === 'all' ? paintings : paintings.filter((item) => item.category === filter), [filter]);

  return (
    <FlatList
      key={`columns-${columns}`}
      data={filtered}
      numColumns={columns}
      keyExtractor={(item) => String(item.id)}
      style={styles.page}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      windowSize={5}
      ListHeaderComponent={<View style={styles.header}>
        <ScreenHeader title="Gallery" subtitle={`${filtered.length} ${filter === 'all' ? 'original works' : `${CATEGORY_LABELS[filter]} works`}`} />
        <Text style={styles.collectionSummary}>{paintings.length} works · {COLLECTION_COUNT} collections · Praveen S.</Text>
        <CategoryChips selected={filter} onSelect={setFilter} />
      </View>}
      ListEmptyComponent={<Text style={styles.empty}>No artworks in this collection.</Text>}
      renderItem={({ item }) => (
        <View style={[styles.cell, { width: `${100 / columns}%` }]}>
          <PaintingCard painting={item} />
        </View>
      )}
    />
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  list: { paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg },
  header: { marginHorizontal: -spacing.lg, marginBottom: spacing.lg },
  collectionSummary: { marginHorizontal: spacing.xl, marginTop: spacing.sm, marginBottom: spacing.sm, color: colors.textDim, fontSize: 12 },
  row: { marginHorizontal: -spacing.xs },
  cell: { paddingHorizontal: spacing.xs },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.xxl },
});
