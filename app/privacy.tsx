import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { business } from '../src/config/business';
import { serifFont, spacing, touchTargets, type ThemeColors } from '../src/theme/colors';
import { useAppTheme } from '../src/theme/ThemeProvider';

export default function PrivacyPolicy() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/settings'))}
        accessibilityRole="button"
        accessibilityLabel="Back"
        style={styles.back}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Privacy</Text>
      <Text style={styles.meta}>{business.name} · {business.artist}</Text>
      <Text style={styles.p}>
        This policy describes how the Directional Works mobile app handles information. It is written from the current app behaviour and may need owner legal review.
      </Text>
      <Text style={styles.h}>What you may enter</Text>
      <Text style={styles.p}>
        On Contact you can type a name, email address and message. That text stays on your device until you choose to continue in another app. The Directional Works app does not operate its own message server and does not confirm that a message was delivered.
      </Text>
      <Text style={styles.h}>WhatsApp, phone and email</Text>
      <Text style={styles.p}>
        Message, Call and Email open WhatsApp, the phone app or your mail app using {business.phoneDisplay} and {business.email}. Those apps have their own privacy practices. Directional Works does not receive a copy of the chat unless you send it there.
      </Text>
      <Text style={styles.h}>Appearance settings</Text>
      <Text style={styles.p}>
        Dark, Light or System appearance is stored on this device with AsyncStorage so the choice can persist. It is not sent to Directional Works.
      </Text>
      <Text style={styles.h}>Notifications</Text>
      <Text style={styles.p}>
        The Inbox screen is a local placeholder. This app does not currently send or receive push notifications and does not request notification permission for that purpose.
      </Text>
      <Text style={styles.h}>Analytics</Text>
      <Text style={styles.p}>This app does not include a third-party analytics product in the current source.</Text>
      <Text style={styles.h}>Contact</Text>
      <Text style={styles.p}>
        {business.email} · {business.phoneDisplay} · {business.hours}
      </Text>
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.xl, maxWidth: 680, width: '100%', alignSelf: 'center' },
    back: { minHeight: touchTargets.minimum, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, alignSelf: 'flex-start' },
    backText: { color: colors.text, fontSize: 14 },
    title: { color: colors.text, fontFamily: serifFont, fontSize: 32, marginTop: spacing.xl },
    meta: { color: colors.accent, fontSize: 13, marginTop: spacing.sm, marginBottom: spacing.lg },
    h: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.sm },
    p: { color: colors.textMuted, fontSize: 14, lineHeight: 22 },
  });
