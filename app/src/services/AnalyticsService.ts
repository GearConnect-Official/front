import Constants from 'expo-constants';

// Meilleure détection d'environnement
const isExpoGo = Constants.executionEnvironment === 'storeClient';
const isDevelopmentClient = Constants.executionEnvironment === 'standalone' && __DEV__ && Constants.expoConfig?.extra?.eas?.projectId;
const isStandaloneAPK = Constants.executionEnvironment === 'standalone' && !isDevelopmentClient;
const isDevelopment = __DEV__;

let clarityModule: any = null;

// Microsoft Clarity est disponible dans les APK standalone et development clients, mais pas dans Expo Go
const shouldLoadClarity = !isExpoGo;

if (shouldLoadClarity) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    clarityModule = require('@microsoft/react-native-clarity');
    console.log('🔍 [Analytics] Microsoft Clarity module loaded successfully');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('🔍 [Analytics] Microsoft Clarity not available:', errorMessage);
  }
}

class AnalyticsService {
  private isInitialized = false;
  private clarityProjectId: string;
  private isAvailable = false;

  constructor() {
    this.clarityProjectId = Constants.expoConfig?.extra?.clarityProjectId || 'rwv1aa0ok8';
    this.isAvailable = shouldLoadClarity && clarityModule !== null;
    
    // Logging d'environnement pour debug
    console.log('🔍 [Analytics] Environment detection:', {
      executionEnvironment: Constants.executionEnvironment,
      isExpoGo,
      isDevelopmentClient,
      isStandaloneAPK,
      isDevelopment,
      shouldLoadClarity,
      clarityAvailable: this.isAvailable
    });
    
    if (isExpoGo) {
      console.log('🔍 [Analytics] Running in Expo Go - Analytics disabled');
    } else if (isDevelopmentClient) {
      console.log('🔍 [Analytics] Running in Development Client - Analytics enabled');
    } else if (isStandaloneAPK) {
      console.log('🔍 [Analytics] Running in Standalone APK - Analytics enabled');
    }
    
    if (!this.isAvailable && shouldLoadClarity) {
      console.log('🔍 [Analytics] Clarity module not available - using fallback mode');
    }
  }

  /**
   * Initialise Microsoft Clarity
   */
  async initializeAnalytics(): Promise<void> {
    if (!this.isAvailable) {
      console.log('🔍 [Analytics] Clarity not available - skipping initialization');
      this.isInitialized = true; // Marquer comme initialisé pour éviter les erreurs
      return;
    }

    try {
      if (this.isInitialized) {
        console.log('🔍 [Analytics] Clarity already initialized');
        return;
      }

      console.log('🔍 [Analytics] Initializing Clarity with project ID:', this.clarityProjectId);
      
      await clarityModule.initialize(this.clarityProjectId, {
        logLevel: isDevelopment ? 'Verbose' : 'None',
      });
      
      this.isInitialized = true;
      console.log('✅ [Analytics] Clarity initialized successfully');
      
      // Log app start event
      this.trackAppUsage('app_start');
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
      console.error('❌ [Analytics] Failed to initialize Clarity:', errorMessage);
      if (this.isAvailable && clarityModule?.logException) {
        clarityModule.logException(error);
      }
    }
  }

  /**
   * Helper pour logger les événements (avec fallback)
   */
  private logEvent(eventName: string, data: Record<string, any>): void {
    if (this.isAvailable && clarityModule?.logEvent) {
      clarityModule.logEvent(eventName, data);
    } else {
      console.log(`🔍 [Analytics] Event logged (fallback): ${eventName}`, data);
    }
  }

  /**
   * Helper pour logger les exceptions (avec fallback)
   */
  private logException(error: unknown): void {
    if (this.isAvailable && clarityModule?.logException) {
      clarityModule.logException(error);
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`🔍 [Analytics] Exception logged (fallback):`, errorMessage);
    }
  }

  /**
   * Helper pour logger les valeurs personnalisées (avec fallback)
   */
  private logCustomValue(key: string, value: number): void {
    if (this.isAvailable && clarityModule?.logCustomValue) {
      clarityModule.logCustomValue(key, value);
    } else {
      console.log(`🔍 [Analytics] Custom value logged (fallback): ${key} = ${value}`);
    }
  }

  /**
   * 1. Tracking des vues de profil
   */
  trackProfileView(profileData: {
    profileId: string;
    profileType: 'own' | 'other';
    viewerType: 'authenticated' | 'guest';
  }): void {
    try {
      this.logEvent('profile_view', {
        profile_id: profileData.profileId,
        profile_type: profileData.profileType,
        viewer_type: profileData.viewerType,
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Profile view tracked:', profileData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track profile view:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * 2. Métriques d'engagement sur les posts
   */
  trackPostEngagement(engagementData: {
    postId: string;
    action: 'view' | 'like' | 'comment' | 'share' | 'save';
    postType: 'text' | 'image' | 'video' | 'event';
    authorId?: string;
    timeSpent?: number; // en secondes
  }): void {
    try {
      this.logEvent('post_engagement', {
        post_id: engagementData.postId,
        action: engagementData.action,
        post_type: engagementData.postType,
        author_id: engagementData.authorId || 'unknown',
        time_spent: engagementData.timeSpent || 0,
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Post engagement tracked:', engagementData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track post engagement:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * 3. Analytics des événements créés
   */
  trackEventCreation(eventData: {
    eventId: string;
    eventType: string;
    creatorId: string;
    hasLocation: boolean;
    hasImages: boolean;
    categoryTags: string[];
    expectedParticipants?: number;
  }): void {
    try {
      this.logEvent('event_created', {
        event_id: eventData.eventId,
        event_type: eventData.eventType,
        creator_id: eventData.creatorId,
        has_location: eventData.hasLocation,
        has_images: eventData.hasImages,
        category_tags: eventData.categoryTags.join(','),
        expected_participants: eventData.expectedParticipants || 0,
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Event creation tracked:', eventData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track event creation:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * Analytics des interactions avec les événements
   */
  trackEventInteraction(interactionData: {
    eventId: string;
    action: 'view' | 'join' | 'leave' | 'share' | 'save' | 'review';
    userId: string;
    source?: 'list' | 'search' | 'recommendation' | 'direct';
  }): void {
    try {
      this.logEvent('event_interaction', {
        event_id: interactionData.eventId,
        action: interactionData.action,
        user_id: interactionData.userId,
        source: interactionData.source || 'unknown',
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Event interaction tracked:', interactionData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track event interaction:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * 4. Statistiques d'utilisation de l'app
   */
  trackAppUsage(usageType: 'app_start' | 'screen_view' | 'feature_use' | 'session_end', data?: {
    screenName?: string;
    featureName?: string;
    sessionDuration?: number;
    userType?: 'authenticated' | 'guest';
  }): void {
    try {
      this.logEvent('app_usage', {
        usage_type: usageType,
        screen_name: data?.screenName || '',
        feature_name: data?.featureName || '',
        session_duration: data?.sessionDuration || 0,
        user_type: data?.userType || 'unknown',
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] App usage tracked:', { usageType, ...data });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track app usage:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * Tracking des vues d'écran
   */
  trackScreenView(screenName: string, additionalData?: Record<string, any>): void {
    this.trackAppUsage('screen_view', {
      screenName,
      userType: 'authenticated', // À adapter selon le contexte d'auth
      ...additionalData,
    });
  }

  /**
   * Tracking des performances de l'app
   */
  trackPerformance(performanceData: {
    metric: 'load_time' | 'api_response_time' | 'image_load_time';
    value: number;
    context?: string;
  }): void {
    try {
      this.logCustomValue(`performance_${performanceData.metric}`, performanceData.value);
      
      this.logEvent('performance_metric', {
        metric: performanceData.metric,
        value: performanceData.value,
        context: performanceData.context || '',
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Performance tracked:', performanceData);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track performance:', errorMessage);
      this.logException(error);
    }
  }

  /**
   * Tracking des erreurs personnalisées
   */
  trackError(error: Error, context?: string): void {
    try {
      this.logException(error);
      
      this.logEvent('app_error', {
        error_message: error.message,
        error_stack: error.stack || '',
        context: context || '',
        timestamp: new Date().toISOString(),
      });
      
      console.log('🔍 [Analytics] Error tracked:', { error: error.message, context });
    } catch (trackingError: unknown) {
      const errorMessage = trackingError instanceof Error ? trackingError.message : 'Unknown tracking error';
      console.error('❌ [Analytics] Failed to track error:', errorMessage);
    }
  }

  /**
   * Méthodes utilitaires pour obtenir des insights
   */
  getAnalyticsStatus(): { isInitialized: boolean; projectId: string; isAvailable: boolean; environment: string } {
    return {
      isInitialized: this.isInitialized,
      projectId: this.clarityProjectId,
      isAvailable: this.isAvailable,
      environment: isExpoGo ? 'expo-go' : isDevelopmentClient ? 'development-client' : isStandaloneAPK ? 'standalone-apk' : 'unknown',
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService; 