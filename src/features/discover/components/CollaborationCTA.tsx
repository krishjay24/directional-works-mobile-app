import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WhatsAppMessageButton } from '../../../components/WhatsAppMessageButton';
import { radii, serifFont, spacing, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';

export function CollaborationCTA() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Have a creative idea?</Text>
      <Text style={styles.body}>Connect with Directional Works to explore creative opportunities.</Text>
      <View style={styles.action}>
        <WhatsAppMessageButton label="Message" />
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl,
      padding: spacing.lg,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
    },
    title: {
      fontFamily: serifFont,
      fontSize: 20,
      color: colors.text,
    },
    body: {
      marginTop: spacing.sm,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
    },
    action: { marginTop: spacing.lg },
  });
