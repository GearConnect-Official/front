import { StyleSheet } from 'react-native';
import theme from '../../config/theme';

export default StyleSheet.create({
  container: {
    ...theme.common.container,
    backgroundColor: theme.colors.background.paper,
  },
  header: {
    ...theme.common.spaceBetween,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.apply({}, 'xs'),
  },
  backButton: {
    padding: theme.spacing.xs,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  placeholderRight: {
    width: 40,
    height: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary.main}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  mainTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  tableContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.borders.radius.md,
    overflow: 'hidden',
    ...theme.shadows.apply({}, 'sm'),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary.dark,
  },
  tableHeaderText: {
    ...theme.typography.subtitle1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  tableRowEven: {
    backgroundColor: theme.colors.background.paper,
  },
  featureText: {
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  checkContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingSection: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.background.input,
    borderRadius: theme.borders.radius.md,
    ...theme.shadows.apply({}, 'sm'),
  },
  priceLabel: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  price: {
    ...theme.typography.h2,
    color: theme.colors.primary.main,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  priceNote: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  payButton: {
    marginTop: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borders.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.apply({}, 'md'),
  },
  payButtonText: {
    ...theme.typography.subtitle1,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: theme.spacing.xxxl,
  },
});
