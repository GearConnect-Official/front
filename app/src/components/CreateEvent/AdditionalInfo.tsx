import * as React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Modal, TextStyle, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { createEventStyles as styles } from '../../styles/screens';
import { Event } from '../../services/eventService';
import { TRACK_CONDITIONS } from '../../types/performance.types';

interface AdditionalInfoProps {
  logo: string;
  name: string;
  location: string;
  date: Date;
  website: string;
  sponsors: string;
  meteo?: {
    trackCondition?: 'dry' | 'wet' | 'mixed' | 'damp' | 'slippery' | 'drying';
    circuitName?: string;
    expectedParticipants?: number;
  };
  onInputChange: (field: keyof Event, value: any) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  logo,
  name,
  location,
  date,
  website,
  sponsors,
  meteo,
  onInputChange,
}) => {
  const [showTrackConditionModal, setShowTrackConditionModal] = React.useState(false);

  // Vérifier si l'événement est passé
  const isPastEvent = new Date(date) < new Date();

  const handleMeteoChange = (field: 'trackCondition' | 'circuitName' | 'expectedParticipants', value: any) => {
    const currentMeteo = meteo || {};
    const newMeteo = {
      ...currentMeteo,
      [field]: value,
    };
    onInputChange('meteo' as keyof Event, newMeteo);
  };

  const getTrackConditionDisplay = () => {
    if (!meteo?.trackCondition) return 'Select track condition';
    const condition = TRACK_CONDITIONS.find(c => c.value === meteo.trackCondition);
    return condition ? `${condition.emoji} ${condition.label}` : meteo.trackCondition;
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      <Text style={styles.stepDescription}>
        Final information to complete your event
      </Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Website</Text>
        <TextInput
          style={styles.input as TextStyle}
          placeholder="www.example.com"
          value={website}
          onChangeText={(text) => onInputChange('website', text)}
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="url"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Sponsors</Text>
        <TextInput
          style={styles.input as TextStyle}
          placeholder="Sponsor names separated by commas"
          value={sponsors}
          onChangeText={(text) => onInputChange('sponsors', text)}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Circuit Name</Text>
        <Text style={[styles.label, { fontSize: 12, color: '#666', marginBottom: 4 }]}>
          Name of the circuit/track (will pre-fill for participants)
        </Text>
        <TextInput
          style={styles.input as TextStyle}
          placeholder="e.g., Circuit de Spa-Francorchamps"
          value={meteo?.circuitName || ''}
          onChangeText={(text) => {
            handleMeteoChange('circuitName' as any, text);
          }}
          returnKeyType="next"
          blurOnSubmit={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Expected Participants</Text>
        <Text style={[styles.label, { fontSize: 12, color: '#666', marginBottom: 4 }]}>
          Expected number of participants (will pre-fill for participants)
        </Text>
        <TextInput
          style={styles.input as TextStyle}
          placeholder="e.g., 30"
          value={meteo?.expectedParticipants?.toString() || ''}
          onChangeText={(text) => {
            const numValue = text.trim() === '' ? undefined : parseInt(text);
            if (text.trim() === '' || (!isNaN(numValue!) && numValue! > 0)) {
              const currentMeteo = meteo || {};
              handleMeteoChange('expectedParticipants' as any, numValue);
            }
          }}
          keyboardType="numeric"
          returnKeyType="done"
          blurOnSubmit={true}
        />
      </View>

      {/* Track Condition - Only visible for past events */}
      {isPastEvent && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Track Condition</Text>
          <Text style={[styles.label, { fontSize: 12, color: '#666', marginBottom: 4 }]}>
            Fill this to help participants pre-fill their performance forms
          </Text>
            <TouchableOpacity
              style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 } as ViewStyle, styles.input as ViewStyle]}
              onPress={() => setShowTrackConditionModal(true)}
            >
              <Text style={{ color: meteo?.trackCondition ? '#000' : '#999', fontSize: 16 }}>
                {getTrackConditionDisplay()}
              </Text>
              <FontAwesome name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
        </View>
      )}
      <View style={styles.previewSection}>
        <Text style={styles.sectionTitle}>Preview</Text>
        <View style={styles.previewCard}>
          {logo ? (
            <Image source={{ uri: logo }} style={styles.previewLogo} />
          ) : (
            <View style={styles.previewLogoPlaceholder}>
              <FontAwesome name="calendar" size={32} color="#3a86ff" />
            </View>
          )}
          <Text style={styles.previewTitle}>{name || 'Event Name'}</Text>
          <Text style={styles.previewInfo}>
            <FontAwesome name="map-marker" size={14} color="#666" /> 
            {location || 'Location'}
          </Text>
          <Text style={styles.previewInfo}>
            <FontAwesome name="calendar" size={14} color="#666" /> 
            {date.toLocaleDateString('en-US')}
          </Text>
          <LinearGradient
            colors={['#3a86ff', '#5e60ce']}
            style={styles.previewBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.previewBadgeText}>Ready to publish!</Text>
          </LinearGradient>
        </View>
      </View>

      {/* Track Condition Modal - Simple and clean design */}
      <Modal
        visible={showTrackConditionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTrackConditionModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setShowTrackConditionModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{ backgroundColor: '#fff', borderRadius: 16, width: '85%', maxWidth: 400 }}
            onPress={(e) => e.stopPropagation()}
          >
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
                    backgroundColor: meteo?.trackCondition === condition.value ? '#FFF5F5' : 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onPress={() => {
                    handleMeteoChange('trackCondition', condition.value);
                    setShowTrackConditionModal(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>{condition.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, color: meteo?.trackCondition === condition.value ? '#E10600' : '#1E232C', fontWeight: meteo?.trackCondition === condition.value ? '600' : '400' }}>
                        {condition.label}
                      </Text>
                      {condition.description && (
                        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                          {condition.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  {meteo?.trackCondition === condition.value && (
                    <FontAwesome name="check" size={18} color="#E10600" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' }}
              onPress={() => {
                handleMeteoChange('trackCondition', undefined);
                setShowTrackConditionModal(false);
              }}
            >
              <Text style={{ fontSize: 16, color: '#999', textAlign: 'center' }}>Clear</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default AdditionalInfo;
