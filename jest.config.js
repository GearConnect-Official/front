module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: ['<rootDir>/app/__tests__/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/app/__tests__/__mocks__/fileMock.js'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/\\.expo/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/__tests__/**',
    '!app/metro.config.js',
    '!app/babel.config.js'
  ]
}; 