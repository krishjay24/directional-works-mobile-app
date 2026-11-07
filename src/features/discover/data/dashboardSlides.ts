import type { Href } from 'expo-router';

/**
 * Dashboard visuals only. Original paintings live in src/data/paintings.ts
 * and must not be imported here.
 *
 * Images in assets/dashboard/ are conceptual studio photographs generated for
 * UI mockups. They are not Directional Works client work, events, or exhibitions.
 */
export type DashboardRoute = Extract<Href, '/contact' | '/gallery' | '/about'>;

export type HeroSlide = {
  id: string;
  image: number;
  accessibilityLabel: string;
};

export type ServiceIcon =
  | 'color-palette'
  | 'school'
  | 'brush'
  | 'sparkles'
  | 'calendar'
  | 'git-network';

export type ActivityIcon = 'easel-outline' | 'create-outline' | 'pencil-outline';

export type ServiceItem = {
  id: string;
  icon: ServiceIcon;
  label: string;
  href: DashboardRoute;
};

export type ActivityItem = {
  id: string;
  icon: ActivityIcon;
  title: string;
  href: DashboardRoute;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'expression',
    image: require('../../../../assets/dashboard/slide-expression.jpg'),
    accessibilityLabel: 'Creative studio, painting on canvas',
  },
  {
    id: 'mentoring',
    image: require('../../../../assets/dashboard/slide-mentoring.jpg'),
    accessibilityLabel: 'Drawing session, mentoring',
  },
  {
    id: 'workshops',
    image: require('../../../../assets/dashboard/slide-workshops.jpg'),
    accessibilityLabel: 'Art workshop studio',
  },
  {
    id: 'branding',
    image: require('../../../../assets/dashboard/slide-branding.jpg'),
    accessibilityLabel: 'Design workspace',
  },
  {
    id: 'events',
    image: require('../../../../assets/dashboard/slide-events.jpg'),
    accessibilityLabel: 'Creative gathering space',
  },
];

export const SERVICES: ServiceItem[] = [
  { id: 'workshops', icon: 'color-palette', label: 'Workshops', href: '/contact' },
  { id: 'mentoring', icon: 'school', label: 'Mentoring', href: '/contact' },
  { id: 'fine-art', icon: 'brush', label: 'Fine Art', href: '/contact' },
  { id: 'branding', icon: 'sparkles', label: 'Branding', href: '/contact' },
  { id: 'events', icon: 'calendar', label: 'Events', href: '/contact' },
  { id: 'collaboration', icon: 'git-network', label: 'Collaborate', href: '/contact' },
];

export const ACTIVITIES: ActivityItem[] = [
  { id: 'studio', icon: 'easel-outline', title: 'Studio practice', href: '/contact' },
  { id: 'calligraphy', icon: 'create-outline', title: 'Calligraphy', href: '/contact' },
  { id: 'workshop', icon: 'pencil-outline', title: 'Group drawing', href: '/contact' },
];
