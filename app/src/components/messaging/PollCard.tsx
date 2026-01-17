import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import theme from '../../styles/config/theme';
import { PollData, PollOption } from './PollCreator';
import PollVotersModal, { PollVoter } from './PollVotersModal';

const { width: screenWidth } = Dimensions.get('window');

export interface PollVote {
  optionId: string;
  userId: number;
  userName?: string;
  userAvatar?: string;
  userAvatarPublicId?: string;
  isVerify?: boolean;
}

export interface PollWithVotes extends PollData {
  id?: number;
  messageId?: number;
  votes?: PollVote[];
  userVotes?: string[]; // Option IDs that the current user has voted for
  totalVotes?: number;
}

interface PollCardProps {
  poll: PollWithVotes;
  isOwn: boolean;
  currentUserId?: number;
  currentUserName?: string;
  currentUserAvatar?: string;
  currentUserAvatarPublicId?: string;
  currentUserIsVerify?: boolean;
  onVote?: (optionId: string) => Promise<void>;
  isVoting?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PollCard: React.FC<PollCardProps> = ({
  poll,
  isOwn,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  currentUserAvatarPublicId,
  currentUserIsVerify,
  onVote,
  onEdit,
  onDelete,
  isVoting = false,
}) => {
  const [localVotes, setLocalVotes] = useState<string[]>(poll.userVotes || []);
  const [localVoteCounts, setLocalVoteCounts] = useState<Record<string, number>>({});
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showVotersModal, setShowVotersModal] = useState(false);

  // Calculate vote counts
  useEffect(() => {
    const counts: Record<string, number> = {};
    poll.options.forEach((opt) => {
      counts[opt.id] = 0;
    });

    if (poll.votes) {
      poll.votes.forEach((vote) => {
        counts[vote.optionId] = (counts[vote.optionId] || 0) + 1;
      });
    }

    // Add local votes that haven't been synced yet
    localVotes.forEach((optionId) => {
      if (!poll.userVotes?.includes(optionId)) {
        counts[optionId] = (counts[optionId] || 0) + 1;
      }
    });

    setLocalVoteCounts(counts);
  }, [poll.votes, poll.userVotes, localVotes, poll.options]);

  const totalVotes = Object.values(localVoteCounts).reduce((sum, count) => sum + count, 0);
  const maxVotes = Math.max(...Object.values(localVoteCounts), 0);

  const handleVote = async (optionId: string) => {
    if (isVoting || !onVote) return;

    // Check if already voted for this option
    const hasVoted = localVotes.includes(optionId);

    if (hasVoted && !poll.allowMultipleAnswers) {
      // Can't unvote if single answer
      return;
    }

    if (hasVoted && poll.allowMultipleAnswers) {
      // Unvote
      setLocalVotes(localVotes.filter((id) => id !== optionId));
      // Note: We don't call onVote for unvoting, just update local state
      // The backend should handle this separately
      return;
    }

    if (!poll.allowMultipleAnswers && localVotes.length > 0) {
      // Replace previous vote
      setLocalVotes([optionId]);
    } else {
      // Add vote
      setLocalVotes([...localVotes, optionId]);
    }

    // Call backend
    if (onVote) {
      try {
        await onVote(optionId);
      } catch (error) {
        // Revert on error
        setLocalVotes(poll.userVotes || []);
      }
    }
  };

  const getPercentage = (optionId: string): number => {
    if (totalVotes === 0) return 0;
    return (localVoteCounts[optionId] || 0) / totalVotes * 100;
  };

  const isVoted = (optionId: string): boolean => {
    return localVotes.includes(optionId);
  };

  // Show results if user is the creator (isOwn) or if user has voted
  const shouldShowResults = isOwn || localVotes.length > 0;

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      {/* Question */}
      <View style={styles.header}>
        <FontAwesome5 name="chart-bar" size={20} color={isOwn ? '#FFFFFF' : theme.colors.primary.main} solid />
        <Text style={[styles.question, isOwn && styles.ownQuestion]}>{poll.question}</Text>
        {isOwn && (onEdit || onDelete) && (
          <TouchableOpacity
            onPress={(e) => {
              // Prevent event propagation to avoid triggering long press on parent
              e.stopPropagation();
              if (onEdit) onEdit();
            }}
            style={styles.settingsButton}
            activeOpacity={0.7}
          >
            <FontAwesome
              name="cog"
              size={18}
              color={isOwn ? '#FFFFFF' : theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {poll.options.map((option) => {
          const percentage = getPercentage(option.id);
          const voted = isVoted(option.id);
          const voteCount = localVoteCounts[option.id] || 0;

          return (
            <View
              key={option.id}
              style={[
                styles.optionContainer,
                isOwn && !voted && styles.ownOptionContainer,
                voted && !isOwn && styles.optionVoted,
                isOwn && voted && styles.ownOptionVoted,
              ]}
            >
              <View style={styles.optionContent}>
                <TouchableOpacity
                  style={styles.optionTextContainer}
                  onPress={() => handleVote(option.id)}
                  activeOpacity={0.7}
                  disabled={isVoting}
                >
                  <Text style={[
                    styles.optionText,
                    !isOwn && voted && styles.optionTextVoted,
                    isOwn && !voted && styles.ownOptionTextUnselected,
                    isOwn && voted && styles.ownOptionText,
                  ]}>
                    {option.text}
                  </Text>
                  {shouldShowResults && voteCount > 0 && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedOptionId(option.id);
                        setShowVotersModal(true);
                      }}
                      activeOpacity={0.7}
                      style={styles.voteCountContainer}
                    >
                      <Text style={[
                        styles.voteCount,
                        styles.voteCountClickable,
                        !isOwn && voted && styles.voteCountVoted,
                        isOwn && voted && styles.ownVoteCount,
                        isOwn && !voted && styles.ownVoteCountUnselected,
                      ]}>
                        {voteCount} {voteCount === 1 ? 'vote' : 'votes'} • Tap to see
                      </Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
                {voted && (
                  <FontAwesome
                    name="check-circle"
                    size={20}
                    color={isOwn ? '#000000' : '#FFFFFF'}
                  />
                )}
              </View>
              {shouldShowResults && totalVotes > 0 && (
                <View style={[styles.progressBarContainer, isOwn && styles.ownProgressBarContainer]}>
                  <View
                    style={[
                      styles.progressBar,
                      isOwn && styles.ownProgressBar,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>
              )}
              {shouldShowResults && percentage > 0 && (
                <Text style={[
                  styles.percentage,
                  !isOwn && voted && styles.percentageVoted,
                  isOwn && voted && styles.ownPercentage,
                  isOwn && !voted && styles.ownPercentageUnselected,
                ]}>
                  {Math.round(percentage)}%
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={[styles.footer, isOwn && styles.ownFooter]}>
        <Text style={[styles.footerText, isOwn && styles.ownFooterText]}>
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
          {poll.allowMultipleAnswers && ' • Multiple answers allowed'}
          {poll.isAnonymous && ' • Anonymous'}
        </Text>
      </View>

      {isVoting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={isOwn ? '#FFFFFF' : theme.colors.primary.main} />
        </View>
      )}

      {/* Voters Modal */}
      {selectedOptionId && (
        <PollVotersModal
          visible={showVotersModal}
          optionText={poll.options.find(opt => opt.id === selectedOptionId)?.text || ''}
          voters={(() => {
            // Get votes from backend
            const backendVotes = poll.votes
              ?.filter(vote => vote.optionId === selectedOptionId)
              .map(vote => ({
                userId: vote.userId,
                userName: vote.userName || 'Unknown User',
                userAvatar: vote.userAvatar,
                userAvatarPublicId: vote.userAvatarPublicId,
                isVerify: vote.isVerify,
              })) || [];

            // Add local votes that haven't been synced yet (including current user's vote)
            const localVotesForOption = localVotes.filter(id => id === selectedOptionId);
            const syncedVoteUserIds = new Set(backendVotes.map(v => v.userId));
            
            const localVoters = localVotesForOption
              .filter(() => currentUserId && !syncedVoteUserIds.has(currentUserId))
              .map(() => ({
                userId: currentUserId!,
                userName: currentUserName || 'You',
                userAvatar: currentUserAvatar,
                userAvatarPublicId: currentUserAvatarPublicId,
                isVerify: currentUserIsVerify || false,
              }));

            // Combine and remove duplicates
            const allVoters = [...backendVotes, ...localVoters];
            const uniqueVoters = allVoters.filter((voter, index, self) =>
              index === self.findIndex(v => v.userId === voter.userId)
            );

            return uniqueVoters;
          })()}
          isAnonymous={poll.isAnonymous || false}
          onClose={() => {
            setShowVotersModal(false);
            setSelectedOptionId(null);
          }}
        />
      )}
    </View>
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

export default PollCard;
