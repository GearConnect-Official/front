import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import BottomNav from '../../src/components/ui/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props: any) => <BottomNav {...props} />}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="events" 
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="jobs" 
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="publication" 
        options={{
          title: 'Post',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="plus-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen 
        name="network" 
        options={{
          title: 'Network',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" size={size} color={color} />
          ),
        }}
      />
      {/* Status tab - seulement en développement */}
      {__DEV__ && (
        <Tabs.Screen 
          name="status" 
          options={{
            title: 'Status',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="heartbeat" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tabs>
  );
} 