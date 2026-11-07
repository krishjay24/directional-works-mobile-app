import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { serifFont, spacing, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';

export function DiscoverHeader() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap} accessibilityRole="header">
      <Text style={styles.brand}>DIRECTIONAL WORKS</Text>
      <View style={styles.rule} />
      <Text style={styles.tagline}>Creative  ·  Growth  ·  Collaboration</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.sm,
      paddingBottom: spacing.sm,
    },
    brand: {
      fontSize: 13,
      letterSpacing: 2.2,
      fontWeight: '700',
      color: colors.text,
    },
    rule: {
      width: 36,
      height: 2,
      borderRadius: 1,
      backgroundColor: colors.accent,
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    tagline: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: serifFont,
    },
  });
