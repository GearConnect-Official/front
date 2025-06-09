import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/screens/settingsStyles';
import theme from '../styles/config/theme';
import { API_URL_AUTH } from '../config';


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
  isDestructive?: boolean;
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
  rightElement,
  isDestructive = false
}) => (
  <TouchableOpacity 
    style={styles.settingsItem} 
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.settingsItemLeft}>      <View style={[
        styles.iconContainer, 
        isDestructive ? styles.destructiveIconContainer : null
      ]}>
        <FontAwesome 
          name={icon} 
          size={20} 
          color={isDestructive ? theme.colors.status.error : theme.colors.primary.main} 
        />
      </View>
      <View style={styles.settingsItemTextContainer}>
        <Text style={[
          styles.settingsItemTitle,
          isDestructive ? styles.destructiveText : null
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    <View style={styles.settingsItemRight}>      {rightElement || (
        onPress && <FontAwesome name="chevron-right" size={16} color={theme.colors.grey[400]} />
      )}
    </View>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] = useState(true);
  const [isEmailNotificationsEnabled, setIsEmailNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [appVersion] = useState('1.0.0');
  
  // Initial load of user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        // fetch user preferences or local storage
        setTimeout(() => {
          setIsFetchingUser(false);
        }, 500);
      } catch (error) {
        console.error('Error loading user preferences:', error);
        setIsFetchingUser(false);
      }
    };
    
    loadUserPreferences();
  }, []);

  const handleTogglePushNotifications = (value: boolean) => {
    setIsPushNotificationsEnabled(value);
  };

  const handleToggleEmailNotifications = (value: boolean) => {
    setIsEmailNotificationsEnabled(value);
  };

  const handlePrivacySettings = () => {
    Alert.alert('Coming Soon', 'Privacy settings will be available in the next update.');
  };
  
  const handleSecuritySettings = () => {
    Alert.alert('Coming Soon', 'Security settings will be available in the next update.');
  };

  const handleAccountSettings = () => {
    // router.push('/editProfile');
    Alert.alert('Coming Soon', 'Account settings will be available in the next update.');
  };

  const handleLanguageSettings = () => {
    Alert.alert('Coming Soon', 'Language settings will be available in the next update.');
  };

  const handleAppearanceSettings = () => {
    Alert.alert('Coming Soon', 'Appearance settings will be available in the next update.');
  };

  const handleHelpCenter = () => {
    Alert.alert('Support', 'Please contact support@gearconnect.com for assistance.');
  };

  const handleTermsAndConditions = () => {
    Alert.alert('Terms & Conditions', 'The full terms and conditions will be available in the next update.');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
                // await fetch(API_URL_AUTH + '/logout');
              router.replace("/(auth)");
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            Alert.alert("Coming Soon", "Account deletion will be available in the next update.");
          }
        }
      ]
    );
  };  if (isFetchingUser) {
    return (      <SafeAreaView style={styles.loadingContainer} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.paper} translucent={true} />
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background.paper} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholderRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="user"
            title="Account Settings"
            subtitle="Manage your profile information"
            onPress={handleAccountSettings}
          />
          <SettingsItem
            icon="lock"
            title="Privacy Settings"
            subtitle="Control your privacy preferences"
            onPress={handlePrivacySettings}
          />
          <SettingsItem
            icon="shield"
            title="Security Settings"
            subtitle="Protect your account"
            onPress={handleSecuritySettings}
          />
        </SettingsSection>
        
        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsItem
            icon="bell"
            title="Push Notifications"
            subtitle="Receive alerts and updates"
            rightElement={              <Switch
                value={isPushNotificationsEnabled}
                onValueChange={handleTogglePushNotifications}
                trackColor={{ false: theme.colors.grey[300], true: `${theme.colors.primary.main}80` }}
                thumbColor={isPushNotificationsEnabled ? theme.colors.primary.main : theme.colors.grey[50]}
              />
            }
          />
          <SettingsItem
            icon="envelope"
            title="Email Notifications"
            subtitle="Receive email updates"
            rightElement={              <Switch
                value={isEmailNotificationsEnabled}
                onValueChange={handleToggleEmailNotifications}
                trackColor={{ false: theme.colors.grey[300], true: `${theme.colors.primary.main}80` }}
                thumbColor={isEmailNotificationsEnabled ? theme.colors.primary.main : theme.colors.grey[50]}
              />
            }
          />
          <SettingsItem
            icon="globe"
            title="Language"
            subtitle="Change your language preference"
            onPress={handleLanguageSettings}
            rightElement={
              <Text style={styles.settingsItemValue}>English</Text>
            }
          />
          <SettingsItem
            icon="adjust"
            title="Appearance"
            subtitle="Customize the look of the app"
            onPress={handleAppearanceSettings}
            rightElement={
              <Text style={styles.settingsItemValue}>Light</Text>
            }
          />
        </SettingsSection>
        
        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="question-circle"
            title="Help Center"
            subtitle="Get assistance and answers to your questions"
            onPress={handleHelpCenter}
          />
          <SettingsItem
            icon="file-text-o"
            title="Terms & Conditions"
            subtitle="Review our terms of service"
            onPress={handleTermsAndConditions}
          />
          <SettingsItem
            icon="info-circle"
            title="App Version"
            subtitle="Current version of the application"
            rightElement={
              <Text style={styles.settingsItemValue}>{appVersion}</Text>
            }
          />
        </SettingsSection>
        
        {/* Actions Section */}
        <SettingsSection title="Actions">
          <SettingsItem
            icon="sign-out"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={isLoading ? undefined : handleLogout}            rightElement={isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.primary.main} />
            ) : undefined}
          />
          <SettingsItem
            icon="trash-o"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
            isDestructive
          />
        </SettingsSection>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles are imported from settingsStyles.ts

export default SettingsScreen;
