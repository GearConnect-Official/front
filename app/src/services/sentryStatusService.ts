import * as Sentry from '@sentry/react-native';
import { healthService, SystemHealth } from './healthService';

export interface IncidentData {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  affectedServices: string[];
  createdAt: string;
  resolvedAt?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  timestamp: string;
  status: string;
  message: string;
}

export interface StatusMetrics {
  uptime: {
    percentage: number;
    lastUpdated: string;
  };
  responseTime: {
    average: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
  errorRate: {
    percentage: number;
    trend: 'up' | 'down' | 'stable';
    lastUpdated: string;
  };
}

class SentryStatusService {
  private static instance: SentryStatusService;
  
  private constructor() {
    this.initializeStatusTracking();
  }

  static getInstance(): SentryStatusService {
    if (!SentryStatusService.instance) {
      SentryStatusService.instance = new SentryStatusService();
    }
    return SentryStatusService.instance;
  }

  // Initialiser le tracking spécifique au site de statut
  private initializeStatusTracking() {
    // Tags statiques pour identifier les événements du site de statut
    Sentry.setTag('monitoring_source', 'gearconnect_mobile');
    Sentry.setTag('app_version', '1.0.0');
    Sentry.setTag('platform', 'react_native');
    Sentry.setTag('deployment', __DEV__ ? 'development' : 'production');

    // Contexte global pour le site de statut
    Sentry.setContext('app_info', {
      name: 'GearConnect',
      type: 'Mobile Application',
      services: ['api', 'auth', 'database', 'storage', 'mobile'],
    });

    console.log('🔍 Sentry Status Service initialized for status page monitoring');
  }

  // Envoyer un incident au site de statut via Sentry
  reportIncident(incident: {
    title: string;
    severity: 'minor' | 'major' | 'critical';
    affectedServices: string[];
    description: string;
  }) {
    // Capturer l'incident avec des tags spéciaux pour le site de statut
    Sentry.withScope((scope) => {
      scope.setTag('incident_type', 'service_outage');
      scope.setTag('incident_severity', incident.severity);
      scope.setTag('affected_services', incident.affectedServices.join(','));
      scope.setLevel(incident.severity === 'critical' ? 'error' : 'warning');
      
      scope.setContext('incident_details', {
        title: incident.title,
        affectedServices: incident.affectedServices,
        timestamp: new Date().toISOString(),
        autoDetected: true,
      });

      Sentry.captureMessage(`Incident: ${incident.title}`, incident.severity === 'critical' ? 'error' : 'warning');
    });

    console.log(`🚨 Incident reported to status page: ${incident.title}`);
  }

  // Envoyer une mise à jour d'incident
  reportIncidentUpdate(incidentId: string, update: {
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    message: string;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('incident_update', 'true');
      scope.setTag('incident_id', incidentId);
      scope.setTag('update_status', update.status);
      
      scope.setContext('incident_update', {
        incidentId,
        status: update.status,
        message: update.message,
        timestamp: new Date().toISOString(),
      });

      Sentry.addBreadcrumb({
        message: `Incident ${incidentId} updated: ${update.status}`,
        level: 'info',
        category: 'incident.update',
        data: {
          incidentId,
          status: update.status,
          message: update.message,
        },
      });
    });
  }

  // Envoyer les métriques de performance
  reportPerformanceMetrics(metrics: StatusMetrics) {
    Sentry.withScope((scope) => {
      scope.setTag('metrics_type', 'performance');
      scope.setTag('uptime_percentage', metrics.uptime.percentage.toString());
      scope.setTag('response_time_trend', metrics.responseTime.trend);
      scope.setTag('error_rate_trend', metrics.errorRate.trend);

      scope.setContext('performance_metrics', {
        uptime: metrics.uptime,
        responseTime: metrics.responseTime,
        errorRate: metrics.errorRate,
        timestamp: new Date().toISOString(),
      });

      // Alertes sur les métriques dégradées
      if (metrics.uptime.percentage < 99.0) {
        Sentry.captureMessage(`Low uptime detected: ${metrics.uptime.percentage}%`, 'warning');
      }

      if (metrics.errorRate.percentage > 5.0) {
        Sentry.captureMessage(`High error rate detected: ${metrics.errorRate.percentage}%`, 'warning');
      }

      if (metrics.responseTime.average > 2000) {
        Sentry.captureMessage(`Slow response time detected: ${metrics.responseTime.average}ms`, 'warning');
      }
    });
  }

  // Envoyer le statut global du système
  reportSystemStatus(health: SystemHealth) {
    Sentry.withScope((scope) => {
      scope.setTag('system_status', health.overall.status);
      scope.setTag('api_status', health.services.api.status);
      scope.setTag('auth_status', health.services.auth.status);
      scope.setTag('database_status', health.services.database.status);
      scope.setTag('storage_status', health.services.storage.status);
      scope.setTag('mobile_status', health.services.mobile.status);

      scope.setContext('system_health', {
        overall: health.overall,
        services: health.services,
        metrics: health.metrics,
      });

      // Détection automatique d'incidents
      this.detectIncidentsFromHealth(health);
    });

    console.log(`📊 System status reported: ${health.overall.status}`);
  }

  // Détecter automatiquement les incidents basés sur la santé du système
  private detectIncidentsFromHealth(health: SystemHealth) {
    const downServices = Object.entries(health.services)
      .filter(([_, service]) => service.status === 'down')
      .map(([name, _]) => name);

    const degradedServices = Object.entries(health.services)
      .filter(([_, service]) => service.status === 'degraded')
      .map(([name, _]) => name);

    // Incident critique si plusieurs services sont down
    if (downServices.length >= 2) {
      this.reportIncident({
        title: 'Multiple services outage',
        severity: 'critical',
        affectedServices: downServices,
        description: `Multiple services are currently down: ${downServices.join(', ')}`,
      });
    }
    // Incident majeur si un service critique est down
    else if (downServices.includes('api') || downServices.includes('database')) {
      this.reportIncident({
        title: 'Core service outage',
        severity: 'major',
        affectedServices: downServices,
        description: `Critical service is down: ${downServices.join(', ')}`,
      });
    }
    // Incident mineur si des services sont dégradés
    else if (degradedServices.length > 0) {
      this.reportIncident({
        title: 'Service performance degraded',
        severity: 'minor',
        affectedServices: degradedServices,
        description: `Some services are experiencing performance issues: ${degradedServices.join(', ')}`,
      });
    }
  }

  // Envoyer des événements de déploiement
  reportDeployment(version: string, environment: string) {
    Sentry.withScope((scope) => {
      scope.setTag('event_type', 'deployment');
      scope.setTag('deployment_version', version);
      scope.setTag('deployment_environment', environment);

      scope.setContext('deployment', {
        version,
        environment,
        timestamp: new Date().toISOString(),
        platform: 'react_native',
      });

      Sentry.addBreadcrumb({
        message: `Deployment: ${version} to ${environment}`,
        level: 'info',
        category: 'deployment',
        data: { version, environment },
      });
    });

    console.log(`🚀 Deployment reported: ${version} to ${environment}`);
  }

  // Obtenir les métriques formatées pour le site de statut
  async getStatusMetrics(): Promise<StatusMetrics> {
    const health = await healthService.performHealthCheck();
    
    return {
      uptime: {
        percentage: health.metrics.uptime,
        lastUpdated: new Date().toISOString(),
      },
      responseTime: {
        average: health.metrics.averageResponseTime,
        trend: health.metrics.averageResponseTime > 1000 ? 'up' : 'stable',
        lastUpdated: new Date().toISOString(),
      },
      errorRate: {
        percentage: health.metrics.errorRate,
        trend: health.metrics.errorRate > 5 ? 'up' : 'stable',
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  // Démarrer le monitoring automatique pour le site de statut
  startStatusMonitoring() {
    // Rapport de santé toutes les minutes
    setInterval(async () => {
      try {
        const health = await healthService.performHealthCheck();
        this.reportSystemStatus(health);
        
        const metrics = await this.getStatusMetrics();
        this.reportPerformanceMetrics(metrics);
      } catch (error) {
        console.error('Error in status monitoring:', error);
      }
    }, 60 * 1000); // 1 minute

    console.log('🎯 Status monitoring started for status page');
  }
}

export const sentryStatusService = SentryStatusService.getInstance(); 