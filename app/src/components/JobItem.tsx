import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import styles from "../styles/jobsStyles";
import theme from "../styles/config";

// Palette de couleurs racing
const RACING_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  card: '#F8F8F8',
  redLight: '#FF3333',
  redDark: '#CC0000',
};

interface JobItemProps {
  icon: keyof typeof FontAwesome.glyphMap;
  title: string;
  subtitle: string;
  type: string;
  onPress?: () => void;
}

const JobItem: React.FC<JobItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  type, 
  onPress 
}) => {
  // Déterminer la couleur de fond du badge selon le type de job
  const getBadgeColor = () => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return RACING_COLORS.primary;
      case 'part-time':
        return theme.colors.status.info;
      case 'f1 driver career':
        return RACING_COLORS.redDark;
      default:
        return theme.colors.secondary.main;
    }
  };

  return (
    <TouchableOpacity 
      style={localStyles.jobItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={localStyles.jobContent}>
        <View style={localStyles.jobHeader}>
          <View style={[localStyles.jobIconContainer, { backgroundColor: RACING_COLORS.card }]}>
            <FontAwesome name={icon} size={20} color={RACING_COLORS.primary} />
          </View>
          
          <View style={localStyles.jobTypeContainer}>
            <View style={[localStyles.badge, { backgroundColor: getBadgeColor() }]}>
              <Text style={localStyles.badgeText}>{type}</Text>
            </View>
          </View>
        </View>
        
        <View style={localStyles.jobDetails}>
          <Text style={localStyles.jobTitle}>{title}</Text>
          <Text style={localStyles.jobSubtitle}>{subtitle}</Text>
        </View>
        
        <View style={localStyles.jobFooter}>
          <View style={localStyles.infoItem}>
            <FontAwesome name="map-marker" size={14} color={RACING_COLORS.textSecondary} />
            <Text style={localStyles.infoText}>Paris, France</Text>
          </View>
          <View style={localStyles.infoItem}>
            <FontAwesome name="clock-o" size={14} color={RACING_COLORS.textSecondary} />
            <Text style={localStyles.infoText}>Posté il y a 2j</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  jobItem: {
    backgroundColor: RACING_COLORS.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: RACING_COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: RACING_COLORS.primary,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobContent: {
    flex: 1,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: RACING_COLORS.textPrimary,
    marginBottom: 4,
  },
  jobSubtitle: {
    fontSize: 14,
    color: RACING_COLORS.textSecondary,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: RACING_COLORS.textSecondary,
    marginLeft: 4,
  },
});

export default JobItem;
