import { useCallback, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface UseInfiniteScrollConfig {
  threshold?: number; // Distance du bas pour déclencher le chargement (défaut: 0.1)
  debounceMs?: number; // Délai de debouncing en millisecondes (défaut: 300)
  enabled?: boolean; // Activer/désactiver l'infinite scroll
}

interface UseInfiniteScrollReturn {
  onEndReached: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onEndReachedThreshold: number;
}

export const useInfiniteScroll = (
  loadMore: () => Promise<void> | void,
  hasMore: boolean,
  isLoading: boolean,
  config: UseInfiniteScrollConfig = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 0.1,
    debounceMs = 300,
    enabled = true
  } = config;

  // Refs pour le debouncing et la prévention des appels multiples
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number>(0);
  const isExecuting = useRef<boolean>(false);

  const onEndReached = useCallback(() => {
    // Vérifications de base
    if (!enabled || !hasMore || isLoading || isExecuting.current) {
      console.log('🚫 InfiniteScroll: Skipping load more', {
        enabled,
        hasMore,
        isLoading,
        isExecuting: isExecuting.current
      });
      return;
    }

    const now = Date.now();
    
    // Éviter les appels trop rapprochés (throttling)
    if (now - lastCallTime.current < debounceMs) {
      console.log('🚫 InfiniteScroll: Too soon since last call');
      return;
    }

    // Debouncing
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!hasMore || isLoading || isExecuting.current) return;

      console.log('📊 InfiniteScroll: Loading more posts...');
      
      isExecuting.current = true;
      lastCallTime.current = Date.now();

      try {
        await loadMore();
      } catch (error) {
        console.error('❌ InfiniteScroll: Error loading more:', error);
      } finally {
        isExecuting.current = false;
      }
    }, debounceMs);
  }, [enabled, hasMore, isLoading, loadMore, debounceMs]);

  // Optionnel: handler de scroll pour des optimisations avancées
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Ici on pourrait ajouter de la logique additionnelle comme:
    // - Tracking de la vitesse de scroll
    // - Préchargement intelligent
    // - Analytics de comportement utilisateur
    
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollPercentage = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    
    // Log pour debug (à enlever en production)
    if (scrollPercentage > 0.8) { // 80% scrollé
      console.log('📊 InfiniteScroll: User scrolled 80%+, preparing for load more...');
    }
  }, []);

  return {
    onEndReached,
    onScroll,
    onEndReachedThreshold: threshold
  };
};

// Hook complémentaire pour la gestion des états de scroll
export const useScrollState = () => {
  const scrollPositionRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateScrollPosition = useCallback((position: number) => {
    scrollPositionRef.current = position;
    isScrollingRef.current = true;

    // Arrêter le flag de scroll après 150ms d'inactivité
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  const getScrollPosition = useCallback(() => scrollPositionRef.current, []);
  const isScrolling = useCallback(() => isScrollingRef.current, []);

  return {
    updateScrollPosition,
    getScrollPosition,
    isScrolling
  };
}; 