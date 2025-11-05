// This layout file prevents Expo Router from treating files in this directory as routes
// All files in app/src/ are utility files (components, services, styles, etc.) and not routes

export default function SrcLayout() {
  // This directory contains only utility files, not routes
  // Return null to prevent route creation
  return null;
}

