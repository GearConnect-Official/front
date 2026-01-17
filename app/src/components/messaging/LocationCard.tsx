import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import theme from '../../styles/config/theme';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.90;
const MIN_CARD_WIDTH = screenWidth * 0.70;

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

interface LocationCardProps {
  location: LocationData;
  isOwn: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, isOwn }) => {
  const handleOpen = async () => {
    try {
      // Open location in native maps app
      const url = Platform.OS === 'ios'
        ? `maps://maps.apple.com/?q=${location.latitude},${location.longitude}`
        : `geo:${location.latitude},${location.longitude}?q=${location.latitude},${location.longitude}`;
      
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        await Linking.openURL(googleMapsUrl);
      }
    } catch (error) {
      console.error('Error opening location:', error);
    }
  };

  const displayName = location.name || location.address || 'Location';

  return (
    <TouchableOpacity
      style={[styles.container, isOwn && styles.ownContainer]}
      onPress={handleOpen}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isOwn && styles.ownIconContainer]}>
          <FontAwesome 
            name="map-marker" 
            size={screenWidth * 0.08} 
            color={isOwn ? '#FFFFFF' : theme.colors.primary.main} 
          />
        </View>
        
        <View style={styles.locationInfo}>
          <Text 
            style={[styles.locationName, isOwn && styles.ownLocationName]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {displayName}
          </Text>
          
          <View style={styles.coordinates}>
            <FontAwesome 
              name="map-pin" 
              size={screenWidth * 0.028} 
              color={isOwn ? 'rgba(255, 255, 255, 0.7)' : theme.colors.text.secondary} 
            />
            <Text style={[styles.coordinatesText, isOwn && styles.ownCoordinatesText]}>
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.openButton, isOwn && styles.ownOpenButton]}
            onPress={handleOpen}
            activeOpacity={0.7}
          >
            <FontAwesome 
              name="external-link" 
              size={screenWidth * 0.04} 
              color={isOwn ? '#FFFFFF' : theme.colors.primary.main} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: screenWidth * 0.03,
    marginVertical: theme.spacing.xs,
    maxWidth: MAX_CARD_WIDTH,
    minWidth: MIN_CARD_WIDTH,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexShrink: 0,
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    flexWrap: 'nowrap',
  },
  iconContainer: {
    width: 50,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: screenWidth * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    flexShrink: 0,
    alignSelf: 'flex-start',
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: screenWidth * 0.025,
    marginRight: screenWidth * 0.015,
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  locationName: {
    fontSize: screenWidth * 0.042,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: screenWidth * 0.01,
    lineHeight: screenWidth * 0.058,
    flexShrink: 1,
    includeFontPadding: false,
  },
  ownLocationName: {
    color: '#FFFFFF',
  },
  coordinates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  coordinatesText: {
    fontSize: screenWidth * 0.032,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    flexShrink: 1,
  },
  ownCoordinatesText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  actionsContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 50,
    flexShrink: 0,
    marginLeft: screenWidth * 0.015,
    alignSelf: 'flex-start',
  },
  openButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownOpenButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default LocationCard;
