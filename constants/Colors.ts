export const Themes = {
  OLED: {
    dark: '#000000',
    light: '#ffffff',
    gray: '#333333',
    lightGray: '#a6a6a6',
    accent: '#ff9f0a',
    textPrimary: '#ffffff',
    textSecondary: '#a6a6a6',
    secondary: '#1C1C1E',
    black: '#000000',
    name: 'OLED (Deep Black)'
  },
  Midnight: {
    dark: '#010409',
    light: '#ffffff',
    gray: '#21262d',
    lightGray: '#8b949e',
    accent: '#58a6ff',
    textPrimary: '#ffffff',
    textSecondary: '#8b949e',
    secondary: '#0d1117',
    black: '#000000',
    name: 'Midnight Blue'
  },
  Slate: {
    dark: '#0f172a',
    light: '#ffffff',
    gray: '#334155',
    lightGray: '#94a3b8',
    accent: '#38bdf8',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    secondary: '#1e293b',
    black: '#020617',
    name: 'Slate Gray'
  },
  Retro: {
    dark: '#8b9b8b',
    light: '#ffffff',
    gray: '#7a8a7a',
    lightGray: '#6b7b6b',
    accent: '#000000',
    textPrimary: '#000000',
    textSecondary: '#4a5a4a',
    secondary: '#9cad9c',
    black: '#000000',
    name: 'Retro LCD'
  }
};

// Default legacy export for compatibility during transition
export const Colors = Themes.OLED;

export type AppTheme = keyof typeof Themes;
