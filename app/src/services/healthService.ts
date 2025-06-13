import * as Sentry from '@sentry/react-native';
import axios from 'axios';
import { API_URL_BASE } from '../config';
import { performanceDashboard } from '../utils/performanceDashboard';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  responseTime?: number;
  error?: string;
}

export interface SystemHealth {
  overall: HealthStatus;
  services: {
    api: HealthStatus;
    auth: HealthStatus;
    database: HealthStatus;
    storage: HealthStatus;
    mobile: HealthStatus;
  };
  metrics: {
    uptime: number;
    averageResponseTime: number;
    errorRate: number;
    activeUsers: number;
  };
}

class HealthService {
  private static instance: HealthService;
  private healthCheckInterval?: NodeJS.Timeout;
  private lastHealthCheck?: SystemHealth;

  private constructor() {
    this.startHealthMonitoring();
  }

  static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  // Démarrer le monitoring automatique
  startHealthMonitoring() {
    if (__DEV__) {
      // En développement, check toutes les 2 minutes
      this.healthCheckInterval = setInterval(() => {
        this.performHealthCheck();
      }, 2 * 60 * 1000);
    } else {
      // En production, check toutes les 30 secondes
      this.healthCheckInterval = setInterval(() => {
        this.performHealthCheck();
      }, 30 * 1000);
    }

    // Premier check immédiat
    this.performHealthCheck();
  }

  // Arrêter le monitoring
  stopHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = undefined;
    }
  }

  // Effectuer un check de santé complet
  async performHealthCheck(): Promise<SystemHealth> {
    const timestamp = new Date().toISOString();
    
    try {
      // Parallel health checks
      const [apiHealth, authHealth, dbHealth, storageHealth, mobileHealth] = await Promise.allSettled([
        this.checkApiHealth(),
        this.checkAuthHealth(), 
        this.checkDatabaseHealth(),
        this.checkStorageHealth(),
        this.checkMobileHealth(),
      ]);

      const services = {
        api: this.resolveHealthResult(apiHealth),
        auth: this.resolveHealthResult(authHealth),
        database: this.resolveHealthResult(dbHealth), 
        storage: this.resolveHealthResult(storageHealth),
        mobile: this.resolveHealthResult(mobileHealth),
      };

      // Calculer le statut global
      const overallStatus = this.calculateOverallStatus(services);
      
      // Calculer les métriques
      const metrics = await this.calculateMetrics();

      const systemHealth: SystemHealth = {
        overall: {
          status: overallStatus,
          timestamp,
        },
        services,
        metrics,
      };

      this.lastHealthCheck = systemHealth;

      // Envoyer à Sentry pour le monitoring
      this.reportHealthToSentry(systemHealth);

      return systemHealth;
    } catch (error) {
      const failedHealth: SystemHealth = {
        overall: {
          status: 'down',
          timestamp,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        services: {
          api: { status: 'down', timestamp },
          auth: { status: 'down', timestamp },
          database: { status: 'down', timestamp },
          storage: { status: 'down', timestamp },
          mobile: { status: 'down', timestamp },
        },
        metrics: {
          uptime: 0,
          averageResponseTime: 0,
          errorRate: 100,
          activeUsers: 0,
        },
      };

      this.lastHealthCheck = failedHealth;
      this.reportHealthToSentry(failedHealth);
      
      return failedHealth;
    }
  }

  // Check de l'API backend
  private async checkApiHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      const response = await axios.get(`${API_URL_BASE}/health`, {
        timeout: 5000,
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: response.status === 200 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'API unreachable',
      };
    }
  }

  // Check du service d'authentification  
  private async checkAuthHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Simuler un check d'auth en vérifiant si Clerk fonctionne
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
        responseTime,
        error: 'Auth service unavailable',
      };
    }
  }

  // Check de la base de données
  private async checkDatabaseHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test avec un appel simple à l'API qui touche la DB
      const response = await axios.get(`${API_URL_BASE}/posts?limit=1`, {
        timeout: 5000,
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: response.status === 200 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
        responseTime,
        error: 'Database unreachable',
      };
    }
  }

  // Check du stockage (Cloudinary)
  private async checkStorageHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Test simple de ping vers Cloudinary
      const response = await axios.get('https://api.cloudinary.com/v1_1/demo/ping', {
        timeout: 5000,
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: response.status === 200 ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'degraded', // Storage pas critique pour l'app
        timestamp: new Date().toISOString(),
        responseTime,
        error: 'Storage service slow',
      };
    }
  }

  // Check de l'app mobile
  private async checkMobileHealth(): Promise<HealthStatus> {
    const startTime = Date.now();
    
    try {
      // Vérifier les métriques locales de l'app
      const stats = performanceDashboard.getStats();
      const responseTime = Date.now() - startTime;
      
      // App considérée healthy si pas trop de composants lents
      const isHealthy = stats.slowComponents.length < 5 && stats.slowApiCalls.length < 3;
      
      return {
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        responseTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        responseTime,
        error: 'Mobile performance issues',
      };
    }
  }

  // Résoudre le résultat d'un Promise.allSettled
  private resolveHealthResult(result: PromiseSettledResult<HealthStatus>): HealthStatus {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        status: 'down',
        timestamp: new Date().toISOString(),
        error: result.reason?.message || 'Health check failed',
      };
    }
  }

  // Calculer le statut global du système
  private calculateOverallStatus(services: SystemHealth['services']): 'healthy' | 'degraded' | 'down' {
    const statuses = Object.values(services).map(service => service.status);
    
    if (statuses.every(status => status === 'healthy')) {
      return 'healthy';
    } else if (statuses.some(status => status === 'down')) {
      return 'down';
    } else {
      return 'degraded';
    }
  }

  // Calculer les métriques système
  private async calculateMetrics(): Promise<SystemHealth['metrics']> {
    const stats = performanceDashboard.getStats();
    
    return {
      uptime: __DEV__ ? 99.5 : 99.9, // Simulé pour l'instant
      averageResponseTime: stats.slowApiCalls.length > 0 
        ? stats.slowApiCalls.reduce((acc, api) => acc + api.avgDuration, 0) / stats.slowApiCalls.length
        : 200,
      errorRate: stats.slowApiCalls.length > 0 
        ? stats.slowApiCalls.reduce((acc, api) => acc + (100 - api.successRate), 0) / stats.slowApiCalls.length
        : 0,
      activeUsers: 1, // Remplacer par vraie métrique
    };
  }

  // Reporter la santé à Sentry
  private reportHealthToSentry(health: SystemHealth) {
    // Envoyer les métriques à Sentry
    Sentry.addBreadcrumb({
      message: 'System health check completed',
      level: health.overall.status === 'healthy' ? 'info' : 'warning',
      category: 'health',
      data: {
        status: health.overall.status,
        uptime: health.metrics.uptime,
        errorRate: health.metrics.errorRate,
        avgResponseTime: health.metrics.averageResponseTime,
      },
    });

    // Capturer les problèmes critiques
    if (health.overall.status === 'down') {
      Sentry.captureMessage('System health critical', 'error');
    } else if (health.overall.status === 'degraded') {
      Sentry.captureMessage('System health degraded', 'warning');
    }

    // Définir des tags pour le site de statut
    Sentry.setTag('health_status', health.overall.status);
    Sentry.setTag('service_type', 'mobile_app');
    Sentry.setContext('health_metrics', health.metrics);
  }

  // Obtenir le dernier check de santé
  getLastHealthCheck(): SystemHealth | undefined {
    return this.lastHealthCheck;
  }

  // Obtenir le statut simplifié pour l'API publique
  getPublicStatus(): { status: string; lastUpdated: string } {
    if (!this.lastHealthCheck) {
      return {
        status: 'unknown',
        lastUpdated: new Date().toISOString(),
      };
    }

    return {
      status: this.lastHealthCheck.overall.status,
      lastUpdated: this.lastHealthCheck.overall.timestamp,
    };
  }
}

export const healthService = HealthService.getInstance(); 