import React, { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';

export interface Theme {
  background: string;
  surface: string;
  surfaceLevel2: string;
  surfaceVariant: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  primaryVariant: string;
  secondary: string;
  accent: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  border: string;
  borderLight: string;
  shadow: string;
  disabled: string;
  glass: string;
  glassLight: string;
  glassBorder: string;
  glassShadow: string;
  overlay: string;
  elevation: {
    low: string;
    medium: string;
    high: string;
  };
  alert: string;
  campaign: string;
}

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37 },
  title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.36 },
  title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.35 },
  title3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.38 },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.41 },
  body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.41 },
  callout: { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32 },
  subhead: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.24 },
  footnote: { fontSize: 13, fontWeight: '400' as const, letterSpacing: -0.08 },
  caption1: { fontSize: 12, fontWeight: '400' as const, letterSpacing: 0 },
  caption2: { fontSize: 11, fontWeight: '400' as const, letterSpacing: 0.07 },
};

export const spacing = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 9999,
};

export const themes = {
  light: {
    background: '#F5F5F7',
    surface: 'rgba(255, 255, 255, 0.75)',
    surfaceLevel2: 'rgba(255, 255, 255, 0.85)',
    surfaceVariant: 'rgba(242, 242, 247, 0.65)',
    surfaceElevated: 'rgba(255, 255, 255, 0.95)',
    text: '#1D1D1F',
    textSecondary: '#86868B',
    textTertiary: '#d2d2d7',
    primary: '#0066CC',
    primaryLight: 'rgba(0, 102, 204, 0.1)',
    primaryVariant: '#004499',
    secondary: '#34C759',
    accent: '#5E5CE6',
    success: '#34C759',
    successLight: 'rgba(52, 199, 89, 0.15)',
    warning: '#FF9F0A',
    warningLight: 'rgba(255, 159, 10, 0.15)',
    error: '#FF3B30',
    errorLight: 'rgba(255, 59, 48, 0.15)',
    border: 'rgba(0, 0, 0, 0.05)',
    borderLight: 'rgba(255, 255, 255, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.04)',
    disabled: 'rgba(0, 0, 0, 0.1)',
    glass: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.55)',
    glassLight: Platform.OS === 'web' ? 'transparent' : 'rgba(255, 255, 255, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
    glassShadow: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    elevation: {
      low: 'rgba(0, 0, 0, 0.02)',
      medium: 'rgba(0, 0, 0, 0.04)',
      high: 'rgba(0, 0, 0, 0.08)',
    },
    alert: '#FF3B30',
    campaign: '#0066CC',
  } as Theme,
  dark: {
    background: '#000000',
    surface: 'rgba(28, 28, 30, 0.65)',
    surfaceLevel2: 'rgba(44, 44, 46, 0.75)',
    surfaceVariant: 'rgba(28, 28, 30, 0.4)',
    surfaceElevated: 'rgba(44, 44, 46, 0.9)',
    text: '#F5F5F7',
    textSecondary: '#86868B',
    textTertiary: '#424245',
    primary: '#2997FF',
    primaryLight: 'rgba(41, 151, 255, 0.15)',
    primaryVariant: '#147CE6',
    secondary: '#30D158',
    accent: '#5E5CE6',
    success: '#30D158',
    successLight: 'rgba(48, 209, 88, 0.15)',
    warning: '#FF9F0A',
    warningLight: 'rgba(255, 159, 10, 0.15)',
    error: '#FF453A',
    errorLight: 'rgba(255, 69, 58, 0.15)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.04)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.15)',
    glass: Platform.OS === 'web' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(28, 28, 30, 0.55)',
    glassLight: Platform.OS === 'web' ? 'transparent' : 'rgba(44, 44, 46, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.12)',
    glassShadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    elevation: {
      low: 'rgba(0, 0, 0, 0.2)',
      medium: 'rgba(0, 0, 0, 0.4)',
      high: 'rgba(0, 0, 0, 0.6)',
    },
    alert: '#FF453A',
    campaign: '#2997FF',
  } as Theme,
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value: ThemeContextType = {
    theme,
    colors: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};