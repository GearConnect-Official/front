import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useMessage } from '../context/MessageContext';
import MessageService from '../services/messageService';
import styles, { colors } from '../styles/screens/user/settingsStyles';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({ 
  icon, 
  title, 
  subtitle, 
  rightElement
}) => (
  <View style={styles.settingsItem}>
    <View style={styles.settingsItemLeft}>
      <View style={styles.iconContainer}>
        <FontAwesome 
          name={icon} 
          size={20} 
          color={colors.iconPrimary} 
        />
      </View>
      <View style={styles.settingsItemTextContainer}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    <View style={styles.settingsItemRight}>
      {rightElement}
    </View>
  </View>
);

const PrivacySettingsScreen: React.FC = () => {
  const router = useRouter();
  const { showMessage } = useMessage();
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showActivity, setShowActivity] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.statusBarBackground} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
        <View style={styles.placeholderRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Privacy Section */}
        <SettingsSection title="Profile Privacy">
          <SettingsItem
            icon="eye"
            title="Profile Visibility"
            subtitle="Control who can see your profile"
            rightElement={
              <Switch
                value={profileVisibility}
                onValueChange={setProfileVisibility}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={profileVisibility ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
          <SettingsItem
            icon="envelope"
            title="Show Email Address"
            subtitle="Display your email on your profile"
            rightElement={
              <Switch
                value={showEmail}
                onValueChange={setShowEmail}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={showEmail ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Messages Section */}
        <SettingsSection title="Messages">
          <SettingsItem
            icon="comments"
            title="Allow Messages"
            subtitle="Let others send you messages"
            rightElement={
              <Switch
                value={allowMessages}
                onValueChange={setAllowMessages}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={allowMessages ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Activity Section */}
        <SettingsSection title="Activity">
          <SettingsItem
            icon="clock-o"
            title="Show Activity Status"
            subtitle="Display when you're online"
            rightElement={
              <Switch
                value={showActivity}
                onValueChange={setShowActivity}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={showActivity ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacySettingsScreen;

