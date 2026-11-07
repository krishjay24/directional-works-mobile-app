import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { artistImage } from '../../../data/paintings';
import { radii, serifFont, spacing, touchTargets, type ThemeColors } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/ThemeProvider';

export function ArtistPreview() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      onPress={() => router.navigate('/about')}
      accessibilityRole="button"
      accessibilityLabel="View Praveen S. artist profile"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Image source={artistImage} style={styles.portrait} contentFit="cover" />
      <View style={styles.body}>
        <Text style={styles.name}>Praveen S.</Text>
        <Text style={styles.bio} numberOfLines={2}>
          Directional Works · Creative • Growth • Collaboration
        </Text>
        <Text style={styles.action}>View profile</Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      marginHorizontal: spacing.lg,
      marginTop: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      overflow: 'hidden',
      minHeight: touchTargets.minimum + 28,
    },
    pressed: { opacity: 0.88 },
    portrait: { width: 72, height: 88 },
    body: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    name: { fontFamily: serifFont, fontSize: 18, color: colors.text },
    bio: { marginTop: 4, fontSize: 12, lineHeight: 17, color: colors.textMuted },
    action: { marginTop: spacing.sm, fontSize: 13, fontWeight: '600', color: colors.accent },
  });
