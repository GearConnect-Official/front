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
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      eas: {
        projectId: "76d9f701-5132-4e95-955c-76578f90d7a6"
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