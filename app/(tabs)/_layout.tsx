import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { touchTargets, type ThemeColors } from '../../src/theme/colors';
import { useAppTheme } from '../../src/theme/ThemeProvider';
import { AppHeader } from '../../src/components/AppHeader';

const ICON_SIZE = 28;

const tabs = [
  { name: 'home', label: 'Discover', icon: 'compass', outline: 'compass-outline' },
  { name: 'services', label: 'Services', icon: 'grid', outline: 'grid-outline' },
  { name: 'gallery', label: 'Gallery', icon: 'images', outline: 'images-outline' },
  { name: 'contact', label: 'Contact', icon: 'chatbubble-ellipses', outline: 'chatbubble-ellipses-outline' },
  { name: 'about', label: 'Profile', icon: 'person-circle', outline: 'person-circle-outline' },
] as const;

export default function TabLayout() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Tabs screenOptions={{
      headerShown: true,
      header: () => <AppHeader />,
      lazy: false,
      freezeOnBlur: true,
      tabBarHideOnKeyboard: true,
      tabBarPosition: 'bottom',
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.accent,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        height: 58 + insets.bottom,
        paddingTop: 8,
        paddingBottom: insets.bottom,
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 0,
      },
      tabBarItemStyle: {
        minHeight: touchTargets.minimum,
        justifyContent: 'center',
      },
    }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarAccessibilityLabel: `${tab.label} tab`,
            tabBarButtonTestID: `tab-${tab.name}`,
            tabBarIcon: ({ focused, color }) => (
              <View style={[styles.icon, focused && styles.selectedIcon]}>
                <Ionicons name={focused ? tab.icon : tab.outline} size={ICON_SIZE} color={color as string} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  icon: {
    width: 48,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: { backgroundColor: colors.tabSelected },
});
