import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/createEventStyles";

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  cancelText?: string;
  submitText?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onSubmit,
  cancelText = "Cancel",
  submitText = "Create",
}) => {
  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity
        onPress={onCancel}
        style={[styles.actionButton, styles.cancelButton]}
      >
        <Text style={styles.cancelButtonText}>{cancelText}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSubmit}
        style={[styles.actionButton, styles.submitButton]}
      >
        <Text style={styles.submitButtonText}>{submitText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;