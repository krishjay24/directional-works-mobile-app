import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../src/theme/ThemeProvider';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../src/theme/colors';

export default function Notifications() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable
        onPress={() => router.canGoBack() ? router.back() : router.replace('/home')}
        accessibilityRole="button"
        accessibilityLabel="Close notifications"
        style={styles.back}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Inbox</Text>
      <Text style={styles.subtitle}>Messages & notifications</Text>
      <View style={styles.rule} />
      <View style={styles.empty}>
        <View style={styles.icon}>
          <Ionicons name="notifications-outline" size={32} color={colors.accent} />
        </View>
        <Text style={styles.emptyTitle}>Nothing new here</Text>
        <Text style={styles.description}>
          This screen is a local inbox placeholder. The app does not currently send or receive push notifications, and no notification permission is requested for that purpose.
        </Text>
      </View>
      <Pressable
        onPress={() => router.replace('/contact')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.action, pressed && styles.pressed]}
      >
        <Text style={styles.actionText}>Open contact</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.accentText} />
      </Pressable>
      <Text style={styles.note}>Use Contact to send a message.</Text>
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, maxWidth: 680, width: '100%', alignSelf: 'center' },
  back: { minHeight: touchTargets.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start' },
  backText: { color: colors.text, fontSize: 14 },
  title: { color: colors.text, fontFamily: serifFont, fontSize: 30, marginTop: spacing.xl },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginTop: spacing.xl },
  empty: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', minHeight: 260, paddingVertical: spacing.xxl },
  icon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.tabSelected, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 19, fontWeight: '600', marginTop: spacing.xl },
  description: { color: colors.textMuted, fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: spacing.sm },
  action: {
    minHeight: 52, backgroundColor: colors.accent, borderRadius: radii.sm,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: spacing.sm,
  },
  actionText: { color: colors.accentText, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.7 },
  note: { color: colors.textDim, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.lg },
});
