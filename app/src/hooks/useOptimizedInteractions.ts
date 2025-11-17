import { useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMessage } from '../context/MessageContext';
import * as postService from '../services/postService';
import favoritesService from '../services/favoritesService';

interface OptimizedInteractionsConfig {
  onSuccess?: () => void; // Callback appelé après une interaction réussie
  debounceMs?: number; // Délai de debouncing (défaut: 300ms)
}

interface UseOptimizedInteractionsReturn {
  handleLike: (postId: string) => Promise<void>;
  handleSave: (postId: string) => Promise<void>;
  isProcessing: (postId: string) => boolean;
}

export const useOptimizedInteractions = (
  config: OptimizedInteractionsConfig = {}
): UseOptimizedInteractionsReturn => {
  const { onSuccess, debounceMs = 300 } = config;
  const authContext = useAuth();
  const user = authContext?.user;
  const { showError } = useMessage();
  
  // Tracker des interactions en cours pour éviter les doublons
  const processingRef = useRef<Set<string>>(new Set());
  const debounceTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const isProcessing = useCallback((postId: string) => {
    return processingRef.current.has(postId);
  }, []);

  const handleLike = useCallback(async (postId: string) => {
    if (!user?.id) {
      showError('You must be logged in to like posts');
      return;
    }

    const interactionKey = `like-${postId}`;
    
    // Éviter les clics multiples
    if (processingRef.current.has(interactionKey)) {
      console.log('🚫 Like already in progress for post:', postId);
      return;
    }

    // Debouncing
    const existingTimeout = debounceTimeouts.current.get(interactionKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(async () => {
      processingRef.current.add(interactionKey);
      
      try {
        const currentUserId = parseInt(user.id.toString());
        console.log('👍 Processing like for post:', postId);
        
        await postService.default.toggleLike(parseInt(postId), currentUserId);
        
        // Appeler le callback de succès si fourni
        onSuccess?.();
        
      } catch (error) {
        console.error('❌ Error toggling like:', error);
        showError('Failed to update like status');
      } finally {
        processingRef.current.delete(interactionKey);
        debounceTimeouts.current.delete(interactionKey);
      }
    }, debounceMs);

    debounceTimeouts.current.set(interactionKey, timeout);
  }, [user?.id, showError, onSuccess, debounceMs]);

  const handleSave = useCallback(async (postId: string) => {
    if (!user?.id) {
      showError('You must be logged in to save posts');
      return;
    }

    const interactionKey = `save-${postId}`;
    
    // Éviter les clics multiples
    if (processingRef.current.has(interactionKey)) {
      console.log('🚫 Save already in progress for post:', postId);
      return;
    }

    // Debouncing
    const existingTimeout = debounceTimeouts.current.get(interactionKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    const timeout = setTimeout(async () => {
      processingRef.current.add(interactionKey);
      
      try {
        const currentUserId = parseInt(user.id.toString());
        console.log('💾 Processing save for post:', postId);
        
        await favoritesService.toggleFavorite(parseInt(postId), currentUserId);
        
        // Appeler le callback de succès si fourni
        onSuccess?.();
        
      } catch (error) {
        console.error('❌ Error toggling save:', error);
        showError('Failed to update save status');
      } finally {
        processingRef.current.delete(interactionKey);
        debounceTimeouts.current.delete(interactionKey);
      }
    }, debounceMs);

    debounceTimeouts.current.set(interactionKey, timeout);
  }, [user?.id, showError, onSuccess, debounceMs]);

  return {
    handleLike,
    handleSave,
    isProcessing
  };
}; 