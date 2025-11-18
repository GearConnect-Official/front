import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import styles, { colors } from '../styles/screens/user/settingsStyles';

// Mock data for preferences
const LANGUAGE_OPTIONS = [
  { id: 'en', label: 'English', flag: '🇺🇸' },
  { id: 'fr', label: 'Français', flag: '🇫🇷' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
] as const;

const THEME_OPTIONS = [
  { id: 'light', label: 'Light Mode', icon: 'sun-o' },
  { id: 'dark', label: 'Dark Mode', icon: 'moon-o' },
  { id: 'auto', label: 'Auto', icon: 'adjust' },
] as const;

const UNIT_OPTIONS = [
  { id: 'metric', label: 'Metric (km/h, kg, °C)', icon: 'globe' },
  { id: 'imperial', label: 'Imperial (mph, lbs, °F)', icon: 'flag-o' },
] as const;

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
    <View style={styles.settingsItemLeft}>
      <View style={[
        styles.iconContainer, 
        isDestructive ? styles.destructiveIconContainer : null
      ]}>
        <FontAwesome 
          name={icon} 
          size={20} 
          color={isDestructive ? colors.iconError : colors.iconPrimary} 
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
    <View style={styles.settingsItemRight}>
      {rightElement || (
        onPress && <FontAwesome name="chevron-right" size={16} color={colors.iconChevron} />
      )}
    </View>
  </TouchableOpacity>
);

interface OptionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: readonly { id: string; label: string; flag?: string; icon?: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const OptionModal: React.FC<OptionModalProps> = ({
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={{
            backgroundColor: colors.statusBarBackground,
            borderRadius: 12,
            width: '85%',
            maxHeight: '70%',
            padding: 20,
          }}
          onStartShouldSetResponder={() => true}
        >
          <Text style={[styles.settingsItemTitle, { marginBottom: 20, textAlign: 'center' }]}>
            {title}
          </Text>
          <ScrollView>
            {options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={{
                  paddingVertical: 16,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.iconChevron + '20',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
              >
                {option.flag && (
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{option.flag}</Text>
                )}
                {option.icon && (
                  <FontAwesome
                    name={option.icon}
                    size={20}
                    color={colors.iconPrimary}
                    style={{ marginRight: 12 }}
                  />
                )}
                <Text
                  style={[
                    styles.settingsItemTitle,
                    selectedValue === option.id && { color: colors.iconPrimary },
                  ]}
                >
                  {option.label}
                </Text>
                {selectedValue === option.id && (
                  <FontAwesome
                    name="check"
                    size={16}
                    color={colors.iconPrimary}
                    style={{ marginLeft: 'auto' }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const PreferencesScreen: React.FC = () => {
  const router = useRouter();
  
  // State for preferences
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedUnits, setSelectedUnits] = useState('metric');
  
  // Modal states
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [unitsModalVisible, setUnitsModalVisible] = useState(false);

  const currentLanguageData = LANGUAGE_OPTIONS.find(lang => lang.id === selectedLanguage);
  const currentThemeData = THEME_OPTIONS.find(theme => theme.id === selectedTheme);
  const currentUnitsData = UNIT_OPTIONS.find(unit => unit.id === selectedUnits);

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
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={styles.placeholderRight} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          <SettingsItem
            icon="adjust"
            title="Theme"
            subtitle={currentThemeData?.label || 'Light Mode'}
            onPress={() => setThemeModalVisible(true)}
          />
        </SettingsSection>

        {/* Language & Region */}
        <SettingsSection title="Language & Region">
          <SettingsItem
            icon="language"
            title="Language"
            subtitle={currentLanguageData ? `${currentLanguageData.flag} ${currentLanguageData.label}` : 'English'}
            onPress={() => setLanguageModalVisible(true)}
          />
          <SettingsItem
            icon="calculator"
            title="Units"
            subtitle={currentUnitsData?.label || 'Metric'}
            onPress={() => setUnitsModalVisible(true)}
          />
        </SettingsSection>

        {/* Notifications & Sync */}
        <SettingsSection title="Notifications & Sync">
          <SettingsItem
            icon="bell"
            title="Push Notifications"
            subtitle="Receive push notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={notifications ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
          <SettingsItem
            icon="refresh"
            title="Auto Sync"
            subtitle="Automatically sync data"
            rightElement={
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={autoSync ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
          <SettingsItem
            icon="wifi"
            title="Offline Mode"
            subtitle="Use app without internet"
            rightElement={
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={offlineMode ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>

        {/* Accessibility */}
        <SettingsSection title="Accessibility">
          <SettingsItem
            icon="hand-paper-o"
            title="Haptic Feedback"
            subtitle="Feel vibrations on interactions"
            rightElement={
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: colors.switchTrackInactive, true: colors.switchTrackActive }}
                thumbColor={hapticFeedback ? colors.switchThumbActive : colors.switchThumbInactive}
              />
            }
          />
        </SettingsSection>
        
        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Modals */}
      <OptionModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title="Select Language"
        options={LANGUAGE_OPTIONS}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
      />

      <OptionModal
        visible={themeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        title="Select Theme"
        options={THEME_OPTIONS}
        selectedValue={selectedTheme}
        onSelect={setSelectedTheme}
      />

      <OptionModal
        visible={unitsModalVisible}
        onClose={() => setUnitsModalVisible(false)}
        title="Select Units"
        options={UNIT_OPTIONS}
        selectedValue={selectedUnits}
        onSelect={setSelectedUnits}
      />
    </SafeAreaView>
  );
};

export default PreferencesScreen;
