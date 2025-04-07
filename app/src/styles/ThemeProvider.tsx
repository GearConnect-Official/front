import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './config/themes';

// Type pour le contexte du thème
type ThemeContextType = {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

// Création du contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Hook pour utiliser le thème
export const useTheme = () => useContext(ThemeContext);

// Props du ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'system',
}) => {
  // Détection du mode sombre du système
  const colorScheme = useColorScheme();
  
  // État pour stocker le thème actuel
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    initialTheme === 'system' 
      ? (colorScheme === 'dark' ? 'dark' : 'light') 
      : initialTheme
  );
  
  // Mise à jour du thème lorsque le mode système change
  useEffect(() => {
    if (initialTheme === 'system') {
      setThemeMode(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme, initialTheme]);
  
  // Vérifie si le mode sombre est actif
  const isDarkMode = themeMode === 'dark';
  
  // Objet thème actuel
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Fonction pour définir un thème spécifique
  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeMode(newTheme);
  };
  
  // Valeur du contexte
  const contextValue: ThemeContextType = {
    theme,
    isDarkMode,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 