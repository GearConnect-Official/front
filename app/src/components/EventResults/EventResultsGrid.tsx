import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getPositionColor, getPositionEmoji, Performance } from '../../types/performance.types';

interface EventResultsGridProps {
  performances: Performance[];
  loading?: boolean;
}

interface PerformanceWithUser extends Performance {
  userName?: string;
  userAvatar?: string;
}

const EventResultsGrid: React.FC<EventResultsGridProps> = ({ performances, loading = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading results...</Text>
      </View>
    );
  }

  // Sort performances by race position
  const sortedPerformances = performances ? [...performances].sort((a, b) => a.racePosition - b.racePosition) : [];

  // Get top 3 for podium (always show 3 slots, even if empty)
  const topThree: (PerformanceWithUser | null)[] = [
    sortedPerformances[0] || null,
    sortedPerformances[1] || null,
    sortedPerformances[2] || null,
  ];

  // Get rest for pagination
  const rest = sortedPerformances.slice(3);
  const totalPages = Math.ceil(rest.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageResults = rest.slice(startIndex, endIndex);

  const getPodiumHeight = (position: number) => {
    if (position === 1) return 120; // Highest
    if (position === 2) return 90;  // Middle
    return 70; // Lowest
  };

  const getPodiumColor = (position: number) => {
    if (position === 1) return '#FFD700'; // Gold
    if (position === 2) return '#C0C0C0'; // Silver
    return '#CD7F32'; // Bronze
  };

  const renderPodiumSlot = (position: number, performance: PerformanceWithUser | null) => {
    const isPlaceholder = !performance;
    const height = getPodiumHeight(position);
    const color = getPodiumColor(position);
    
    return (
      <View style={styles.podiumItem} key={position}>
        {/* Avatar above the podium */}
        <View style={styles.podiumAvatarContainer}>
          <View style={styles.podiumAvatar}>
            {isPlaceholder ? (
              <FontAwesome name="user" size={24} color="rgba(0, 0, 0, 0.3)" />
            ) : performance.userAvatar ? (
              <Image 
                source={{ uri: performance.userAvatar }} 
                style={styles.podiumAvatarImage}
              />
            ) : (
              <FontAwesome name="user" size={24} color="#666" />
            )}
          </View>
        </View>
        
        {/* Podium box with number and name */}
        <View style={[styles.podiumBase, { height, backgroundColor: color }]}>
          <Text style={styles.podiumNumber}>{position}</Text>
          <Text style={styles.podiumName} numberOfLines={1}>
            {isPlaceholder ? '—' : (performance.userName || `User ${performance.userId}`)}
          </Text>
        </View>
        
        {/* Time below the podium */}
        <Text style={styles.podiumTime}>
          {isPlaceholder ? '—:—.———' : performance.lapTime}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>

      {/* Podium Section - Always show 3 slots */}
      <View style={styles.podiumContainer}>
        {/* Second Place */}
        {renderPodiumSlot(2, topThree[1])}
        
        {/* First Place */}
        {renderPodiumSlot(1, topThree[0])}
        
        {/* Third Place */}
        {renderPodiumSlot(3, topThree[2])}
      </View>

      {/* Table Section for remaining positions (4th and beyond) - Always show */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { width: 50 }]}>Pos</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Name</Text>
          <Text style={[styles.tableHeaderText, { width: 100 }]}>Lap Time</Text>
        </View>
        
        {rest.length > 0 ? (
          <>
            <ScrollView>
              {currentPageResults.map((performance) => {
                const positionColor = getPositionColor(performance.racePosition);
                const positionEmoji = getPositionEmoji(performance.racePosition);
                const perfWithUser = performance as PerformanceWithUser;
                
                return (
                  <View key={performance.id} style={styles.tableRow}>
                    <View style={[styles.positionCell, { backgroundColor: `${positionColor}20` }]}>
                      <Text style={[styles.positionText, { color: positionColor }]}>
                        {positionEmoji} {performance.racePosition}
                      </Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 1, flexDirection: 'row', alignItems: 'center' }]}>
                      {perfWithUser.userAvatar ? (
                        <Image 
                          source={{ uri: perfWithUser.userAvatar }} 
                          style={styles.tableAvatar}
                        />
                      ) : (
                        <View style={[styles.tableAvatar, styles.tableAvatarPlaceholder]}>
                          <FontAwesome name="user" size={12} color="#999" />
                        </View>
                      )}
                      <Text style={styles.tableCellText} numberOfLines={1}>
                        {perfWithUser.userName || `User ${performance.userId}`}
                      </Text>
                    </View>
                    <Text style={[styles.tableCell, { width: 100, fontFamily: 'monospace' }]}>
                      {performance.lapTime}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                  onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <FontAwesome name="chevron-left" size={14} color={currentPage === 1 ? "#ccc" : "#E10600"} />
                </TouchableOpacity>
                
                <Text style={styles.paginationText}>
                  {startIndex + 1}-{Math.min(endIndex, rest.length)} of {rest.length}
                </Text>
                
                <TouchableOpacity
                  style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                  onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <FontAwesome name="chevron-right" size={14} color={currentPage === totalPages ? "#ccc" : "#E10600"} />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyTableMessage}>
            <FontAwesome name="table" size={32} color="#ccc" />
            <Text style={styles.emptyTableText}>
              Results for positions 4 and beyond will be displayed here
            </Text>
          </View>
        )}
      </View>

      {/* If no results at all */}
      {sortedPerformances.length === 0 && (
        <Text style={styles.emptyText}>No results available yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    paddingVertical: 20,
    paddingTop: 50, // Extra space for avatars above
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    position: 'relative',
  },
  podiumAvatarContainer: {
    position: 'absolute',
    top: -50, // Position well above the podium to not cover it
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumBase: {
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingTop: 20, // Space for avatar
    minHeight: 70,
  },
  podiumNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  podiumAvatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  podiumTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
    marginTop: 8,
    textAlign: 'center',
  },
  tableContainer: {
    marginTop: 24,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  positionCell: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 4,
  },
  positionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableCell: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 8,
  },
  tableCellText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  tableAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableAvatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paginationButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E10600',
    backgroundColor: '#fff',
  },
  paginationButtonDisabled: {
    borderColor: '#ccc',
    opacity: 0.5,
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: 20,
    fontStyle: 'italic',
  },
  infoText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyTableMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTableText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default EventResultsGrid;
