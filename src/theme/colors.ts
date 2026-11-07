export const darkColors = {
  background: '#12100E',
  surface: '#1C1916',
  card: '#26221D',
  border: '#4A4036',
  inputBorder: '#6E6256',
  text: '#F7F3EB',
  textMuted: '#C4B9AC',
  textDim: '#A89B8C',
  accent: '#D3AE82',
  accentText: '#141210',
  tabSelected: '#3F3428',
  overlay: '#0C0A08BB',
  black: '#000000',
  error: '#E8A0A0',
} as const;

export type ThemeColors = { [K in keyof typeof darkColors]: string };
export const lightColors: ThemeColors = {
  background: '#F8F6F1',
  surface: '#FFFFFF',
  card: '#F3EFE8',
  border: '#D6CBBA',
  inputBorder: '#8A7D6E',
  text: '#222222',
  textMuted: '#5C534A',
  textDim: '#6F655B',
  accent: '#82582C',
  accentText: '#F8F6F1',
  tabSelected: '#F6EBD8',
  overlay: '#1A1612B8',
  black: '#000000',
  error: '#A12828',
};

export const serifFont = 'serif';
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radii = { sm: 8, md: 14, lg: 22, pill: 100 };
export const typography = {
  caption: 12,
  body: 15,
  title: 24,
  display: 30,
  lineHeight: 23,
};
export const iconSizes = { inline: 18, tab: 28, action: 22 };
export const touchTargets = { minimum: 48 };
export const motion = { press: 140, transition: 240 };
export const elevation = { flat: 0 };
