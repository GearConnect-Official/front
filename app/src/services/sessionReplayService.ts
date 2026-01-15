import Constants from 'expo-constants';

// Check if running in Expo Go (where native modules are not available)
// Expo Go has Constants.appOwnership === 'expo'
// Also check if we're in a development environment where native modules might not be linked
const isExpoGo = 
  Constants.appOwnership === 'expo' || 
  Constants.executionEnvironment === 'storeClient' ||
  !Constants.isDevice;

// Dynamic import for ESM module compatibility
let MPSessionReplay: any;
let MPSessionReplayConfig: any;
let MPSessionReplayMask: any;
let moduleLoadAttempted: boolean = false;

// Lazy load the module
const loadSessionReplayModule = async () => {
  // Skip loading if we're in Expo Go or if we've already attempted to load
  if (isExpoGo) {
    return { MPSessionReplay: null, MPSessionReplayConfig: null, MPSessionReplayMask: null };
  }

  if (moduleLoadAttempted) {
    return { MPSessionReplay, MPSessionReplayConfig, MPSessionReplayMask };
  }

  if (!MPSessionReplay) {
    moduleLoadAttempted = true;
    try {
      // Use a more defensive import approach
      const module = await Promise.resolve(import('@mixpanel/react-native-session-replay')).catch(() => null);
      if (module) {
        MPSessionReplay = module.MPSessionReplay;
        MPSessionReplayConfig = module.MPSessionReplayConfig;
        MPSessionReplayMask = module.MPSessionReplayMask;
      } else {
        MPSessionReplay = null;
        MPSessionReplayConfig = null;
        MPSessionReplayMask = null;
      }
    } catch (error: any) {
      // Module not available (e.g., in Expo Go or not properly linked)
      // Silently handle the error to avoid console noise
      MPSessionReplay = null;
      MPSessionReplayConfig = null;
      MPSessionReplayMask = null;
    }
  }
  return { MPSessionReplay, MPSessionReplayConfig, MPSessionReplayMask };
};

class SessionReplayService {
  private isInitialized: boolean = false;
  private distinctId: string | null = null;

  /**
   * Initialize Session Replay with configuration
   */
  async initialize(distinctId: string): Promise<void> {
    if (this.isInitialized) {
      console.log('⚠️ [Session Replay] Already initialized');
      return;
    }

    // Skip initialization if running in Expo Go
    if (isExpoGo) {
      // Silently skip - no need to log as this is expected in Expo Go
      return;
    }

    // Get Mixpanel token from environment variables
    const mixpanelToken = Constants.expoConfig?.extra?.mixpanelToken || process.env.MIXPANEL_TOKEN;

    if (!mixpanelToken) {
      console.warn('⚠️ [Session Replay] MIXPANEL_TOKEN not found. Session Replay will not be initialized.');
      return;
    }

    try {
      // Load the module dynamically
      const { MPSessionReplay: MP, MPSessionReplayConfig: Config, MPSessionReplayMask: Mask } = await loadSessionReplayModule();

      // Check if module is available (not compatible with Expo Go)
      if (!MP || !Config || !Mask) {
        // Silently skip - module not available (expected in Expo Go or if not properly linked)
        return;
      }

      // Create configuration according to official documentation
      // https://docs.mixpanel.com/docs/tracking-methods/sdks/react-native/react-native-replay
      const config = new Config({
        wifiOnly: false, // Allow recording over cellular data
        recordingSessionsPercent: 100, // Record 100% of sessions (adjust as needed)
        autoStartRecording: true, // Automatically start recording on initialization
        autoMaskedViews: [
          Mask.Text, // Mask text inputs and labels for privacy
          Mask.Image, // Mask images for privacy
          // Mask.Web, // Uncomment if you have WebViews
          // Mask.Map, // Uncomment if you have Map views (iOS only)
        ],
        flushInterval: 5, // Flush recordings every 5 seconds
        enableLogging: true, // Enable debug logging for development
      });

      // Initialize Session Replay
      await MP.initialize(mixpanelToken, distinctId, config).catch((error: any) => {
        console.error('❌ [Session Replay] Initialization failed:', error);
        throw error;
      });

      this.isInitialized = true;
      this.distinctId = distinctId;
      console.log('✅ [Session Replay] Initialized successfully');
      console.log('🔧 [Session Replay] Config:', {
        wifiOnly: false,
        recordingSessionsPercent: 100,
        autoStartRecording: true,
        autoMaskedViews: ['Text', 'Image'],
        flushInterval: 5,
      });
    } catch (error) {
      console.error('❌ [Session Replay] Initialization error:', error);
    }
  }

  /**
   * Start recording a session
   */
  async startRecording(): Promise<void> {
    if (!this.isInitialized || isExpoGo) {
      return;
    }

    try {
      const { MPSessionReplay: MP } = await loadSessionReplayModule();
      if (!MP) return;
      await MP.startRecording();
      console.log('🎬 [Session Replay] Recording started');
    } catch (error) {
      console.error('❌ [Session Replay] Failed to start recording:', error);
    }
  }

  /**
   * Stop recording a session
   */
  async stopRecording(): Promise<void> {
    if (!this.isInitialized || isExpoGo) {
      return;
    }

    try {
      const { MPSessionReplay: MP } = await loadSessionReplayModule();
      if (!MP) return;
      await MP.stopRecording();
      console.log('⏹️ [Session Replay] Recording stopped');
    } catch (error) {
      console.error('❌ [Session Replay] Failed to stop recording:', error);
    }
  }

  /**
   * Check if recording is active
   */
  async isRecording(): Promise<boolean> {
    if (!this.isInitialized || isExpoGo) {
      return false;
    }

    try {
      const { MPSessionReplay: MP } = await loadSessionReplayModule();
      if (!MP) return false;
      const recording = await MP.isRecording();
      return recording;
    } catch (error) {
      console.error('❌ [Session Replay] Failed to check recording status:', error);
      return false;
    }
  }

  /**
   * Identify user for Session Replay
   */
  async identify(distinctId: string): Promise<void> {
    if (!this.isInitialized || isExpoGo) {
      return;
    }

    try {
      const { MPSessionReplay: MP } = await loadSessionReplayModule();
      if (!MP) return;
      await MP.identify(distinctId);
      this.distinctId = distinctId;
      console.log('👤 [Session Replay] User identified:', distinctId);
    } catch (error) {
      console.error('❌ [Session Replay] Failed to identify user:', error);
    }
  }

  /**
   * Get initialization status
   */
  getInitializationStatus(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const sessionReplayService = new SessionReplayService();
export default sessionReplayService;
