// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get project root using Node.js built-in methods (works in CommonJS)
const projectRoot = path.dirname(require.main?.filename || process.cwd());

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot, {
  // [Web-only]: Enables CSS support for Expo router.
  isCSSEnabled: true,
});

// Fix for module resolution issues
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
  },
};

module.exports = config; 