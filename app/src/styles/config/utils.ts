/**
 * Utilitaires pour le design system
 */

/**
 * Fusionne profondément deux objets
 * Cette fonction est utilisée pour surcharger le thème par défaut avec des thèmes personnalisés
 */
export function deepMerge<T extends Record<string, any>, U extends Record<string, any>>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as T & U;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Vérifie si une valeur est un objet
 */
function isObject(item: any): item is Record<string, any> {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Crée un thème avec une palette de couleurs personnalisée
 */
export function createTheme(themeOptions: Record<string, any>) {
  return themeOptions;
}

// Exporting utility functions as default to avoid Expo Router warnings
const utils = {
  deepMerge,
  createTheme,
  isObject
};

export default utils; 