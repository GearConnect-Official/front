import * as React from "react";
import { View, Text, TextInput } from "react-native";
import styles from "../../styles/createEventStyles";

interface InputFieldProps {
  title: string;
  placeholder: string;
  info: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  title,
  placeholder,
  info,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputTitle}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <Text style={styles.inputInfo}>{info}</Text>
    </View>
  );
};

export default InputField;