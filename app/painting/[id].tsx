import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArtworkViewer } from '../../src/components/ArtworkViewer';
import paintings, { CATEGORY_LABELS } from '../../src/data/paintings';
import { openWhatsAppMessage, paintingEnquiryMessage } from '../../src/lib/whatsapp';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function PaintingDetail() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const index = paintings.findIndex((item) => item.id === Number(id));
  const painting = paintings[index];
  const [viewerOpen, setViewerOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const back = () => router.canGoBack() ? router.back() : router.replace('/gallery');
  const goTo = (nextIndex: number) => {
    setRotation(0);
    router.setParams({ id: String(paintings[nextIndex].id) });
  };

  if (!painting) {
    return (
      <View style={[styles.page, { paddingTop: insets.top + spacing.lg }]}>
        <Pressable onPress={back} accessibilityRole="button" style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
          <Text style={styles.backText}>Back to gallery</Text>
        </Pressable>
        <Text style={styles.notFound}>Artwork not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.top, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={back} accessibilityRole="button" accessibilityLabel="Back" style={styles.iconButton}>
          <Ionicons name="arrow-back" size={23} color={colors.text} />
        </Pressable>
        <Text style={styles.count}>{index + 1} / {paintings.length}</Text>
        <Pressable onPress={() => setViewerOpen(true)} accessibilityRole="button" accessibilityLabel="View artwork fullscreen" style={styles.iconButton}>
          <Ionicons name="expand-outline" size={22} color={colors.text} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]} showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => setViewerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`Open fullscreen view of ${painting.title}`}
          style={({ pressed }) => [styles.artMatte, { height: Math.min(height * 0.58, 640) }, pressed && { opacity: 0.82 }]}
        >
          <Image source={painting.image} contentFit="contain" cachePolicy="memory-disk" style={styles.art} />
        </Pressable>
        <View style={[styles.info, { maxWidth: Math.max(320, Math.min(width, 720)) }]}>
          <Text style={styles.category}>{CATEGORY_LABELS[painting.category].toUpperCase()} · ORIGINAL ARTWORK</Text>
          <Text style={styles.title}>{painting.title}</Text>
          <Text style={styles.artist}>Praveen S.</Text>
          <View style={styles.divider} />
          <View style={styles.actions}>
            <Pressable onPress={() => setViewerOpen(true)} accessibilityRole="button" style={({ pressed }) => [styles.fullscreen, pressed && styles.pressed]}>
              <Ionicons name="expand-outline" size={18} color={colors.accentText} />
              <Text style={styles.fullscreenText}>View fullscreen</Text>
            </Pressable>
            <Pressable
              onPress={() => void openWhatsAppMessage(paintingEnquiryMessage(painting.id))}
              accessibilityRole="button"
              accessibilityLabel={`Enquire about artwork ID ${painting.id}`}
              style={({ pressed }) => [styles.enquire, pressed && styles.pressed]}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
              <Text style={styles.enquireText}>Enquire About This Artwork</Text>
            </Pressable>
          </View>
          <Text style={styles.saleNote}>Enquiries are conversations. Availability for sale is confirmed by Praveen S. directly.</Text>
          <View style={styles.navigation}>
            <Pressable
              disabled={index === 0}
              onPress={() => goTo(index - 1)}
              accessibilityRole="button"
              accessibilityState={{ disabled: index === 0 }}
              style={[styles.step, index === 0 && styles.disabled]}
            >
              <Ionicons name="arrow-back" size={17} color={colors.text} />
              <Text style={styles.stepText}>Previous</Text>
            </Pressable>
            <Pressable
              disabled={index === paintings.length - 1}
              onPress={() => goTo(index + 1)}
              accessibilityRole="button"
              accessibilityState={{ disabled: index === paintings.length - 1 }}
              style={[styles.step, index === paintings.length - 1 && styles.disabled]}
            >
              <Text style={styles.stepText}>Next</Text>
              <Ionicons name="arrow-forward" size={17} color={colors.text} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <ArtworkViewer painting={painting} visible={viewerOpen} rotation={rotation} onRotate={() => setRotation((value) => value + 180)} onClose={() => setViewerOpen(false)} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { color: colors.textMuted, fontSize: 12, fontVariant: ['tabular-nums'] },
  iconButton: { minHeight: touchTargets.minimum, minWidth: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1 },
  artMatte: { backgroundColor: colors.surface, padding: spacing.lg, width: '100%' },
  art: { width: '100%', height: '100%' },
  info: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, alignSelf: 'center', width: '100%' },
  category: { color: colors.accent, fontSize: 11, letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontFamily: serifFont, marginTop: spacing.sm },
  artist: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  actions: { gap: spacing.sm },
  fullscreen: { minHeight: touchTargets.minimum, borderRadius: radii.sm, paddingHorizontal: spacing.lg, backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  enquire: { minHeight: touchTargets.minimum, borderRadius: radii.sm, paddingHorizontal: spacing.lg, backgroundColor: '#25D366', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  enquireText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  saleNote: { color: colors.textDim, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  pressed: { opacity: 0.7 },
  fullscreenText: { color: colors.accentText, fontSize: 14, fontWeight: '600' },
  navigation: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
  step: { minHeight: touchTargets.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm },
  stepText: { color: colors.text, fontSize: 14 },
  disabled: { opacity: 0.35 },
  back: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.xl, minHeight: touchTargets.minimum },
  backText: { color: colors.text },
  notFound: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl },
});
