import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const Colors = {
  // DF Construções brand palette
  navy: '#071C36',
  navyMedium: '#0D2B52',
  navyLight: '#1A3A6B',
  gray: '#6A6F77',
  grayLight: '#9EA3AA',
  grayBorder: '#E5E7EB',
  grayBackground: '#F5F6F8',
  orange: '#F97316',
  orangeLight: '#FEF3EA',
  orangeDark: '#EA6C0A',
  white: '#FFFFFF',
  black: '#000000',

  // Semantic
  success: '#22C55E',
  successLight: '#DCFCE7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  info: '#3B82F6',
  infoLight: '#DBEAFE',

  // Text hierarchy
  textPrimary: '#071C36',
  textSecondary: '#6A6F77',
  textTertiary: '#9EA3AA',
  textDisabled: '#C4C9D0',
  textOnDark: '#FFFFFF',
  textOnOrange: '#FFFFFF',

  // Backgrounds
  backgroundPrimary: '#F5F6F8',
  backgroundCard: '#FFFFFF',
  backgroundModal: '#FFFFFF',

  // Overlay
  overlay: 'rgba(7, 28, 54, 0.6)',
  overlayLight: 'rgba(7, 28, 54, 0.04)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Typography = {
  // Sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,

  // Weights (as font weight strings)
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const PaperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.navy,
    secondary: Colors.orange,
    background: Colors.backgroundPrimary,
    surface: Colors.backgroundCard,
    onPrimary: Colors.white,
    onSecondary: Colors.white,
    onBackground: Colors.textPrimary,
    onSurface: Colors.textPrimary,
    error: Colors.danger,
    outline: Colors.grayBorder,
    surfaceVariant: Colors.grayBackground,
    onSurfaceVariant: Colors.textSecondary,
  },
  fonts: {
    ...MD3LightTheme.fonts,
  },
  roundness: 12,
};
