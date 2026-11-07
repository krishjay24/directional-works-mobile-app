import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CONTACT_PHONE_DISPLAY, openWhatsAppMessage } from '../lib/whatsapp';
import { radii, spacing, touchTargets } from '../theme/colors';

const WHATSAPP_GREEN = '#25D366';
const WHATSAPP_ON_GREEN = '#FFFFFF';

type Props = {
  label?: string;
  draft?: string;
};

export function WhatsAppMessageButton({ label = 'Message', draft }: Props) {
  const styles = useMemo(() => makeStyles(), []);

  return (
    <Pressable
      onPress={() => void openWhatsAppMessage(draft)}
      accessibilityRole="button"
      accessibilityLabel={`Message ${CONTACT_PHONE_DISPLAY}`}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="logo-whatsapp" size={24} color={WHATSAPP_ON_GREEN} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    button: {
      minHeight: touchTargets.minimum,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.pill,
      backgroundColor: WHATSAPP_GREEN,
    },
    pressed: { opacity: 0.85 },
    iconWrap: {
      width: 28,
      height: 28,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '700',
      color: WHATSAPP_ON_GREEN,
    },
  });
