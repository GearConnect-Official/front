import { StyleSheet } from 'react-native';
import theme from './config';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
  },
  topBar: {
    backgroundColor: theme.colors.background.paper,
    ...theme.shadows.apply({}, 'topBar'),
    minHeight: theme.spacing.height.toolbar,
  },
  topBarContent: {
    ...theme.common.row,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    gap: theme.spacing.xs + 4,
  },
  topBarTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xs + 4,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  textInput: {
    ...theme.borders.apply({}, { 
      width: 1, 
      color: theme.colors.border.medium, 
      radius: 'sm' 
    }),
    padding: theme.spacing.xs + 4,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.body1.fontWeight,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.paper,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: "top",
  },
  inputInfo: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    padding: theme.spacing.xs + 4,
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  submitButtonText: {
    color: theme.colors.common.white,
    ...theme.typography.button,
  },
});

export default styles; 