module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  setupFilesAfterEnv: ["<rootDir>/app/__tests__/setup.js"],
  moduleNameMapper: {
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/", "/\\.expo/"],
  collectCoverage: true,
  testEnvironment: "node",
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/__tests__/**",
    "!app/metro.config.js",
    "!app/babel.config.js",
  ],
};
