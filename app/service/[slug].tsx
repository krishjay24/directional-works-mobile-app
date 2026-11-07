import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WhatsAppMessageButton } from '../../src/components/WhatsAppMessageButton';
import { business } from '../../src/config/business';
import { getRelatedServices, getServiceBySlug } from '../../src/data/services';
import { serviceEnquiryMessage } from '../../src/lib/whatsapp';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function ServiceDetail() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = getServiceBySlug(String(slug ?? ''));
  const related = service ? getRelatedServices(service.slug) : [];
  const maxWidth = Math.min(width, 720);

  if (!service) {
    return (
      <View style={[styles.page, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/services'))}
          style={styles.back}
          accessibilityRole="button"
          accessibilityLabel="Back to services"
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Services</Text>
        </Pressable>
        <Text style={styles.missing}>Service not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/services'))}
          accessibilityRole="button"
          accessibilityLabel="Back to services"
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>Service</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + 108, maxWidth, width: '100%', alignSelf: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons name={service.icon} size={34} color={colors.accent} />
          </View>
          <Text style={styles.category}>{service.category}</Text>
          <Text style={styles.title}>{service.title}</Text>
        </View>
        <Text style={styles.body}>{service.description}</Text>
        {service.verificationStatus === 'needs-review' ? (
          <View style={styles.noteCard}>
            <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
            <Text style={styles.note}>
              Details, availability and fees are confirmed directly. {business.hours}
            </Text>
          </View>
        ) : (
          <View style={styles.noteCard}>
            <Ionicons name="images-outline" size={18} color={colors.accent} />
            <Text style={styles.note}>
              Original works live in Gallery. Use a painting’s artwork ID when you enquire about a specific piece.
            </Text>
          </View>
        )}
        {related.length > 0 ? (
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Related services</Text>
            {related.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: '/service/[slug]', params: { slug: item.slug } })}
                style={({ pressed }) => [styles.relatedRow, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                <View style={styles.relatedIcon}>
                  <Ionicons name={item.icon} size={18} color={colors.accent} />
                </View>
                <View style={styles.relatedCopy}>
                  <Text style={styles.relatedName}>{item.title}</Text>
                  <Text style={styles.relatedSummary} numberOfLines={1}>{item.summary}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <View style={[styles.ctaBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <WhatsAppMessageButton label={service.enquiryLabel} draft={serviceEnquiryMessage(service.title)} />
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background },
    top: {
      paddingHorizontal: spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    topTitle: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '600', color: colors.textMuted },
    iconButton: { minHeight: touchTargets.minimum, minWidth: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
    back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl, minHeight: touchTargets.minimum },
    backText: { color: colors.text },
    missing: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
    scroll: { paddingHorizontal: spacing.xl },
    hero: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      padding: spacing.xl,
      marginBottom: spacing.xl,
    },
    heroIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    category: { fontSize: 11, fontWeight: '700', letterSpacing: 1, color: colors.accent, textTransform: 'uppercase' },
    title: { marginTop: spacing.sm, fontSize: 26, fontFamily: serifFont, color: colors.text, lineHeight: 32 },
    body: { fontSize: 16, lineHeight: 24, color: colors.textMuted },
    noteCard: {
      marginTop: spacing.xl,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    note: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.textDim },
    related: { marginTop: spacing.xxl },
    relatedTitle: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4, color: colors.text, marginBottom: spacing.md },
    relatedRow: {
      minHeight: touchTargets.minimum,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      marginBottom: spacing.sm,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    relatedIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.tabSelected,
      alignItems: 'center',
      justifyContent: 'center',
    },
    relatedCopy: { flex: 1 },
    relatedName: { fontSize: 14, fontWeight: '600', color: colors.text },
    relatedSummary: { marginTop: 2, fontSize: 12, color: colors.textMuted },
    pressed: { opacity: 0.7 },
    ctaBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.md,
      backgroundColor: colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
  });
