import React from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../../styles/components/publicationStepStyles';
import theme from '../../styles/config/theme';

interface TitleStepProps {
  title: string;
  onTitleChange: (title: string) => void;
  error?: string;
  isLoading?: boolean;
}

const TitleStep: React.FC<TitleStepProps> = ({
  title,
  onTitleChange,
  error,
  isLoading = false
}) => {
  const charactersLeft = 100 - title.length;
  const isNearLimit = charactersLeft <= 20;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stepContainer}>
          <View style={styles.iconContainer}>
            <FontAwesome name="pencil" size={40} color={theme.colors.primary.main} />
          </View>
          
          <Text style={styles.stepTitle}>Give your post a title</Text>
          <Text style={styles.stepDescription}>
            A good title helps people understand what your post is about. Make it descriptive and engaging.
          </Text>

          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Title *</Text>
              <Text style={[
                styles.charCounter,
                isNearLimit && styles.charCounterWarning
              ]}>
                {charactersLeft} characters left
              </Text>
            </View>
            
            <TextInput
              style={[
                styles.titleInput,
                error && styles.inputError
              ]}
              placeholder="Enter your post title..."
              placeholderTextColor={theme.colors.text.secondary}
              value={title}
              onChangeText={onTitleChange}
              editable={!isLoading}
              maxLength={100}
              autoFocus={true}
              multiline={false}
              returnKeyType="done"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Tips for a great title:</Text>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Be specific about your content</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Include relevant keywords</Text>
            </View>
            <View style={styles.tipItem}>
              <FontAwesome name="check-circle" size={16} color={theme.colors.status.success} />
              <Text style={styles.tipText}>Keep it engaging and clear</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default TitleStep; 