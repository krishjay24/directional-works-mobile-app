import { ScrollView, StyleSheet } from 'react-native';
import { ArtistPreview } from '../../src/features/discover/components/ArtistPreview';
import { CreativeActivities } from '../../src/features/discover/components/CreativeActivities';
import { CreativeHeroCarousel } from '../../src/features/discover/components/CreativeHeroCarousel';
import { DiscoverHeader } from '../../src/features/discover/components/DiscoverHeader';
import { GalleryShortcut } from '../../src/features/discover/components/GalleryShortcut';
import { ServiceDiscovery } from '../../src/features/discover/components/ServiceDiscovery';
import { spacing, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';
import { useMemo } from 'react';

export default function Discover() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <DiscoverHeader />
      <CreativeHeroCarousel />
      <ServiceDiscovery />
      <CreativeActivities />
      <GalleryShortcut />
      <ArtistPreview />
    </ScrollView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: spacing.xxl },
  });
