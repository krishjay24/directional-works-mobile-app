import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';

type Props = {
  title: string;
  subtitle?: string;
};

export function DashboardSectionHeader({ title, subtitle }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      marginTop: 4,
      fontSize: 12,
      lineHeight: 17,
      color: colors.textMuted,
    },
  });
