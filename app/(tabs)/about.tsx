import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { business } from '../../src/config/business';
import { artistImage } from '../../src/data/paintings';
import { services } from '../../src/data/services';
import { radii, serifFont, spacing, typography, touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';

export default function About() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.intro}>
        <View style={styles.introRow}>
          <Text style={styles.eyebrow}>THE ARTIST</Text>
          <Pressable onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel="Appearance preferences" style={styles.settings}>
            <Ionicons name="settings-outline" size={21} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.title}>{business.artist}</Text>
        <Text style={styles.brand}>{business.name}</Text>
        <Text style={styles.subtitle}>{business.tagline}</Text>
      </View>
      <Image source={artistImage} contentFit="cover" style={[styles.portrait, { height: Math.min(width * 0.8, 420) }]} accessibilityLabel="Portrait of Praveen S." />
      <View style={styles.content}>
        <Text style={styles.section}>A life in art</Text>
        <Text style={styles.paragraph}>Praveen S. entered the field of arts at an early age and pursued Fine Arts with dedication and passion. His work spans original paintings and visual effects.</Text>
        <Text style={styles.paragraph}>As a visual effects technician, he has worked with DQ Entertainment International Limited and Discreet Arts, contributing to Indian and overseas projects.</Text>
        <View style={styles.rule} />
        <Text style={styles.section}>The creative process</Text>
        <Text style={styles.quote}>“The source of inspiration for my creative artworks has always been the material world that I see and the dreams that appear in my mind.”</Text>
        <Text style={styles.attribution}>— {business.artist}</Text>
        <View style={styles.rule} />
        <Text style={styles.section}>Services</Text>
        <Text style={styles.paragraph}>
          Directional Works lists twelve enquiry-based offerings covering workshops, mentoring, original art, crafts, media, events and growth conversations. Details are confirmed directly.
        </Text>
        {services.slice(0, 4).map((item) => (
          <Text key={item.id} style={styles.serviceLine}>{item.title}</Text>
        ))}
        <Pressable
          style={({ pressed }) => [styles.galleryLink, styles.firstLink, pressed && { opacity: 0.7 }]}
          onPress={() => router.navigate('/services')}
          accessibilityRole="button"
          accessibilityLabel="View all services"
        >
          <Text style={styles.galleryText}>View all services</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.accent} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.galleryLink, pressed && { opacity: 0.7 }]}
          onPress={() => router.navigate('/gallery')}
          accessibilityRole="button"
        >
          <Text style={styles.galleryText}>Explore original paintings</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.accent} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.galleryLink, pressed && { opacity: 0.7 }]}
          onPress={() => router.navigate('/contact')}
          accessibilityRole="button"
        >
          <Text style={styles.galleryText}>Contact Directional Works</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.accent} />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.galleryLink, pressed && { opacity: 0.7 }]}
          onPress={() => router.push('/privacy')}
          accessibilityRole="button"
        >
          <Text style={styles.galleryText}>Privacy</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.accent} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl },
  intro: { paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl },
  introRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settings: { minWidth: touchTargets.minimum, minHeight: touchTargets.minimum, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { color: colors.accent, fontSize: 11, letterSpacing: 2, marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 36, fontFamily: serifFont },
  brand: { color: colors.accent, fontSize: 14, fontWeight: '600', marginTop: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
  serviceLine: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginBottom: spacing.xs },
  portrait: { width: '100%', maxWidth: 680, alignSelf: 'center', backgroundColor: colors.card },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, maxWidth: 680, width: '100%', alignSelf: 'center' },
  section: { fontFamily: serifFont, fontSize: typography.title, color: colors.text, marginBottom: spacing.lg },
  paragraph: { color: colors.textMuted, fontSize: typography.body, lineHeight: typography.lineHeight, marginBottom: spacing.lg },
  rule: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  quote: { fontFamily: serifFont, fontSize: 20, lineHeight: 30, color: colors.text },
  attribution: { color: colors.accent, marginTop: spacing.md, fontSize: 13 },
  galleryLink: {
    minHeight: touchTargets.minimum, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: colors.surface,
    borderRadius: radii.md, paddingHorizontal: spacing.lg, marginTop: spacing.sm,
  },
  firstLink: { marginTop: spacing.lg },
  galleryText: { fontSize: 15, color: colors.text, fontWeight: '600' },
});
