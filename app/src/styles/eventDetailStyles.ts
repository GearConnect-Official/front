import { StyleSheet } from 'react-native';
import theme from './config/theme';

export const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    paddingBottom: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
    ...theme.common.spaceBetween,
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
    marginLeft: theme.spacing.sm,
  },
  reviewButton: {
    backgroundColor: theme.colors.primary.main,
    padding: theme.spacing.sm,
    ...theme.borders.apply({}, { preset: 'button' }),
  },
  reviewText: { color: theme.colors.common.white },
  editButton: {
    backgroundColor: theme.colors.common.black,
    padding: theme.spacing.sm,
    ...theme.borders.apply({}, { preset: 'button' }),
  },
  eventTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
  },
  eventCategory: { color: theme.colors.text.secondary },
  descriptionContainer: {
    ...theme.common.row,
    marginBottom: theme.spacing.sm,
  },
  eventImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing.sm,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borders.radius.md,
    marginRight: theme.spacing.sm,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[200],
  },
  aboutContainer: { flex: 1 },
  aboutTitle: { fontWeight: theme.typography.h3.fontWeight },
  tagContainer: {
    ...theme.common.row,
    marginTop: theme.spacing.xs,
  },
  tag: {
    backgroundColor: theme.colors.grey[200],
    padding: theme.spacing.xs,
    ...theme.borders.apply({}, { radius: theme.borders.radius.sm }),
    marginRight: theme.spacing.xs,
  },
  description: { marginTop: theme.spacing.xs },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    marginVertical: theme.spacing.sm,
  },
  mainEventImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borders.radius.md,
  },
  placeholderMainImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borders.radius.md,
    ...theme.common.centerContent,
    backgroundColor: theme.colors.grey[200],
  },
  detailRow: {
    ...theme.common.row,
    marginVertical: theme.spacing.xs,
  },
  detailText: { marginLeft: theme.spacing.xs },
  productCard: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    ...theme.borders.apply({}, { preset: 'card' }),
  },
  productImage: { width: 80, height: 80 },
  productTitle: { fontWeight: theme.typography.body1.fontWeight },
  productTag: {
    backgroundColor: theme.colors.common.black,
    color: theme.colors.common.white,
    padding: theme.spacing.xs,
  },
  productPrice: { marginTop: theme.spacing.xs },
  reviewHeader: {
    ...theme.common.row,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  reviewUser: {
    fontWeight: theme.typography.body1.fontWeight,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body1.fontSize,
  },
  reviewUserInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  starContainer: {
    ...theme.common.row,
    marginTop: 2,
  },
  shareButton: {
    backgroundColor: theme.colors.grey[200],
    padding: theme.spacing.md,
    ...theme.borders.apply({}, { radius: theme.borders.radius.md }),
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  reviewCard: {
    padding: theme.spacing.xs,
    ...theme.borders.apply({}, { preset: 'card' }),
    marginRight: theme.spacing.xs,
    width: 220,
    height: 150,
  },
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  reviewDescription: {
    fontSize: theme.typography.body2.fontSize,
  },
  showMoreButton: {
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  showMoreButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
  },
  reviewSection: {
    ...theme.common.spaceBetween,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  buyButton: {
    backgroundColor: theme.colors.secondary.main,
    padding: theme.spacing.md,
    ...theme.borders.apply({}, { radius: theme.borders.radius.md }),
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  buyButtonText: {
    color: theme.colors.common.white,
    fontWeight: theme.typography.button.fontWeight,
  },
  addCalendarButton: {
    backgroundColor: theme.colors.grey[200],
    padding: theme.spacing.md,
    ...theme.borders.apply({}, { radius: theme.borders.radius.md }),
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  addCalendarText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.button.fontWeight,
  },
  shareText: {
    color: theme.colors.text.primary,
  },
  errorText: {
    fontSize: theme.typography.error.fontSize,
    color: theme.colors.status.error,
  },
  goBackText: {
    fontSize: theme.typography.subtitle1.fontSize,
    color: theme.colors.status.info,
    marginTop: theme.spacing.sm,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.grey[500],
    marginTop: 10,
  },
  noProductsContainer: {
    padding: theme.spacing.sm,
    ...theme.borders.apply(
      {},
      {
        width: 5,
        color: theme.colors.border.light,
        radius: theme.borders.radius.sm,
      }
    ),
    backgroundColor: theme.colors.grey[50],
    marginTop: theme.spacing.xs,
  },
  noProductsText: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.sm,
  },
  noReviewsContainer: {
    padding: theme.spacing.sm,
    ...theme.borders.apply(
      {},
      {
        width: 5,
        color: theme.colors.border.light,
        radius: theme.borders.radius.sm,
      }
    ),
    backgroundColor: theme.colors.grey[50],
    marginTop: theme.spacing.xs,
  },
  noReviewsText: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.sm,
  },
});

export default styles;
