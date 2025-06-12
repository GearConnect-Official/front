import React from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/components/publicationStepStyles';
import theme from '../../styles/config/theme';

interface DescriptionStepProps {
  description: string;
  onDescriptionChange: (description: string) => void;
  error?: string;
  isLoading?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 2200;

const DescriptionStep: React.FC<DescriptionStepProps> = ({
  description,
  onDescriptionChange,
  error,
  isLoading = false
}) => {
  const charactersLeft = MAX_DESCRIPTION_LENGTH - description.length;
  const isNearLimit = charactersLeft <= 100;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="align-left" size={40} color={theme.colors.primary.main} />
          </View>
          
          <Text style={styles.stepTitle}>Describe your post</Text>
          <Text style={styles.stepDescription}>
            Tell your story! Share details about what makes this post special, where it was taken, or any interesting facts.
          </Text>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Description *</Text>
              <Text style={[
                styles.charCounter,
                isNearLimit && styles.charCounterWarning
              ]}>
                {charactersLeft} characters left
              </Text>
            </View>
            
            <TextInput
              style={[
                styles.descriptionInput,
                error && styles.inputError
              ]}
              placeholder="Tell your story..."
              placeholderTextColor={theme.colors.text.secondary}
              value={description}
              onChangeText={(text) => onDescriptionChange(text.slice(0, MAX_DESCRIPTION_LENGTH))}
              editable={!isLoading}
              multiline={true}
              numberOfLines={6}
              autoFocus={true}
              textAlignVertical="top"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>What makes a great description:</Text>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Share the story behind the photo</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Include location or event details</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Mention technical specs if relevant</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Ask questions to engage your audience</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default DescriptionStep; 