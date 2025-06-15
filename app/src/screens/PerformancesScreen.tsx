import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../context/AuthContext';
import PerformanceService from '../services/performanceService';
import {
  Performance,
  UserPerformanceStats,
  RACE_CATEGORIES,
  RaceCategory,
  getPositionColor,
  getPositionEmoji,
  getPositionLabel,
} from '../types/performance.types';
import {
  performanceStyles,
  THEME_COLORS,
  LAYOUT,
} from '../styles/screens/user/performanceStyles';

const PerformancesScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  // State management
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [stats, setStats] = useState<UserPerformanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory | 'all'>('all');
  const [fadeAnim] = useState(new Animated.Value(0));

  /**
   * Load performances and statistics
   */
  const loadData = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const [performancesResponse, statsResponse] = await Promise.all([
        PerformanceService.getUserPerformances(
          user.id,
          selectedCategory !== 'all' ? { category: selectedCategory } : {}
        ),
        PerformanceService.getUserStats(user.id),
      ]);

      if (performancesResponse.success && performancesResponse.data) {
        setPerformances(performancesResponse.data);
      } else {
        showError('Failed to load your race data');
      }

      if (statsResponse.success && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        showError('Failed to load your statistics');
      }
    } catch {
      showError('Unable to load your racing data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedCategory]);

  /**
   * Load performances only (for filter changes)
   */
  const loadPerformances = React.useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await PerformanceService.getUserPerformances(
        user.id,
        selectedCategory !== 'all' ? { category: selectedCategory } : {}
      );

      if (response.success && response.data) {
        setPerformances(response.data);
      }
    } catch {
      // Silently fail for filter changes
    }
  }, [user?.id, selectedCategory]);

  // Load data on component mount and when returning to screen
  useEffect(() => {
    if (user?.id) {
      loadData();
      // Animate screen entrance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [user?.id, loadData, fadeAnim]);

  // Load data when category filter changes
  useEffect(() => {
    if (user?.id && !isLoading) {
      loadPerformances();
    }
  }, [selectedCategory, user?.id, isLoading, loadPerformances]);

  /**
   * Refresh data
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category: RaceCategory | 'all') => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
  };

  /**
   * Navigate to add performance screen
   */
  const handleAddPerformance = () => {
    router.push('/addPerformance');
  };

  /**
   * Show error alert
   */
  const showError = (message: string) => {
    Alert.alert('Error', message);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Render hero section with stats
   */
  const renderHero = () => {
    if (!stats) return null;

    return (
      <Animated.View style={[performanceStyles.heroSection, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={[THEME_COLORS.RACING_GRADIENT_START, THEME_COLORS.RACING_GRADIENT_END]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={performanceStyles.heroGradient}
        >
          <Text style={performanceStyles.heroTitle}>Racing Dashboard</Text>
          <Text style={performanceStyles.heroSubtitle}>
            Track your progress and celebrate your achievements on the track
          </Text>
          
          <View style={performanceStyles.heroStats}>
            <View style={performanceStyles.heroStatItem}>
              <Text style={performanceStyles.heroStatValue}>{stats.totalRaces}</Text>
              <Text style={performanceStyles.heroStatLabel}>Total Races</Text>
            </View>
            <View style={performanceStyles.heroStatItem}>
              <Text style={performanceStyles.heroStatValue}>
                {stats.bestPosition > 0 ? `${stats.bestPosition}${getOrdinalSuffix(stats.bestPosition)}` : '-'}
              </Text>
              <Text style={performanceStyles.heroStatLabel}>Best Finish</Text>
            </View>
            <View style={performanceStyles.heroStatItem}>
              <Text style={performanceStyles.heroStatValue}>
                {stats.averagePosition > 0 ? stats.averagePosition.toFixed(1) : '-'}
              </Text>
              <Text style={performanceStyles.heroStatLabel}>Avg Position</Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  /**
   * Render stats cards
   */
  const renderStatsCards = () => {
    if (!stats || stats.totalRaces === 0) return null;

    const podiumRate = stats.totalRaces > 0 ? ((stats.podiumFinishes || 0) / stats.totalRaces * 100).toFixed(0) : '0';
    const winRate = stats.totalRaces > 0 ? ((stats.wins || 0) / stats.totalRaces * 100).toFixed(0) : '0';

    return (
      <View style={performanceStyles.statsContainer}>
        <View style={performanceStyles.statsGrid}>
          <View style={performanceStyles.statsCard}>
            <FontAwesome 
              name="trophy" 
              size={20} 
              color={THEME_COLORS.VICTORY_GOLD} 
              style={performanceStyles.statsIcon}
            />
            <Text style={performanceStyles.statsValue}>{stats.wins || 0}</Text>
            <Text style={performanceStyles.statsLabel}>Victories</Text>
          </View>
          
          <View style={performanceStyles.statsCard}>
            <FontAwesome 
              name="certificate" 
              size={20} 
              color={THEME_COLORS.PODIUM_BRONZE} 
              style={performanceStyles.statsIcon}
            />
            <Text style={performanceStyles.statsValue}>{stats.podiumFinishes || 0}</Text>
            <Text style={performanceStyles.statsLabel}>Podiums</Text>
          </View>
        </View>
        
        <View style={performanceStyles.statsGrid}>
          <View style={performanceStyles.statsCard}>
            <FontAwesome 
              name="percent" 
              size={20} 
              color={THEME_COLORS.SUCCESS} 
              style={performanceStyles.statsIcon}
            />
            <Text style={performanceStyles.statsValue}>{winRate}%</Text>
            <Text style={performanceStyles.statsLabel}>Win Rate</Text>
          </View>
          
          <View style={performanceStyles.statsCard}>
            <FontAwesome 
              name="line-chart" 
              size={20} 
              color={THEME_COLORS.INFO} 
              style={performanceStyles.statsIcon}
            />
            <Text style={performanceStyles.statsValue}>{podiumRate}%</Text>
            <Text style={performanceStyles.statsLabel}>Podium Rate</Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Render category filters
   */
  const renderFilters = () => {
    const categories: (RaceCategory | 'all')[] = ['all', ...RACE_CATEGORIES.map(cat => cat.value)];

    return (
      <View style={performanceStyles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={performanceStyles.filtersList}
        >
          {categories.map((category) => {
            const categoryData = category === 'all' 
              ? { label: 'All Races', emoji: '🏁', color: THEME_COLORS.PRIMARY }
              : RACE_CATEGORIES.find(cat => cat.value === category);
            
            if (!categoryData) return null;

            const isActive = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  performanceStyles.filterChip,
                  isActive && performanceStyles.filterChipActive,
                  isActive && { backgroundColor: categoryData.color },
                ]}
                onPress={() => handleCategoryChange(category)}
              >
                <Text style={performanceStyles.filterChipText}>
                  {categoryData.emoji} {categoryData.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  /**
   * Render individual performance card
   */
  const renderPerformanceCard = (performance: Performance, index: number) => {
    const positionColor = getPositionColor(performance.racePosition);
    const positionEmoji = getPositionEmoji(performance.racePosition);
    const positionLabel = getPositionLabel(performance.racePosition, performance.totalParticipants);
    
    const categoryData = RACE_CATEGORIES.find(cat => cat.value === performance.category);

    return (
      <Animated.View
        key={performance.id}
        style={[
          performanceStyles.performanceCard,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            }],
          },
        ]}
      >
        <View style={performanceStyles.performanceHeader}>
          <View style={{ flex: 1 }}>
            <Text style={performanceStyles.performanceTitle}>
              {performance.circuitName}
            </Text>
            <Text style={performanceStyles.performanceDate}>
              {formatDate(performance.date)}
            </Text>
          </View>
        </View>

        <View style={performanceStyles.performanceDetails}>
          <View style={performanceStyles.performanceRow}>
            <View style={performanceStyles.performanceMetric}>
              <View style={performanceStyles.metricIcon}>
                <Text style={{ fontSize: 20 }}>{positionEmoji}</Text>
              </View>
              <Text style={performanceStyles.metricLabel}>Position</Text>
              <Text style={[
                performanceStyles.positionValue,
                { color: positionColor }
              ]}>
                {positionLabel}
              </Text>
            </View>
          </View>

          <View style={performanceStyles.performanceRow}>
            <View style={performanceStyles.performanceMetric}>
              <View style={performanceStyles.metricIcon}>
                <FontAwesome name="clock-o" size={16} color={THEME_COLORS.PRIMARY} />
              </View>
              <Text style={performanceStyles.metricLabel}>Lap Time</Text>
              <Text style={performanceStyles.lapTimeValue}>
                {performance.lapTime}
              </Text>
            </View>
          </View>

          <View style={performanceStyles.performanceRow}>
            <View style={performanceStyles.performanceMetric}>
              <View style={performanceStyles.metricIcon}>
                <Text style={{ fontSize: 16 }}>{categoryData?.emoji || '🏁'}</Text>
              </View>
              <Text style={performanceStyles.metricLabel}>Category</Text>
              <Text style={performanceStyles.metricValue}>
                {categoryData?.label || performance.category}
              </Text>
            </View>
          </View>

          {performance.notes && (
            <View style={performanceStyles.notesContainer}>
              <Text style={performanceStyles.notesText}>
                💭 {performance.notes}
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => {
    return (
      <View style={performanceStyles.emptyContainer}>
        <FontAwesome 
          name="trophy" 
          size={80} 
          color={THEME_COLORS.TEXT_MUTED}
          style={performanceStyles.emptyIcon}
        />
        <Text style={performanceStyles.emptyTitle}>No Race Data Yet</Text>
        <Text style={performanceStyles.emptySubtitle}>
          Start tracking your racing performance and see your progress over time. 
          Every lap counts on your journey to the podium!
        </Text>
        <TouchableOpacity
          style={performanceStyles.primaryButton}
          onPress={handleAddPerformance}
        >
          <FontAwesome name="plus" size={16} color="#FFFFFF" />
          <Text style={performanceStyles.primaryButtonText}>Add First Race</Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Helper function for ordinal suffixes
   */
  const getOrdinalSuffix = (num: number): string => {
    const suffix = num === 1 ? 'st' : num === 2 ? 'nd' : num === 3 ? 'rd' : 'th';
    return suffix;
  };

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={performanceStyles.safeArea}>
        <View style={performanceStyles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLORS.PRIMARY} />
          <Text style={performanceStyles.loadingText}>Loading your racing data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={performanceStyles.container}>
      {/* Header */}
      <View style={performanceStyles.header}>
        <TouchableOpacity 
          style={performanceStyles.headerButton} 
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={THEME_COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        
        <Text style={performanceStyles.headerTitle}>Performance Tracker</Text>
        
        <TouchableOpacity
          style={performanceStyles.headerButton}
          onPress={handleAddPerformance}
        >
          <FontAwesome name="plus" size={20} color={THEME_COLORS.PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={performanceStyles.scrollContainer}
        contentContainerStyle={performanceStyles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
            colors={[THEME_COLORS.PRIMARY]}
            tintColor={THEME_COLORS.PRIMARY}
          />
        }
      >
        {/* Hero Section */}
        {renderHero()}

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Category Filters */}
        {renderFilters()}

        {/* Performance List */}
        <View style={{ paddingHorizontal: 0 }}>
          {performances.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <View style={{ paddingHorizontal: LAYOUT.SPACING_MD, marginBottom: LAYOUT.SPACING_MD }}>
                <Text style={performanceStyles.headerTitle}>
                  {selectedCategory === 'all' 
                    ? `All Races (${performances.length})`
                    : `${RACE_CATEGORIES.find(cat => cat.value === selectedCategory)?.label || selectedCategory} (${performances.length})`
                  }
                </Text>
              </View>
              {performances.map((performance, index) => 
                renderPerformanceCard(performance, index)
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PerformancesScreen; 