import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { healthService, SystemHealth } from './src/services/healthService';
import { sentryStatusService } from './src/services/sentryStatusService';

const StatusPage: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const loadStatus = async () => {
    try {
      const health = await healthService.performHealthCheck();
      setSystemHealth(health);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStatus();
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'down': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return 'check-circle';
      case 'degraded': return 'exclamation-triangle';
      case 'down': return 'times-circle';
      default: return 'question-circle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'All Systems Operational';
      case 'degraded': return 'Partial System Outage';
      case 'down': return 'Major System Outage';
      default: return 'Status Unknown';
    }
  };

  if (!systemHealth) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <FontAwesome name="spinner" size={40} color="#6b7280" />
          <Text style={styles.loadingText}>Loading system status...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>GearConnect Status</Text>
          <Text style={styles.subtitle}>Current system status and performance</Text>
        </View>

        {/* Overall Status */}
        <View style={styles.overallStatus}>
          <View style={styles.statusIndicator}>
            <FontAwesome
              name={getStatusIcon(systemHealth.overall.status)}
              size={30}
              color={getStatusColor(systemHealth.overall.status)}
            />
            <Text style={[styles.overallStatusText, { color: getStatusColor(systemHealth.overall.status) }]}>
              {getStatusText(systemHealth.overall.status)}
            </Text>
          </View>
          <Text style={styles.lastUpdated}>Last updated: {lastUpdated}</Text>
        </View>

        {/* Services Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {Object.entries(systemHealth.services).map(([serviceName, service]) => (
            <View key={serviceName} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <FontAwesome
                  name={getStatusIcon(service.status)}
                  size={20}
                  color={getStatusColor(service.status)}
                />
                <Text style={styles.serviceName}>
                  {serviceName.charAt(0).toUpperCase() + serviceName.slice(1)}
                </Text>
              </View>
              <View style={styles.serviceStatus}>
                <Text style={[styles.serviceStatusText, { color: getStatusColor(service.status) }]}>
                  {service.status.toUpperCase()}
                </Text>
                {service.responseTime && (
                  <Text style={styles.responseTime}>{service.responseTime}ms</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Uptime</Text>
            <Text style={styles.metricValue}>{systemHealth.metrics.uptime.toFixed(2)}%</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Average Response Time</Text>
            <Text style={styles.metricValue}>{Math.round(systemHealth.metrics.averageResponseTime)}ms</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Error Rate</Text>
            <Text style={styles.metricValue}>{systemHealth.metrics.errorRate.toFixed(2)}%</Text>
          </View>
          
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Active Users</Text>
            <Text style={styles.metricValue}>{systemHealth.metrics.activeUsers}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => sentryStatusService.reportIncident({
              title: 'Manual test incident',
              severity: 'minor',
              affectedServices: ['mobile'],
              description: 'This is a test incident created manually'
            })}
          >
            <FontAwesome name="bug" size={16} color="#ffffff" />
            <Text style={styles.actionButtonText}>Report Test Incident</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This page shows the real-time status of GearConnect services.
          </Text>
          <Text style={styles.footerText}>
            Auto-refreshes every 30 seconds.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  overallStatus: {
    margin: 24,
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overallStatusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    margin: 24,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  serviceStatus: {
    alignItems: 'flex-end',
  },
  serviceStatusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  responseTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metricLabel: {
    fontSize: 16,
    color: '#374151',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default StatusPage; 