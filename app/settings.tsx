import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme, type AppearancePreference } from '../src/theme/ThemeProvider';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../src/theme/colors';

const options: { value: AppearancePreference; title: string; description: string }[] = [
  { value: 'dark', title: 'Dark', description: 'A quiet, gallery-inspired backdrop' },
  { value: 'light', title: 'Light', description: 'An airy space for the collection' },
  { value: 'system', title: 'System default', description: 'Follow your device appearance' },
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { colors, preference, setPreference } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView style={styles.page} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }]}>
      <Pressable onPress={() => router.canGoBack() ? router.back() : router.replace('/about')} accessibilityRole="button" accessibilityLabel="Back to artist profile" style={styles.back}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
        <Text style={styles.backLabel}>About</Text>
      </Pressable>
      <Text style={styles.title}>Preferences</Text>
      <Text style={styles.description}>Make the gallery feel like yours.</Text>
      <Text style={styles.section}>APPEARANCE</Text>
      <View style={styles.options} accessibilityRole="radiogroup">
        {options.map((option, index) => (
          <Pressable
            key={option.value}
            onPress={() => setPreference(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: preference === option.value }}
            accessibilityLabel={`${option.title}, ${option.description}`}
            style={({ pressed }) => [styles.option, index < options.length - 1 && styles.divider, pressed && styles.pressed]}
          >
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Ionicons name={preference === option.value ? 'radio-button-on' : 'radio-button-off'} size={23} color={preference === option.value ? colors.accent : colors.textMuted} />
          </Pressable>
        ))}
      </View>
      <Text style={styles.note}>The fullscreen artwork viewer always stays dark to keep the paintings in focus.</Text>
      <Pressable
        onPress={() => router.push('/privacy')}
        accessibilityRole="button"
        accessibilityLabel="Open privacy policy"
        style={({ pressed }) => [styles.privacy, pressed && styles.pressed]}
      >
        <Text style={styles.privacyText}>Privacy</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.accent} />
      </Pressable>
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.xl, maxWidth: 680, width: '100%', alignSelf: 'center' },
  back: { minHeight: touchTargets.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start' },
  backLabel: { color: colors.text, fontSize: 14 },
  title: { color: colors.text, fontFamily: serifFont, fontSize: 32, marginTop: spacing.xl },
  description: { color: colors.textMuted, fontSize: 14, marginTop: spacing.sm },
  section: { color: colors.accent, fontSize: 11, letterSpacing: 1.5, marginTop: spacing.xxl, marginBottom: spacing.md },
  options: { borderRadius: radii.md, backgroundColor: colors.surface, paddingHorizontal: spacing.lg },
  option: { minHeight: 76, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  optionCopy: { flex: 1 },
  optionTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  optionDescription: { color: colors.textMuted, fontSize: 12, marginTop: spacing.xs },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  pressed: { opacity: 0.7 },
  note: { color: colors.textDim, fontSize: 13, lineHeight: 20, marginTop: spacing.xl },
  privacy: {
    marginTop: spacing.xl,
    minHeight: touchTargets.minimum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
  },
  privacyText: { color: colors.text, fontSize: 16, fontWeight: '600' },
});
