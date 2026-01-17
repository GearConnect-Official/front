import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../styles/config/theme';
import MediaPickerModal from './MediaPickerModal';
import { SelectedMedia } from './MediaPickerModal';

// Re-export SelectedMedia for convenience
export type { SelectedMedia };

interface AttachmentMenuProps {
  visible: boolean;
  onClose: () => void;
  onPhotosSelected?: (media: SelectedMedia[], caption: string) => void;
  onCameraSelected?: () => void;
  onLocationSelected?: () => void;
  onContactSelected?: () => void;
  onDocumentSelected?: () => void;
  onPollSelected?: () => void;
  onEventSelected?: () => void;
  conversationId?: string;
  groupId?: string;
}

const AttachmentMenu: React.FC<AttachmentMenuProps> = ({
  visible,
  onClose,
  onPhotosSelected,
  onCameraSelected,
  onLocationSelected,
  onContactSelected,
  onDocumentSelected,
  onPollSelected,
  onEventSelected,
  conversationId,
  groupId,
}) => {
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handlePhotosPress = () => {
    setShowMediaPicker(true);
    onClose(); // Close the attachment menu
  };

  const handleMediaSend = (media: SelectedMedia[], caption: string) => {
    setShowMediaPicker(false);
    if (onPhotosSelected) {
      onPhotosSelected(media, caption);
    }
  };

  return (
    <>
      {/* Attachment Menu */}
      {visible && (
        <>
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={onClose}
          />
          <View style={styles.menu}>
        {/* Keyboard button to close menu */}
        <TouchableOpacity
          style={styles.keyboardButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <FontAwesome name="keyboard-o" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Attachment options grid */}
        <View style={styles.grid}>
          {/* First row */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.option}
              onPress={handlePhotosPress}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#0084FF' }]}>
                <FontAwesome name="image" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onCameraSelected) onCameraSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#34C759' }]}>
                <FontAwesome name="camera" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onLocationSelected) onLocationSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#25D366' }]}>
                <FontAwesome name="map-marker" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onContactSelected) onContactSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#5AC8FA' }]}>
                <FontAwesome name="user" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Contact</Text>
            </TouchableOpacity>
          </View>

          {/* Second row */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onDocumentSelected) onDocumentSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#007AFF' }]}>
                <FontAwesome name="file" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Document</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onPollSelected) onPollSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#FF9500' }]}>
                <FontAwesome name="bar-chart" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Poll</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onClose();
                if (onEventSelected) onEventSelected();
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.icon, { backgroundColor: '#E10600' }]}>
                <FontAwesome name="calendar" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.label}>Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
        </>
      )}

      {/* Media Picker Modal - Keep visible even when attachment menu is closed */}
      {showMediaPicker && (
        <MediaPickerModal
          conversationId={conversationId || groupId || ''}
          onSend={(media, caption) => {
            setShowMediaPicker(false);
            handleMediaSend(media, caption);
          }}
          onCancel={() => {
            setShowMediaPicker(false);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
    zIndex: 1001,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  keyboardButton: {
    alignSelf: 'flex-end',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  grid: {
    paddingVertical: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
  },
  option: {
    alignItems: 'center',
    width: '25%',
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default AttachmentMenu;
