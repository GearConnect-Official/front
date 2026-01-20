import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

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

export default styles;
