import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import * as Contacts from 'expo-contacts';
import theme from '../../styles/config/theme';

export interface ContactData {
  name: string;
  phoneNumbers: string[];
  emails: string[];
  organization?: string;
  jobTitle?: string;
}

interface ContactCardProps {
  contact: ContactData;
  isOwn: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, isOwn }) => {
  const handleAddToContacts = async () => {
    try {
      // Request permission first
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your contacts to add this contact.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Create contact object
      const newContact: Contacts.Contact = {
        [Contacts.Fields.ID]: undefined,
        name: contact.name,
        phoneNumbers: contact.phoneNumbers.map((phone) => ({
          number: phone,
          label: 'mobile',
        })),
        emails: contact.emails.map((email) => ({
          email,
          label: 'work',
        })),
        company: contact.organization,
        jobTitle: contact.jobTitle,
      };

      // Add contact
      await Contacts.addContactAsync(newContact);
      
      Alert.alert('Success', 'Contact added to your address book');
    } catch (error) {
      console.error('Error adding contact:', error);
      Alert.alert('Error', 'Failed to add contact to address book');
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isOwn && styles.ownContainer]}
      onPress={handleAddToContacts}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, isOwn && styles.ownIconContainer]}>
          <FontAwesome name="user" size={24} color={isOwn ? '#FFFFFF' : theme.colors.primary.main} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, isOwn && styles.ownContactName]}>
            {contact.name}
          </Text>
          {contact.organization && (
            <Text style={[styles.contactOrg, isOwn && styles.ownContactOrg]}>
              {contact.organization}
            </Text>
          )}
        </View>
      </View>

      {contact.phoneNumbers.length > 0 && (
        <View style={styles.contactDetails}>
          <FontAwesome name="phone" size={16} color={isOwn ? '#FFFFFF' : theme.colors.text.secondary} />
          <View style={styles.contactDetailsContent}>
            {contact.phoneNumbers.map((phone, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleCall(phone)}
                style={styles.contactDetailItem}
                activeOpacity={0.7}
              >
                <Text style={[styles.contactDetailText, isOwn && styles.ownContactDetailText]}>
                  {phone}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {contact.emails.length > 0 && (
        <View style={styles.contactDetails}>
          <FontAwesome name="envelope" size={16} color={isOwn ? '#FFFFFF' : theme.colors.text.secondary} />
          <View style={styles.contactDetailsContent}>
            {contact.emails.map((email, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEmail(email)}
                style={styles.contactDetailItem}
                activeOpacity={0.7}
              >
                <Text style={[styles.contactDetailText, isOwn && styles.ownContactDetailText]}>
                  {email}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {contact.jobTitle && (
        <View style={styles.contactDetails}>
          <FontAwesome name="briefcase" size={16} color={isOwn ? '#FFFFFF' : theme.colors.text.secondary} />
          <Text style={[styles.contactDetailText, isOwn && styles.ownContactDetailText]}>
            {contact.jobTitle}
          </Text>
        </View>
      )}

      <View style={[styles.footer, isOwn && styles.ownFooter]}>
        <Text style={[styles.addContactText, isOwn && styles.ownAddContactText]}>
          Tap to add to contacts
        </Text>
        <FontAwesome name="plus-circle" size={16} color={isOwn ? '#FFFFFF' : theme.colors.primary.main} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 12,
    padding: theme.spacing.md,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary.light + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  ownIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  ownContactName: {
    color: '#FFFFFF',
  },
  contactOrg: {
    fontSize: 14,
    color: theme.colors.text.secondary,
  },
  ownContactOrg: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  contactDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  contactDetailsContent: {
    flex: 1,
  },
  contactDetailItem: {
    marginBottom: 4,
  },
  contactDetailText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    textDecorationLine: 'underline',
  },
  ownContactDetailText: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    gap: theme.spacing.xs,
  },
  ownFooter: {
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  addContactText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
  ownAddContactText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ContactCard;
