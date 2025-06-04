import React, { createContext, useContext, ReactNode } from 'react';
import theme from '../styles/config/theme';

// Type du thème
type ThemeType = typeof theme;

// Contexte du thème
const ThemeContext = createContext<ThemeType | undefined>(undefined);

// Provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le thème
export const useTheme = (): ThemeType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider; 