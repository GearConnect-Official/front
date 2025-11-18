import * as yaml from 'js-yaml';
import { Asset } from 'expo-asset';

export interface TermsSection {
  title: string;
  content: string;
}

export interface TermsData {
  title: string;
  lastUpdated: string;
  version: string;
  sections: TermsSection[];
}

/**
 * Load and parse YAML file from assets
 * For React Native, we'll need to use require() to load the file
 */
export const loadTermsAndConditions = async (): Promise<TermsData> => {
  try {
    // In React Native, we can't directly import YAML files
    // We'll use a different approach: store as JSON or use require with a loader
    // For now, we'll create a TypeScript file that exports the parsed YAML
    // This is more reliable in React Native/Expo environment
    
    // Alternative: Load from a bundled asset
    // For Expo, we can use require() with a .yaml file if we configure metro bundler
    // Or we can convert YAML to JSON at build time
    
    // For simplicity and reliability in React Native, we'll use a direct import
    // The YAML will be converted to a TypeScript constant at build time
    throw new Error('YAML loading not directly supported in React Native. Use loadTermsFromModule instead.');
  } catch (error) {
    console.error('Error loading YAML:', error);
    throw error;
  }
};

/**
 * Load terms from a TypeScript module (converted from YAML)
 * This is more reliable in React Native/Expo
 */
export const loadTermsFromModule = (): TermsData => {
  // This will be replaced with actual YAML parsing
  // For now, return a default structure
  return {
    title: "Terms & Conditions",
    lastUpdated: "2024-01-15",
    version: "1.0",
    sections: []
  };
};

