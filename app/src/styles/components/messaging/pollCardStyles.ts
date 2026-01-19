import { StyleSheet, Dimensions } from 'react-native';
import theme from '../../config/theme';

const { width: screenWidth } = Dimensions.get('window');

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
    maxWidth: screenWidth * 0.75,
    minWidth: 200,
    alignSelf: 'flex-start',
  },
  ownContainer: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  question: {
    flex: 1,
    fontSize: Math.max(14, screenWidth * 0.04),
    fontWeight: '600',
    color: theme.colors.text.primary,
    flexWrap: 'wrap',
  },
  ownQuestion: {
    color: '#FFFFFF',
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.grey[300],
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  optionVoted: {
    borderColor: '#000000',
    backgroundColor: '#000000',
  },
  ownOptionContainer: {
    borderColor: 'rgba(0, 0, 0, 0.8)',
    backgroundColor: '#000000',
  },
  ownOptionVoted: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.sm,
  },
  optionTextContainer: {
    flex: 1,
  },
  voteCountContainer: {
    paddingVertical: 4,
    paddingRight: 8,
    marginTop: 4,
  },
  optionText: {
    fontSize: Math.max(13, screenWidth * 0.035),
    color: '#000000',
    marginBottom: 2,
    flexWrap: 'wrap',
  },
  optionTextVoted: {
    color: '#FFFFFF',
  },
  ownOptionText: {
    color: '#000000',
    fontWeight: '700',
  },
  ownOptionTextUnselected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  voteCount: {
    fontSize: Math.max(11, screenWidth * 0.03),
    color: theme.colors.text.secondary,
  },
  voteCountVoted: {
    color: '#FFFFFF',
  },
  voteCountClickable: {
    textDecorationLine: 'underline',
  },
  ownVoteCount: {
    color: '#000000',
    fontWeight: '600',
  },
  ownVoteCountUnselected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: theme.colors.border.light,
    borderRadius: 2,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  ownProgressBarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary.main,
    borderRadius: 2,
  },
  ownProgressBar: {
    backgroundColor: '#FFFFFF',
  },
  percentage: {
    fontSize: Math.max(11, screenWidth * 0.03),
    fontWeight: '600',
    color: theme.colors.text.secondary,
    textAlign: 'right',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  percentageVoted: {
    color: '#FFFFFF',
  },
  ownPercentage: {
    color: '#000000',
    fontWeight: '700',
  },
  ownPercentageUnselected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  ownFooter: {
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  footerText: {
    fontSize: Math.max(11, screenWidth * 0.03),
    color: theme.colors.text.secondary,
  },
  ownFooterText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default styles;
