import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import analyticsService from '../services/AnalyticsService';

/**
 * Hook personnalisé pour utiliser les analytics facilement dans les composants
 */
export const useAnalytics = () => {
  // Track screen view when component mounts or comes into focus
  const trackScreenView = useCallback((screenName: string, additionalData?: Record<string, any>) => {
    analyticsService.trackScreenView(screenName, additionalData);
  }, []);

  // Track profile view
  const trackProfileView = useCallback((profileData: {
    profileId: string;
    profileType: 'own' | 'other';
    viewerType: 'authenticated' | 'guest';
  }) => {
    analyticsService.trackProfileView(profileData);
  }, []);

  // Track post engagement
  const trackPostEngagement = useCallback((engagementData: {
    postId: string;
    action: 'view' | 'like' | 'comment' | 'share' | 'save';
    postType: 'text' | 'image' | 'video' | 'event';
    authorId?: string;
    timeSpent?: number;
  }) => {
    analyticsService.trackPostEngagement(engagementData);
  }, []);

  // Track event creation
  const trackEventCreation = useCallback((eventData: {
    eventId: string;
    eventType: string;
    creatorId: string;
    hasLocation: boolean;
    hasImages: boolean;
    categoryTags: string[];
    expectedParticipants?: number;
  }) => {
    analyticsService.trackEventCreation(eventData);
  }, []);

  // Track event interaction
  const trackEventInteraction = useCallback((interactionData: {
    eventId: string;
    action: 'view' | 'join' | 'leave' | 'share' | 'save' | 'review';
    userId: string;
    source?: 'list' | 'search' | 'recommendation' | 'direct';
  }) => {
    analyticsService.trackEventInteraction(interactionData);
  }, []);

  // Track app usage
  const trackAppUsage = useCallback((usageType: 'app_start' | 'screen_view' | 'feature_use' | 'session_end', data?: {
    screenName?: string;
    featureName?: string;
    sessionDuration?: number;
    userType?: 'authenticated' | 'guest';
  }) => {
    analyticsService.trackAppUsage(usageType, data);
  }, []);

  // Track performance
  const trackPerformance = useCallback((performanceData: {
    metric: 'load_time' | 'api_response_time' | 'image_load_time';
    value: number;
    context?: string;
  }) => {
    analyticsService.trackPerformance(performanceData);
  }, []);

  // Track errors
  const trackError = useCallback((error: Error, context?: string) => {
    analyticsService.trackError(error, context);
  }, []);

  return {
    trackScreenView,
    trackProfileView,
    trackPostEngagement,
    trackEventCreation,
    trackEventInteraction,
    trackAppUsage,
    trackPerformance,
    trackError,
    analyticsService,
  };
};

/**
 * Hook pour tracker automatiquement la vue d'un écran
 * Utilise useFocusEffect pour tracker à chaque fois que l'écran devient visible
 */
export const useScreenTracking = (screenName: string, additionalData?: Record<string, any>) => {
  const { trackScreenView } = useAnalytics();

  useFocusEffect(
    useCallback(() => {
      const startTime = Date.now();
      
      // Track screen view
      trackScreenView(screenName, additionalData);
      
      // Return cleanup function to track time spent
      return () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        analyticsService.trackAppUsage('feature_use', {
          featureName: `${screenName}_time_spent`,
          sessionDuration: timeSpent,
        });
      };
    }, [screenName, trackScreenView, additionalData])
  );
};

/**
 * Hook pour tracker les interactions avec les posts (temps passé, engagement)
 */
export const usePostTracking = (postId: string, postType: 'text' | 'image' | 'video' | 'event', authorId?: string) => {
  const { trackPostEngagement } = useAnalytics();
  const startTime = Date.now();

  // Track post view when component mounts
  useEffect(() => {
    trackPostEngagement({
      postId,
      action: 'view',
      postType,
      authorId,
    });
  }, [postId, postType, authorId, trackPostEngagement]);

  // Return tracking functions for interactions
  const trackLike = useCallback(() => {
    trackPostEngagement({
      postId,
      action: 'like',
      postType,
      authorId,
    });
  }, [postId, postType, authorId, trackPostEngagement]);

  const trackComment = useCallback(() => {
    trackPostEngagement({
      postId,
      action: 'comment',
      postType,
      authorId,
    });
  }, [postId, postType, authorId, trackPostEngagement]);

  const trackShare = useCallback(() => {
    trackPostEngagement({
      postId,
      action: 'share',
      postType,
      authorId,
    });
  }, [postId, postType, authorId, trackPostEngagement]);

  const trackSave = useCallback(() => {
    trackPostEngagement({
      postId,
      action: 'save',
      postType,
      authorId,
    });
  }, [postId, postType, authorId, trackPostEngagement]);

  // Track time spent when component unmounts
  useEffect(() => {
    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackPostEngagement({
        postId,
        action: 'view',
        postType,
        authorId,
        timeSpent,
      });
    };
  }, [postId, postType, authorId, trackPostEngagement]);

  return {
    trackLike,
    trackComment,
    trackShare,
    trackSave,
  };
};

export default useAnalytics; 