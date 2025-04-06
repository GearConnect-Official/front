import { StyleSheet } from 'react-native';
import theme from './config';

// Palette de couleurs racing
const RACING_COLORS = {
  primary: '#E10600', // Rouge Racing
  secondary: '#1E1E1E', // Noir Racing
  background: '#FFFFFF',
  textPrimary: '#1E1E1E',
  textSecondary: '#6E6E6E',
  card: '#F8F8F8',
  redLight: '#FF3333',
  redDark: '#CC0000',
};

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.default,
  },
  topBar: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.apply({}, 'topBar'),
    minHeight: theme.spacing.height.toolbar,
  },
  topBarContent: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  topBarTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.md,
    ...theme.shadows.apply({}, 'xs'),
  },
  inputLabel: {
    ...theme.typography.subtitle1,
    color: RACING_COLORS.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  labelText: {
    ...theme.typography.subtitle1,
    color: RACING_COLORS.primary,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  textInput: {
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'md' 
    }),
    padding: theme.spacing.md,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  textAreaInput: {
    height: 120,
    textAlignVertical: "top",
  },
  inputInfo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: RACING_COLORS.primary,
    borderRadius: theme.borders.radius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    marginVertical: theme.spacing.lg,
    ...theme.shadows.apply({}, 'md'),
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  submitButtonText: {
    color: theme.colors.common.white,
    ...theme.typography.button,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.lg,
    fontWeight: 'bold',
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  datePickerColumn: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
  },
  datePickerInput: {
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'md' 
    }),
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    width: '100%',
  },
  datePickerText: {
    flex: 1,
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.primary,
  },
  jobTypeContainer: {
    marginTop: theme.spacing.md,
  },
  jobTypeTitle: {
    ...theme.typography.subtitle1,
    color: RACING_COLORS.primary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
  },
  jobTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  jobTypeOption: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  jobTypeSelected: {
    borderColor: RACING_COLORS.primary,
    backgroundColor: 'rgba(225, 6, 0, 0.1)',
  },
  jobTypeText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
  },
  jobTypeSelectedText: {
    color: RACING_COLORS.primary,
    fontWeight: 'bold',
  },
});

export default styles; 