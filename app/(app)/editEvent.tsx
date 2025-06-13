import EditEventScreen from '../src/screens/EditEventScreen';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

export default function EditEvent() {
  const params = useLocalSearchParams();
  console.log('EditEvent wrapper - received params:', params);
  return <EditEventScreen />;
}