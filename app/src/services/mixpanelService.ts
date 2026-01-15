import { Mixpanel } from 'mixpanel-react-native';
import Constants from 'expo-constants';

class MixpanelService {
  private mixpanel: Mixpanel | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize Mixpanel with the token from environment variables
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Use MIXPANEL_TOKEN directly from environment variables (via Expo Constants)
    const mixpanelToken = Constants.expoConfig?.extra?.mixpanelToken || process.env.MIXPANEL_TOKEN;

    if (!mixpanelToken) {
      console.warn('⚠️ [Mixpanel] MIXPANEL_TOKEN not found. Mixpanel will not be initialized.');
      return;
    }

    console.log('🔑 [Mixpanel] Token found:', mixpanelToken.substring(0, 12) + '...');

    try {
      // Follow official Mixpanel React Native documentation exactly
      // https://docs.mixpanel.com/docs/quickstart/connect-your-data?sdk=reactnative
      const trackAutomaticEvents = false;
      
      // Create Mixpanel instance (exactly as per official docs)
      this.mixpanel = new Mixpanel(mixpanelToken, trackAutomaticEvents);
      
      // Initialize with EU server URL (as per official EU residency docs)
      // Option: pass serverURL as 3rd parameter to init()
      const serverURL = Constants.expoConfig?.extra?.mixpanelServerURL || 'https://api-eu.mixpanel.com';
      await this.mixpanel.init(false, {}, serverURL);
      
      // Enable logging for debugging
      this.mixpanel.setLoggingEnabled(true);
      
      // Set flush batch size to 1 to send events immediately (for testing)
      this.mixpanel.setFlushBatchSize(1);
      
      this.isInitialized = true;
      console.log('✅ [Mixpanel] Initialized successfully');
      console.log('🌍 [Mixpanel] Server URL:', serverURL);
      console.log('🔧 [Mixpanel] Flush batch size: 1 (immediate sending)');
    } catch (error) {
      console.error('❌ [Mixpanel] Initialization failed:', error);
    }
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>): void {
    if (!this.mixpanel || !this.isInitialized) {
      console.warn(`⚠️ [Mixpanel] Cannot track "${eventName}" - Mixpanel not initialized`);
      return;
    }

    try {
      this.mixpanel.track(eventName, properties);
      console.log(`📊 [Mixpanel] Event tracked: "${eventName}"`, properties || '');
    } catch (error) {
      console.error(`❌ [Mixpanel] Failed to track event "${eventName}":`, error);
    }
  }

  /**
   * Identify a user
   */
  identify(userId: string): void {
    if (!this.mixpanel || !this.isInitialized) {
      return;
    }

    try {
      this.mixpanel.identify(userId);
    } catch (error) {
      console.error(`❌ [Mixpanel] Failed to identify user "${userId}":`, error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>): void {
    if (!this.mixpanel || !this.isInitialized) {
      console.warn('⚠️ [Mixpanel] Cannot set user properties - Mixpanel not initialized');
      return;
    }

    try {
      this.mixpanel.getPeople().set(properties);
      console.log('✅ [Mixpanel] User properties set:', properties);
    } catch (error) {
      console.error('❌ [Mixpanel] Failed to set user properties:', error);
    }
  }

  /**
   * Set people properties (alternative method)
   */
  peopleSet(properties: Record<string, any>): void {
    if (!this.mixpanel || !this.isInitialized) {
      return;
    }

    try {
      this.mixpanel.getPeople().set(properties);
    } catch (error) {
      console.error('❌ [Mixpanel] Failed to set people properties:', error);
    }
  }

  /**
   * Set super properties (sent with every event)
   */
  registerSuperProperties(properties: Record<string, any>): void {
    if (!this.mixpanel || !this.isInitialized) {
      return;
    }

    try {
      this.mixpanel.registerSuperProperties(properties);
    } catch (error) {
      console.error('❌ [Mixpanel] Failed to register super properties:', error);
    }
  }

  /**
   * Reset user identity (on logout)
   */
  reset(): void {
    if (!this.mixpanel || !this.isInitialized) {
      return;
    }

    try {
      this.mixpanel.reset();
    } catch (error) {
      console.error('❌ [Mixpanel] Failed to reset:', error);
    }
  }

  /**
   * Flush events (useful before app closes)
   */
  flush(): void {
    if (!this.mixpanel || !this.isInitialized) {
      console.warn('⚠️ [Mixpanel] Cannot flush - Mixpanel not initialized');
      return;
    }

    try {
      console.log('🔄 [Mixpanel] Flushing events...');
      this.mixpanel.flush();
      console.log('✅ [Mixpanel] Flush called successfully');
    } catch (error) {
      console.error('❌ [Mixpanel] Failed to flush:', error);
    }
  }

  /**
   * Get queue size (for debugging)
   */
  getQueueSize(): number {
    // This is a helper method for debugging
    // Note: mixpanel-react-native doesn't expose queue size directly
    return 0;
  }
}

// Export singleton instance
export const mixpanelService = new MixpanelService();
export default mixpanelService;
