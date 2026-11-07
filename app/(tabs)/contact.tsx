import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { WhatsAppMessageButton } from '../../src/components/WhatsAppMessageButton';
import { business } from '../../src/config/business';
import { contactEmailBody, contactEmailSubject, openEmail, openPhoneCall } from '../../src/lib/linking';
import {
  CONTACT_PHONE_DISPLAY,
  contactFormEnquiryMessage,
  generalEnquiryMessage,
  openWhatsAppMessage,
} from '../../src/lib/whatsapp';
import { radii, spacing, typography, touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type Field = 'name' | 'email' | 'message';
type Handoff = 'whatsapp' | 'email';

export default function Contact() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState<Field | null>(null);
  const [status, setStatus] = useState('');

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('Please complete every field before continuing.');
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setStatus('Please enter a valid email address.');
      return false;
    }
    setStatus('');
    return true;
  };

  const continueHandoff = (channel: Handoff) => {
    if (!validate()) return;
    if (channel === 'whatsapp') {
      void openWhatsAppMessage(contactFormEnquiryMessage(form.name, form.email, form.message));
      return;
    }
    void openEmail(
      contactEmailSubject(),
      contactEmailBody(form.name, form.email, form.message),
    );
  };

  const field = (name: Field, label: string, props: { keyboardType?: 'email-address'; multiline?: boolean }) => (
    <View style={styles.field} key={name}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        style={[styles.input, props.multiline && styles.textarea, focused === name && styles.focused]}
        placeholder={label}
        placeholderTextColor={colors.textDim}
        value={form[name]}
        onChangeText={(text) => { setForm((prev) => ({ ...prev, [name]: text })); setStatus(''); }}
        onFocus={() => setFocused(name)}
        onBlur={() => setFocused(null)}
        keyboardType={props.keyboardType}
        autoCapitalize={name === 'email' ? 'none' : 'sentences'}
        autoCorrect={name !== 'email'}
        multiline={props.multiline}
        numberOfLines={props.multiline ? 5 : 1}
        textAlignVertical={props.multiline ? 'top' : 'center'}
        returnKeyType={props.multiline ? 'default' : 'next'}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Contact" subtitle={`${business.hours} ${business.tagline}`} />
        <View style={styles.content}>
          <Text style={styles.heading}>Reach Directional Works</Text>
          <Text style={styles.explanation}>
            Open WhatsApp, place a call, or start an email. Messages leave this app only after you confirm them in the other app.
          </Text>
          <Text style={styles.number}>{CONTACT_PHONE_DISPLAY}</Text>
          <Text style={styles.email}>{business.email}</Text>
          <View style={styles.messageAction}>
            <WhatsAppMessageButton label="Message" draft={generalEnquiryMessage()} />
          </View>
          <View style={styles.row}>
            <Pressable
              onPress={() => void openPhoneCall()}
              accessibilityRole="button"
              accessibilityLabel={`Call ${CONTACT_PHONE_DISPLAY}`}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Ionicons name="call-outline" size={18} color={colors.accent} />
              <Text style={styles.secondaryLabel}>Call</Text>
            </Pressable>
            <Pressable
              onPress={() => void openEmail(contactEmailSubject())}
              accessibilityRole="button"
              accessibilityLabel={`Email ${business.email}`}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.accent} />
              <Text style={styles.secondaryLabel}>Email</Text>
            </Pressable>
          </View>
          <Text style={styles.formTitle}>Write an enquiry</Text>
          <Text style={styles.explanation}>
            Your notes stay on this device until you tap Continue. Directional Works does not receive the message from this form automatically.
          </Text>
          {field('name', 'Your name', {})}
          {field('email', 'Email address', { keyboardType: 'email-address' })}
          {field('message', 'Your message', { multiline: true })}
          {!!status && <Text accessibilityRole="alert" style={styles.status}>{status}</Text>}
          <Pressable
            onPress={() => continueHandoff('whatsapp')}
            accessibilityRole="button"
            accessibilityLabel="Continue to WhatsApp with this enquiry"
            style={({ pressed }) => [styles.send, pressed && styles.pressed]}
          >
            <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
            <Text style={styles.sendLabel}>Continue to WhatsApp</Text>
          </Pressable>
          <Pressable
            onPress={() => continueHandoff('email')}
            accessibilityRole="button"
            accessibilityLabel="Continue to email with this enquiry"
            style={({ pressed }) => [styles.emailBtn, pressed && styles.pressed]}
          >
            <Ionicons name="mail-outline" size={20} color={colors.accent} />
            <Text style={styles.emailBtnLabel}>Continue to Email</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxl, flexGrow: 1 },
  content: { paddingHorizontal: spacing.xl, maxWidth: 680, width: '100%', alignSelf: 'center' },
  heading: { fontSize: 22, color: colors.text, marginBottom: spacing.sm },
  explanation: { fontSize: 14, color: colors.textMuted, lineHeight: 21, marginBottom: spacing.md },
  number: { fontSize: 18, fontWeight: '600', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.md, marginTop: 4 },
  messageAction: { marginBottom: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  secondary: {
    flex: 1,
    minHeight: touchTargets.minimum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  secondaryLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  formTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  field: { marginBottom: spacing.lg },
  label: { color: colors.text, fontSize: 14, marginBottom: spacing.sm, fontWeight: '500' },
  input: {
    minHeight: touchTargets.minimum, paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: radii.sm,
    backgroundColor: colors.surface, color: colors.text, fontSize: typography.body,
  },
  focused: { borderColor: colors.accent },
  textarea: { height: 136 },
  status: { color: colors.error, fontSize: 14, lineHeight: 21, marginBottom: spacing.lg },
  send: {
    minHeight: touchTargets.minimum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: '#25D366',
  },
  sendLabel: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  emailBtn: {
    minHeight: touchTargets.minimum,
    marginTop: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emailBtnLabel: { fontSize: 15, fontWeight: '700', color: colors.accent },
  pressed: { opacity: 0.85 },
});
