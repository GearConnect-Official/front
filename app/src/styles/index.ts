// Re-export all styles organized by category
export * from './components';
export * from './auth'; 
export * from './screens';
export * from './modals';
export * from './media';

// Keep existing exports
export { default as ThemeProvider } from './ThemeProvider'; 

// Export par défaut factice pour Expo Router
export default () => null;