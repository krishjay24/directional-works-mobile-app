import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { serifFont, spacing, typography, type ThemeColors } from '../theme/colors';
import { useAppTheme } from '../theme/ThemeProvider';

export function ScreenHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    color: colors.text,
    fontFamily: serifFont,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: typography.body,
    color: colors.textMuted,
  },
});
