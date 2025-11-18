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
  onPress?: () => void;
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
  onPress,
  rightElement
}) => (
  <TouchableOpacity 
    style={styles.settingsItem} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
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
      {rightElement || (
        onPress && <FontAwesome name="chevron-right" size={16} color={colors.iconChevron} />
      )}
    </View>
  </TouchableOpacity>
);

const SecuritySettingsScreen: React.FC = () => {
  const router = useRouter();
  const { showMessage } = useMessage();
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handleChangePassword = () => {
    showMessage(MessageService.INFO.COMING_SOON);
  };

  const handleActiveSessions = () => {
    showMessage(MessageService.INFO.COMING_SOON);
  };

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
        <Text style={styles.headerTitle}>Security Settings</Text>
        <View style={styles.placeholderRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Authentication Section */}
        <SettingsSection title="Authentication">
          <SettingsItem
            icon="key"
            title="Change Password"
            subtitle="Update your account password"
            onPress={handleChangePassword}
          />
          <SettingsItem
            icon="mobile"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightElement={
              <Switch
                value={twoFactorAuth}
                onValueChange={setTwoFactorAuth}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={twoFactorAuth ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Security Alerts Section */}
        <SettingsSection title="Security Alerts">
          <SettingsItem
            icon="bell"
            title="Login Alerts"
            subtitle="Get notified of new login attempts"
            rightElement={
              <Switch
                value={loginAlerts}
                onValueChange={setLoginAlerts}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={loginAlerts ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Sessions Section */}
        <SettingsSection title="Sessions">
          <SettingsItem
            icon="desktop"
            title="Active Sessions"
            subtitle="Manage your active device sessions"
            onPress={handleActiveSessions}
          />
        </SettingsSection>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SecuritySettingsScreen;

