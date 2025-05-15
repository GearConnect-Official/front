import { Tabs } from 'expo-router';
import BottomNav from '../../src/components/BottomNav';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNav {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="network" />
      <Tabs.Screen name="publication" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="jobs" />
    </Tabs>
  );
} 