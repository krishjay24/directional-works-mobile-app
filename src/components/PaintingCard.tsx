import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { Painting } from '../data/paintings';
import { radii, spacing, type ThemeColors } from '../theme/colors';
import { useAppTheme } from '../theme/ThemeProvider';

export function PaintingCard({ painting }: { painting: Painting }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Link href={`/painting/${painting.id}`} asChild>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`View ${painting.title}`}
      >
        <View style={styles.frame}>
          <Image
            source={painting.image}
            style={styles.image}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>
        <View style={styles.titleBar}>
          <Text style={styles.title} numberOfLines={1}>
            {painting.title}
          </Text>
          <Text style={styles.category}>{painting.category}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: radii.md,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  frame: {
    width: '100%',
    aspectRatio: 4 / 5,
    padding: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  titleBar: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  category: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'capitalize',
    marginTop: spacing.xs,
  },
});
