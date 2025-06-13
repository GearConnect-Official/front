import { healthService, SystemHealth } from './healthService';
import { sentryStatusService, StatusMetrics } from './sentryStatusService';

export interface PublicStatusResponse {
  status: 'healthy' | 'degraded' | 'down';
  lastUpdated: string;
  services: {
    [key: string]: {
      status: 'healthy' | 'degraded' | 'down';
      responseTime?: number;
    };
  };
  metrics: {
    uptime: number;
    averageResponseTime: number;
    errorRate: number;
  };
  incidents: PublicIncident[];
}

export interface PublicIncident {
  id: string;
  title: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  severity: 'minor' | 'major' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  lastUpdate: {
    timestamp: string;
    message: string;
  };
}

class StatusApiService {
  private static instance: StatusApiService;
  private statusHistory: SystemHealth[] = [];
  private maxHistorySize = 100;

  private constructor() {}

  static getInstance(): StatusApiService {
    if (!StatusApiService.instance) {
      StatusApiService.instance = new StatusApiService();
    }
    return StatusApiService.instance;
  }

  // Enregistrer l'historique des status
  recordStatusHistory(health: SystemHealth) {
    this.statusHistory.push(health);
    
    // Garder seulement les derniers 100 records
    if (this.statusHistory.length > this.maxHistorySize) {
      this.statusHistory = this.statusHistory.slice(-this.maxHistorySize);
    }
  }

  // Obtenir le statut public formaté
  async getPublicStatus(): Promise<PublicStatusResponse> {
    try {
      const health = await healthService.performHealthCheck();
      const metrics = await sentryStatusService.getStatusMetrics();
      
      // Enregistrer dans l'historique
      this.recordStatusHistory(health);

      // Simuler des incidents pour la démo
      const incidents = this.getMockIncidents();

      return {
        status: health.overall.status,
        lastUpdated: health.overall.timestamp,
        services: this.formatServicesForPublic(health.services),
        metrics: {
          uptime: health.metrics.uptime,
          averageResponseTime: health.metrics.averageResponseTime,
          errorRate: health.metrics.errorRate,
        },
        incidents,
      };
    } catch (error) {
      console.error('Error getting public status:', error);
      
      return {
        status: 'down',
        lastUpdated: new Date().toISOString(),
        services: {
          api: { status: 'down' },
          auth: { status: 'down' },
          database: { status: 'down' },
          storage: { status: 'down' },
          mobile: { status: 'down' },
        },
        metrics: {
          uptime: 0,
          averageResponseTime: 0,
          errorRate: 100,
        },
        incidents: [],
      };
    }
  }

  // Formater les services pour l'API publique
  private formatServicesForPublic(services: SystemHealth['services']) {
    const formatted: { [key: string]: { status: any; responseTime?: number } } = {};
    
    Object.entries(services).forEach(([name, service]) => {
      formatted[name] = {
        status: service.status,
        responseTime: service.responseTime,
      };
    });
    
    return formatted;
  }

  // Obtenir des incidents simulés (à remplacer par de vrais incidents)
  private getMockIncidents(): PublicIncident[] {
    // En développement, on peut simuler quelques incidents pour tester
    if (__DEV__) {
      return [
        {
          id: 'incident-001',
          title: 'API Response Time Increased',
          status: 'monitoring',
          severity: 'minor',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
          lastUpdate: {
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Il y a 30min
            message: 'Response times have improved. Continuing to monitor.',
          },
        },
        {
          id: 'incident-002',
          title: 'Scheduled Maintenance',
          status: 'resolved',
          severity: 'minor',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 24h
          resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // Il y a 23h
          lastUpdate: {
            timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            message: 'Maintenance completed successfully. All systems operational.',
          },
        },
      ];
    }
    
    return [];
  }

  // Obtenir l'historique de uptime (pour les graphiques)
  getUptimeHistory(days: number = 30): Array<{ date: string; uptime: number }> {
    const now = new Date();
    const history: Array<{ date: string; uptime: number }> = [];
    
    // Simuler l'historique pour la démo
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const uptime = Math.random() > 0.1 ? 99.5 + (Math.random() * 0.5) : 95.0 + (Math.random() * 4);
      
      history.push({
        date: date.toISOString().split('T')[0],
        uptime: Math.round(uptime * 100) / 100,
      });
    }
    
    return history;
  }

  // Obtenir les métriques de réponse (pour les graphiques)
  getResponseTimeHistory(hours: number = 24): Array<{ timestamp: string; responseTime: number }> {
    const now = new Date();
    const history: Array<{ timestamp: string; responseTime: number }> = [];
    
    // Simuler l'historique pour la démo
    for (let i = hours - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      const baseResponseTime = 200;
      const variation = (Math.random() - 0.5) * 100;
      const responseTime = Math.max(50, baseResponseTime + variation);
      
      history.push({
        timestamp: timestamp.toISOString(),
        responseTime: Math.round(responseTime),
      });
    }
    
    return history;
  }

  // Endpoint pour webhook/API externe
  async handleStatusWebhook(request: any): Promise<PublicStatusResponse> {
    // Cette méthode pourrait être appelée par un webhook externe
    // pour récupérer le statut actuel
    
    const status = await this.getPublicStatus();
    
    // Log pour debugging
    console.log('🌐 Status webhook called:', {
      status: status.status,
      timestamp: status.lastUpdated,
    });
    
    return status;
  }

  // Générer une version JSON pour export/API
  async generateStatusJson(): Promise<string> {
    const status = await this.getPublicStatus();
    return JSON.stringify(status, null, 2);
  }

  // Obtenir les statistiques sommaires
  async getSummaryStats(): Promise<{
    overallStatus: string;
    servicesUp: number;
    servicesTotal: number;
    currentUptime: number;
    lastIncident: string | null;
  }> {
    const status = await this.getPublicStatus();
    const servicesArray = Object.values(status.services);
    const servicesUp = servicesArray.filter(s => s.status === 'healthy').length;
    
    return {
      overallStatus: status.status,
      servicesUp,
      servicesTotal: servicesArray.length,
      currentUptime: status.metrics.uptime,
      lastIncident: status.incidents.length > 0 
        ? status.incidents[0].createdAt 
        : null,
    };
  }
}

export const statusApiService = StatusApiService.getInstance(); 