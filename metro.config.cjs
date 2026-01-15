// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get project root - use process.cwd() which works in all Node.js environments
const projectRoot = process.cwd();

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot, {
  // [Web-only]: Enables CSS support for Expo router.
  isCSSEnabled: true,
});

// Fix for module resolution issues - ensure proper node_modules resolution
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
  ],
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
  },
};

module.exports = config; 