import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../styles/config/theme';
import { addAppointmentToCalendar } from '../../utils/calendarHelper';

const { width: screenWidth } = Dimensions.get('window');
const MAX_CARD_WIDTH = screenWidth * 0.90;
const MIN_CARD_WIDTH = screenWidth * 0.70;

export interface AppointmentData {
  title: string;
  description?: string;
  date: Date | string;
  endDate?: Date | string;
  location?: string;
  reminder?: string;
  includeEndTime?: boolean;
}

interface AppointmentCardProps {
  appointment: AppointmentData;
  isOwn: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, isOwn }) => {
  // Parse date if it's a string
  const appointmentDate = typeof appointment.date === 'string' ? new Date(appointment.date) : appointment.date;
  const appointmentEndDate = appointment.endDate 
    ? (typeof appointment.endDate === 'string' ? new Date(appointment.endDate) : appointment.endDate)
    : null;
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isPast = appointmentDate < new Date();

  const handlePress = async () => {
    await addAppointmentToCalendar(appointment);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isOwn && styles.ownContainer, isPast && styles.pastContainer]}
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isOwn && styles.ownIconContainer, isPast && styles.pastIconContainer]}>
          <FontAwesome 
            name="calendar" 
            size={screenWidth * 0.08} 
            color={isOwn ? '#FFFFFF' : theme.colors.primary.main} 
          />
        </View>
        
        <View style={styles.eventInfo}>
          <Text 
            style={[styles.eventTitle, isOwn && styles.ownEventTitle]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {appointment.title}
          </Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <FontAwesome 
                name="clock-o" 
                size={screenWidth * 0.032} 
                color={isOwn ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary} 
              />
              <Text style={[styles.detailText, isOwn && styles.ownDetailText]}>
                {formatDate(appointmentDate)} at {formatTime(appointmentDate)}
                {appointmentEndDate && ` - ${formatTime(appointmentEndDate)}`}
              </Text>
            </View>
            
            {appointment.location && (
              <View style={styles.detailRow}>
                <FontAwesome 
                  name="map-marker" 
                  size={screenWidth * 0.032} 
                  color={isOwn ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary} 
                />
                <Text 
                  style={[styles.detailText, isOwn && styles.ownDetailText]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {appointment.location}
                </Text>
              </View>
            )}
            
            {appointment.description && (
              <View style={styles.detailRow}>
                <FontAwesome 
                  name="info-circle" 
                  size={screenWidth * 0.032} 
                  color={isOwn ? 'rgba(255, 255, 255, 0.8)' : theme.colors.text.secondary} 
                />
                <Text 
                  style={[styles.detailText, isOwn && styles.ownDetailText, styles.descriptionText]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {appointment.description}
                </Text>
              </View>
            )}
          </View>
          
          {isPast && (
            <View style={styles.pastBadge}>
              <Text style={[styles.pastBadgeText, isOwn && styles.ownPastBadgeText]}>
                Past
              </Text>
            </View>
          )}
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
  pastContainer: {
    opacity: 0.7,
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
  pastIconContainer: {
    opacity: 0.6,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingRight: screenWidth * 0.025,
    marginRight: screenWidth * 0.015,
    minWidth: 0,
    flexShrink: 1,
    maxWidth: '100%',
  },
  eventTitle: {
    fontSize: screenWidth * 0.042,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: screenWidth * 0.015,
    lineHeight: screenWidth * 0.058,
    flexShrink: 1,
    includeFontPadding: false,
  },
  ownEventTitle: {
    color: '#FFFFFF',
  },
  eventDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  detailText: {
    fontSize: screenWidth * 0.035,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    flexShrink: 1,
    flex: 1,
  },
  ownDetailText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  descriptionText: {
    fontStyle: 'italic',
  },
  pastBadge: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.grey[300],
  },
  pastBadgeText: {
    fontSize: screenWidth * 0.03,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  ownPastBadgeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default AppointmentCard;
