import 'dotenv/config';

export default {
  expo: {
    name: "GearConnect",
    slug: "gearconnect",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/images/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./app/assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gearconnect.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.gearconnect.app"
    },
    web: {
      favicon: "./app/assets/images/favicon.png"
    },
    extra: {
      apiProtocol: process.env.API_PROTOCOL,
      apiHost: process.env.API_HOST,
      apiPort: parseInt(process.env.API_PORT, 10),
      eas: {
        projectId: "your-project-id"
      }
    },
    scheme: "gearconnect",
    plugins: [
      "expo-router",
      "expo-font",
      "expo-web-browser"
    ]
  }
}; 