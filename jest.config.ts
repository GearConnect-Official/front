module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@testing-library/react-native|react-native-vector-icons)/)",
  ],
  testEnvironment: "node",
};
