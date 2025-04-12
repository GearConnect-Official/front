import { useLocalSearchParams } from 'expo-router';
import EventDetailScreen from '../src/screens/EventDetailScreen';
import React from 'react';

export default function EventDetail() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  return <EventDetailScreen eventId={Number(eventId)} />;
} 