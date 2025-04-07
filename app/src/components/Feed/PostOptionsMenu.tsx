import React from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface PostOptionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onCopyLink: () => void;
  isOwnPost: boolean;
}

const PostOptionsMenu: React.FC<PostOptionsMenuProps> = ({
  visible,
  onClose,
  onReport,
  onCopyLink,
  isOwnPost,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
              {isOwnPost ? (
                <>
                  <TouchableOpacity style={styles.option} onPress={onCopyLink}>
                    <FontAwesome name="link" size={20} color="#262626" />
                    <Text style={styles.optionText}>Copier le lien</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option}>
                    <FontAwesome name="pencil" size={20} color="#262626" />
                    <Text style={styles.optionText}>Modifier</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option}>
                    <FontAwesome name="archive" size={20} color="#262626" />
                    <Text style={styles.optionText}>Archiver</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.option, styles.deleteOption]}>
                    <FontAwesome name="trash" size={20} color="#E1306C" />
                    <Text style={[styles.optionText, styles.deleteText]}>Supprimer</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity style={styles.option} onPress={onReport}>
                    <FontAwesome name="flag" size={20} color="#262626" />
                    <Text style={styles.optionText}>Signaler</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option}>
                    <FontAwesome name="user-times" size={20} color="#262626" />
                    <Text style={styles.optionText}>Ne plus suivre</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.option} onPress={onCopyLink}>
                    <FontAwesome name="link" size={20} color="#262626" />
                    <Text style={styles.optionText}>Copier le lien</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#262626',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#E1306C',
  },
});

export default PostOptionsMenu; 