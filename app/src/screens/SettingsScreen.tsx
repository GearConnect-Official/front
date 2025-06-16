import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useMessage } from "../context/MessageContext";
import MessageService from "../services/messageService";
import styles, { colors } from "../styles/screens/user/settingsStyles";

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

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  isDestructive = false,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={!onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View style={styles.settingsItemLeft}>
      <View
        style={[
          styles.iconContainer,
          isDestructive ? styles.destructiveIconContainer : null,
        ]}
      >
        <FontAwesome
          name={icon}
          size={20}
          color={isDestructive ? colors.iconError : colors.iconPrimary}
        />
      </View>
      <View style={styles.settingsItemTextContainer}>
        <Text
          style={[
            styles.settingsItemTitle,
            isDestructive ? styles.destructiveText : null,
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    <View style={styles.settingsItemRight}>
      {rightElement ||
        (onPress && (
          <FontAwesome
            name="chevron-right"
            size={16}
            color={colors.iconChevron}
          />
        ))}
    </View>
  </TouchableOpacity>
);

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { showMessage, showConfirmation } = useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [appVersion] = useState("1.0.0");

  // Initial load of user preferences
  useEffect(() => {
    const loadUserPreferences = async () => {
      try {
        // fetch user preferences or local storage
        setTimeout(() => {
          setIsFetchingUser(false);
        }, 500);
      } catch (error) {
        console.error("Error loading user preferences:", error);
        setIsFetchingUser(false);
      }
    };

    loadUserPreferences();
  }, []);

  const handlePrivacySettings = () => {
    showMessage(MessageService.INFO.COMING_SOON);
  };

  const handleSecuritySettings = () => {
    showMessage(MessageService.INFO.COMING_SOON);
  };

  const handleAccountSettings = () => {
    // router.push('/editProfile');
    showMessage(MessageService.INFO.COMING_SOON);
  };

  const handlePreferences = () => {
    router.push("/preferences");
  };

  const handleHelpCenter = () => {
    Linking.openURL("https://gearconnect-landing.vercel.app/faq");
  };

  const handleTermsAndConditions = () => {
    showMessage(MessageService.INFO.TERMS_CONDITIONS);
  };

  const handleLogout = async () => {
    showConfirmation({
      ...MessageService.CONFIRMATIONS.LOGOUT,
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await logout();
          // await fetch(API_URL_AUTH + '/logout');
          router.replace("/(auth)");
        } catch (error) {
          console.error("Error during logout:", error);
          showMessage(MessageService.ERROR.LOGOUT_FAILED);
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleDeleteAccount = () => {
    showConfirmation({
      ...MessageService.CONFIRMATIONS.DELETE_ACCOUNT,
      onConfirm: () => {
        showMessage(MessageService.INFO.COMING_SOON);
      },
    });
  };

  if (isFetchingUser) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.statusBarBackground}
          translucent={true}
        />
        <ActivityIndicator size="large" color={colors.activityIndicator} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.placeholderRight} />
        </View>
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
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

            {/* App Preferences Section */}
            <SettingsSection title="App Preferences">
              <SettingsItem
                icon="cog"
                title="Preferences"
                subtitle="Customize your app experience"
                onPress={handlePreferences}
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
                onPress={isLoading ? undefined : handleLogout}
                rightElement={
                  isLoading ? (
                    <ActivityIndicator
                      size="small"
                      color={colors.activityIndicator}
                    />
                  ) : undefined
                }
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
        </View>
      </View>
    </SafeAreaView>
  );
};

// Styles are imported from settingsStyles.ts

export default SettingsScreen;
