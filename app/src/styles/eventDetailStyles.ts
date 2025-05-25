import { StyleSheet } from 'react-native';
import theme from './config/theme';

export const styles = StyleSheet.create({
  // Layout containers
  container: {
    ...theme.common.container,
    flex: 1,
    maxWidth: 480,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    margin: theme.spacing.sm,
  },

  // Top navigation
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
  headerTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Event header and info
  eventInfo: {
    flex: 1,
    ...theme.common.spaceBetween,
    marginBottom: theme.spacing.sm,
  },
  eventTitle: {
    fontSize: theme.typography.h2.fontSize,
    fontWeight: theme.typography.h2.fontWeight,
  },
  eventCategory: {
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    marginVertical: theme.spacing.sm,
  },

  // Images
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

  // Description section
  descriptionContainer: {
    ...theme.common.row,
    marginBottom: theme.spacing.sm,
  },
  aboutContainer: {
    flex: 1,
  },
  aboutTitle: {
    fontWeight: theme.typography.h3.fontWeight,
  },
  description: {
    marginTop: theme.spacing.xs,
  },
  detailRow: {
    ...theme.common.row,
    marginVertical: theme.spacing.xs,
  },
  detailText: {
    marginLeft: theme.spacing.xs,
  },

  // Tags
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
  noTagsText: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    padding: theme.spacing.sm,
  },

  // Products
  productCard: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    ...theme.borders.apply({}, { preset: 'card' }),
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productTitle: {
    fontWeight: theme.typography.body1.fontWeight,
  },
  productTag: {
    backgroundColor: theme.colors.common.black,
    color: theme.colors.common.white,
    padding: theme.spacing.xs,
  },
  productPrice: {
    marginTop: theme.spacing.xs,
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

  // Reviews
  reviewSection: {
    ...theme.common.spaceBetween,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  reviewCard: {
    padding: theme.spacing.xs,
    ...theme.borders.apply({}, { preset: 'card' }),
    marginRight: theme.spacing.xs,
    width: 220,
    minHeight: 150,
  },
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
  reviewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  reviewDescription: {
    fontSize: theme.typography.body2.fontSize,
    flexGrow: 1,
  },
  starContainer: {
    ...theme.common.row,
    marginTop: 2,
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

  // Buttons
  reviewButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reviewText: {
    color: theme.colors.common.white,
  },
  editButton: {
    backgroundColor: theme.colors.common.black,
    padding: theme.spacing.sm,
    ...theme.borders.apply({}, { preset: 'button' }),
  },
  createReviewButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  createReviewButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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
  shareButton: {
    backgroundColor: theme.colors.grey[200],
    padding: theme.spacing.md,
    ...theme.borders.apply({}, { radius: theme.borders.radius.md }),
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  shareText: {
    color: theme.colors.text.primary,
  },

  // Status messages
  errorText: {
    fontSize: theme.typography.error.fontSize,
    color: theme.colors.status.error,
  },
  goBackText: {
    fontSize: theme.typography.subtitle1.fontSize,
    color: theme.colors.status.info,
    marginTop: theme.spacing.sm,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.grey[500],
    marginTop: 10,
  },
});

export default styles;
