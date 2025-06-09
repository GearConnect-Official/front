import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import styles from "../../styles/Profile/menuProfileStyles";

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  color?: string;
}

interface ProfileMenuProps {
  visible: boolean;
  onClose: () => void;
  onSettingsPress: () => void;
  onEditProfilePress: () => void;
  onPreferencesPress: () => void;
  onLogoutPress: () => void;
  onPerformancesPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onPress,
  color = "#1E1E1E",
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <FontAwesome name={icon} size={20} color={color} style={styles.menuIcon} />
    <Text style={[styles.menuText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  visible,
  onClose,
  onSettingsPress,
  onEditProfilePress,
  onPreferencesPress,
  onLogoutPress,
  onPerformancesPress,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menuContainer}>
          {onPerformancesPress && (
            <MenuItem icon="tachometer" label="Mes Performances" onPress={onPerformancesPress} />
          )}
          <MenuItem icon="cog" label="Paramètres" onPress={onSettingsPress} />
          <MenuItem
            icon="edit"
            label="Modifier mon profil"
            onPress={onEditProfilePress}
          />
          <MenuItem
            icon="sliders"
            label="Préférences"
            onPress={onPreferencesPress}
          />
          <View style={styles.separator} />
          <MenuItem
            icon="sign-out"
            label="Déconnexion"
            onPress={onLogoutPress}
            color="#E10600"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default ProfileMenu;
