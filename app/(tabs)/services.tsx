import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import {
  SERVICE_CATEGORIES,
  getServicesByCategory,
  type Service,
  type ServiceCategory,
} from '../../src/data/services';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';

type Filter = 'all' | ServiceCategory;

const CHIP_LABELS: Record<Filter, string> = {
  all: 'All',
  'Workshops & Creative Wellness': 'Workshops',
  'Creative Mentoring': 'Mentoring',
  'Fine Art & Crafts': 'Fine Art',
  'Technology & Branding': 'Branding',
  'Events, Media & Design': 'Events',
  'Growth & Opportunities': 'Growth',
};

export default function ServicesScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<Filter>('all');
  const list = getServicesByCategory(filter);
  const maxWidth = Math.min(width, 720);

  const renderItem = ({ item }: { item: Service }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/service/[slug]', params: { slug: item.slug } })}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${item.summary} Open details`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconWell}>
        <Ionicons name={item.icon} size={24} color={colors.accent} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.category}>{CHIP_LABELS[item.category]}</Text>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>{item.summary}</Text>
      </View>
      <View style={styles.chevron}>
        <Ionicons name="chevron-forward" size={18} color={colors.accent} />
      </View>
    </Pressable>
  );

  return (
    <FlatList
      style={styles.page}
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      extraData={filter}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Services</Text>
          <Text style={styles.lead}>
            Twelve offerings from Directional Works. Open a service for details, then enquire on WhatsApp.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {(['all', ...SERVICE_CATEGORIES] as Filter[]).map((item) => {
              const active = filter === item;
              const label = CHIP_LABELS[item];
              return (
                <Pressable
                  key={item}
                  onPress={() => setFilter(item)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={item === 'all' ? 'All services' : item}
                  style={({ pressed }) => [styles.chip, active && styles.chipOn, pressed && styles.pressed]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextOn]}>{label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.count}>
            {list.length} {list.length === 1 ? 'service' : 'services'}
            {filter !== 'all' ? ` · ${CHIP_LABELS[filter]}` : ''}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyWrap}>
          <Ionicons name="search-outline" size={28} color={colors.accent} />
          <Text style={styles.empty}>No services in this category.</Text>
        </View>
      }
      contentContainerStyle={[styles.content, { maxWidth, alignSelf: 'center', width: '100%' }]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: spacing.xxl, paddingTop: spacing.md },
    title: {
      paddingHorizontal: spacing.xl,
      fontSize: 32,
      fontFamily: serifFont,
      color: colors.text,
    },
    lead: {
      paddingHorizontal: spacing.xl,
      marginTop: spacing.sm,
      marginBottom: spacing.lg,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
    },
    chips: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingBottom: spacing.md },
    chip: {
      minHeight: 44,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      justifyContent: 'center',
    },
    chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.textMuted },
    chipTextOn: { color: colors.accentText },
    count: {
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.md,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.3,
      color: colors.textDim,
    },
    card: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      minHeight: touchTargets.minimum + 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.lg,
      paddingLeft: spacing.md,
      paddingRight: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    pressed: { opacity: 0.78 },
    iconWell: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
    copy: { flex: 1 },
    category: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: colors.accent, textTransform: 'uppercase' },
    name: { marginTop: 5, fontSize: 16, fontWeight: '600', color: colors.text, lineHeight: 21 },
    summary: { marginTop: 5, fontSize: 13, lineHeight: 18, color: colors.textMuted },
    chevron: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyWrap: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
    empty: { textAlign: 'center', color: colors.textMuted, fontSize: 14 },
  });
