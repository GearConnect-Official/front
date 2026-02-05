import { StyleSheet, Platform, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width } = Dimensions.get('window');
const BOTTOM_CARD_HEIGHT = 220;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },

  // Map
  map: {
    flex: 1,
  },

  // Top Bar overlay
  topBarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.md,
  },
  searchBarContainer: {
    flex: 1,
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.md,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body2,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
    height: 44,
  },

  // Category filters
  categoryContainer: {
    marginTop: theme.spacing.sm,
  },
  categoryScroll: {
    paddingRight: theme.spacing.md,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: theme.spacing.xs,
    gap: 6,
    ...theme.shadows.sm,
  },
  categoryChipActive: {
    // backgroundColor set dynamically
  },
  categoryChipText: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.text.secondary,
  },
  categoryChipTextActive: {
    color: '#fff',
  },

  // Custom marker
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    ...theme.shadows.md,
  },
  markerBubbleJoined: {
    borderColor: theme.colors.status.success,
    borderWidth: 3,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },

  // Locate me button
  locateButton: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: BOTTOM_CARD_HEIGHT + 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },

  // Bottom card (selected event)
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 36 : theme.spacing.lg,
    ...theme.shadows.lg,
  },
  bottomCardHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.grey[200],
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
  bottomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  bottomCardHeaderLeft: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  bottomCardCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  bottomCardCategoryText: {
    ...theme.typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bottomCardTitle: {
    ...theme.typography.h5,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  bottomCardPrice: {
    ...theme.typography.subtitle1,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  bottomCardInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  bottomCardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bottomCardInfoText: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
  },
  bottomCardDescription: {
    ...theme.typography.body2,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  bottomCardActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  detailButton: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailButtonText: {
    ...theme.typography.button,
    color: '#fff',
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  joinButtonJoined: {
    borderColor: theme.colors.status.success,
    backgroundColor: theme.colors.status.success,
  },
  joinButtonText: {
    ...theme.typography.button,
    color: theme.colors.primary.main,
  },
  joinButtonTextJoined: {
    color: '#fff',
  },

  // Bottom events carousel (when no event selected)
  carouselContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : theme.spacing.md,
  },
  carouselScroll: {
    paddingHorizontal: theme.spacing.md,
  },
  carouselCard: {
    width: width * 0.72,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  carouselCardContent: {
    padding: theme.spacing.sm + 2,
  },
  carouselCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  carouselCardCategory: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  carouselCardCategoryText: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: '#fff',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  carouselCardPrice: {
    ...theme.typography.subtitle2,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  carouselCardTitle: {
    ...theme.typography.subtitle1,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  carouselCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  carouselCardInfoText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  carouselCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  carouselCardParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carouselCardParticipantsText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  carouselCardProgressBar: {
    height: 3,
    backgroundColor: theme.colors.grey[100],
    borderRadius: 2,
    width: 50,
    marginLeft: 6,
  },
  carouselCardProgressFill: {
    height: 3,
    borderRadius: 2,
  },
  carouselCardJoinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  carouselCardJoinedText: {
    ...theme.typography.caption,
    color: theme.colors.status.success,
    fontWeight: '600',
    fontSize: 10,
  },

  // Events count badge
  eventCountBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 114 : 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 35, 44, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  eventCountText: {
    ...theme.typography.caption,
    color: '#fff',
    fontWeight: '600',
  },

  // Empty state
  emptyCarouselCard: {
    width: width - 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.md,
    minHeight: 120,
  },
  emptyText: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default styles;
