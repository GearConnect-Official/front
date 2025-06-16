import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

// Couleurs de la thématique racing
const RACING_RED = '#E10600';
const RACING_BLUE = '#3a86ff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  topBar: {
    height: 60,
    backgroundColor: theme.colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.colors.background.input,
    color: theme.colors.text.primary,
  },
  textAreaInput: {
    height: 120,
    textAlignVertical: "top",
  },
  inputInfo: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4,
    marginLeft: 4,
  },
  jobTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  jobTypeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background.input,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  jobTypeSelected: {
    backgroundColor: "rgba(225, 6, 0, 0.1)",
    borderColor: RACING_RED,
  },
  jobTypeText: {
    fontSize: 14,
    color: theme.colors.text.primary,
  },
  jobTypeSelectedText: {
    color: RACING_RED,
    fontWeight: "600",
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  datePickerColumn: {
    flex: 1,
    marginRight: 8,
  },
  datePickerInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: theme.colors.background.input,
  },
  datePickerText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  submitButton: {
    backgroundColor: RACING_RED,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: theme.colors.common.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 16,
    marginTop: 8,
  },
  jobTypeContainer: {
    marginTop: theme.spacing.md,
  },
  jobTypeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  cardContainer: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: 16,
  },
  icon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(58, 134, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: RACING_RED,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: {
    color: theme.colors.common.white,
    fontSize: 12,
    fontWeight: "600",
  },
  animatedButton: {
    backgroundColor: RACING_RED,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 40,
    transform: [{ scale: 1 }],
  },
  heroSection: {
    padding: 24,
    backgroundColor: '#f0f7ff',
    marginBottom: 16,
    borderRadius: 8,
  },
  heroTitle: {
    fontSize: 24,
    color: '#1E1E1E',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#666',
    maxWidth: '90%',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#f5f5f5',
    marginVertical: 16,
  },
  ctaSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 24,
  },
  ctaTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  submitButtonCta: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'flex-start',
  },
  submitButtonCtaText: {
    color: RACING_BLUE,
    fontWeight: 'bold',
  },
});

export default styles; 