import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import eventService from '../src/services/eventService';
import { Event } from '../src/services/eventService';
import { TRACK_CONDITIONS } from '../src/types/performance.types';
import { styles } from '../src/styles/screens/events/eventDetailStyles';

const PostEventInfoScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [trackCondition, setTrackCondition] = useState<'dry' | 'wet' | 'mixed' | 'damp' | 'slippery' | 'drying' | ''>('');
  const [eventResultsLink, setEventResultsLink] = useState<string>('');
  const [seasonResultsLink, setSeasonResultsLink] = useState<string>('');
  
  // Modal states
  const [showTrackConditionModal, setShowTrackConditionModal] = useState(false);

  const loadEvent = async () => {
    if (!eventId) {
      setError('Event ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);
      
      // Pre-fill form with existing data
      const meteo = eventData.meteo || {};
      setTrackCondition(meteo.trackCondition || '');
      setEventResultsLink(meteo.eventResultsLink || '');
      setSeasonResultsLink(meteo.seasonResultsLink || '');
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError('Failed to load event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvent();
    }, [eventId])
  );

  const handleSave = async () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID is missing');
      return;
    }

    setSaving(true);
    try {
      const meteo = {
        trackCondition: trackCondition || undefined,
        eventResultsLink: eventResultsLink.trim() || undefined,
        seasonResultsLink: seasonResultsLink.trim() || undefined,
      };

      // Remove undefined values
      Object.keys(meteo).forEach(key => {
        if (meteo[key as keyof typeof meteo] === undefined) {
          delete meteo[key as keyof typeof meteo];
        }
      });

      const updateData = {
        meteo: meteo,
      };

      await eventService.updateEvent(eventId, updateData);
      
      Alert.alert('Success', 'Event information has been saved successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      console.error('Error saving event info:', err);
      Alert.alert('Error', 'Failed to save event information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getTrackConditionDisplay = () => {
    if (!trackCondition) return 'Select track condition';
    const condition = TRACK_CONDITIONS.find(c => c.value === trackCondition);
    return condition ? `${condition.emoji} ${condition.label}` : trackCondition;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#E10600" />
        <Text style={{ marginTop: 16, color: '#666' }}>Loading event...</Text>
      </SafeAreaView>
    );
  }

  if (error || !event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <FontAwesome name="exclamation-triangle" size={48} color="#EF4444" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#333', textAlign: 'center' }}>
          {error || 'Event not found'}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: '#E10600',
            borderRadius: 8,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#1E232C" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1E232C' }}>
          Post-Event Information
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            {event.name}
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            Please fill in the post-event information to help participants complete their performance forms.
          </Text>
        </View>

        {/* Track Condition Selection */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Track Condition *
          </Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fff',
            }}
            onPress={() => setShowTrackConditionModal(true)}
          >
            <Text style={{ color: trackCondition ? '#000' : '#999', fontSize: 16 }}>
              {getTrackConditionDisplay()}
            </Text>
            <FontAwesome name="chevron-down" size={14} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Event Results Link */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Event Results Link
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff',
            }}
            placeholder="https://example.com/results"
            value={eventResultsLink}
            onChangeText={setEventResultsLink}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Link to the official results of this event
          </Text>
        </View>

        {/* Season Results Link */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>
            Season Results Link
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              backgroundColor: '#fff',
            }}
            placeholder="https://example.com/season-results"
            value={seasonResultsLink}
            onChangeText={setSeasonResultsLink}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            Link to the overall season standings
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: '#E10600',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
            marginTop: 8,
            opacity: saving ? 0.6 : 1,
          }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Save Information
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Track Condition Modal */}
      <View style={{
        display: showTrackConditionModal ? 'flex' : 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          activeOpacity={1}
          onPress={() => setShowTrackConditionModal(false)}
        />
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          width: '85%',
          maxWidth: 400,
        }}>
          <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#333' }}>Select Track Condition</Text>
          </View>
            <View>
              {TRACK_CONDITIONS.map((condition) => (
                <TouchableOpacity
                  key={condition.value}
                  style={{
                    padding: 16,
                    borderBottomWidth: condition.value !== TRACK_CONDITIONS[TRACK_CONDITIONS.length - 1].value ? 1 : 0,
                    borderBottomColor: '#f0f0f0',
                    backgroundColor: trackCondition === condition.value ? '#FFF5F5' : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    setTrackCondition(condition.value);
                    setShowTrackConditionModal(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{condition.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        color: trackCondition === condition.value ? '#E10600' : '#1E232C',
                        fontWeight: trackCondition === condition.value ? '600' : '400',
                      }}>
                        {condition.label}
                      </Text>
                      {condition.description && (
                        <Text style={{
                          fontSize: 12,
                          color: '#666',
                          marginTop: 2,
                        }}>
                          {condition.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {trackCondition === condition.value && (
                    <FontAwesome name="check" size={18} color="#E10600" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PostEventInfoScreen;
