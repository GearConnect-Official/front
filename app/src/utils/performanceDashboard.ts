interface PerformanceStats {
  slowComponents: Array<{
    name: string;
    avgDuration: number;
    callCount: number;
  }>;
  slowApiCalls: Array<{
    name: string;
    avgDuration: number;
    callCount: number;
    successRate: number;
  }>;
  memoryUsage: {
    current: number;
    peak: number;
  };
  errorCount: number;
  totalOperations: number;
}

class PerformanceDashboard {
  private static instance: PerformanceDashboard;
  private stats: PerformanceStats = {
    slowComponents: [],
    slowApiCalls: [],
    memoryUsage: { current: 0, peak: 0 },
    errorCount: 0,
    totalOperations: 0,
  };

  private constructor() {}

  static getInstance(): PerformanceDashboard {
    if (!PerformanceDashboard.instance) {
      PerformanceDashboard.instance = new PerformanceDashboard();
    }
    return PerformanceDashboard.instance;
  }

  // Obtenir les statistiques actuelles
  getStats(): PerformanceStats {
    return { ...this.stats };
  }

  // Enregistrer une opération lente de composant
  recordSlowComponent(name: string, duration: number) {
    const existingComponent = this.stats.slowComponents.find(c => c.name === name);
    
    if (existingComponent) {
      existingComponent.avgDuration = (existingComponent.avgDuration + duration) / 2;
      existingComponent.callCount++;
    } else {
      this.stats.slowComponents.push({
        name,
        avgDuration: duration,
        callCount: 1,
      });
    }

    // Garder seulement les 10 plus lents
    this.stats.slowComponents = this.stats.slowComponents
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);
  }

  // Enregistrer un appel API lent
  recordSlowApiCall(name: string, duration: number, success: boolean = true) {
    const existingApi = this.stats.slowApiCalls.find(a => a.name === name);
    
    if (existingApi) {
      existingApi.avgDuration = (existingApi.avgDuration + duration) / 2;
      existingApi.callCount++;
      if (success) {
        existingApi.successRate = ((existingApi.successRate * (existingApi.callCount - 1)) + 100) / existingApi.callCount;
      } else {
        existingApi.successRate = (existingApi.successRate * (existingApi.callCount - 1)) / existingApi.callCount;
      }
    } else {
      this.stats.slowApiCalls.push({
        name,
        avgDuration: duration,
        callCount: 1,
        successRate: success ? 100 : 0,
      });
    }

    // Garder seulement les 10 plus lents
    this.stats.slowApiCalls = this.stats.slowApiCalls
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, 10);
  }

  // Enregistrer l'utilisation mémoire
  recordMemoryUsage(current: number) {
    this.stats.memoryUsage.current = current;
    if (current > this.stats.memoryUsage.peak) {
      this.stats.memoryUsage.peak = current;
    }
  }

  // Enregistrer une erreur
  recordError() {
    this.stats.errorCount++;
  }

  // Enregistrer une opération totale
  recordOperation() {
    this.stats.totalOperations++;
  }

  // Réinitialiser les statistiques
  reset() {
    this.stats = {
      slowComponents: [],
      slowApiCalls: [],
      memoryUsage: { current: 0, peak: 0 },
      errorCount: 0,
      totalOperations: 0,
    };
  }

  // Obtenir un résumé des performances
  getSummary(): {
    averageComponentTime: number;
    averageApiTime: number;
    errorRate: number;
    memoryUsagePercent: number;
  } {
    const avgComponentTime = this.stats.slowComponents.length > 0 
      ? this.stats.slowComponents.reduce((sum, c) => sum + c.avgDuration, 0) / this.stats.slowComponents.length
      : 0;

    const avgApiTime = this.stats.slowApiCalls.length > 0
      ? this.stats.slowApiCalls.reduce((sum, a) => sum + a.avgDuration, 0) / this.stats.slowApiCalls.length
      : 0;

    const errorRate = this.stats.totalOperations > 0
      ? (this.stats.errorCount / this.stats.totalOperations) * 100
      : 0;

    // Simuler l'utilisation mémoire en pourcentage (à remplacer par une vraie mesure)
    const memoryUsagePercent = Math.min((this.stats.memoryUsage.current / (1024 * 1024 * 100)) * 100, 100);

    return {
      averageComponentTime: Math.round(avgComponentTime),
      averageApiTime: Math.round(avgApiTime),
      errorRate: Math.round(errorRate * 100) / 100,
      memoryUsagePercent: Math.round(memoryUsagePercent * 100) / 100,
    };
  }
}

export const performanceDashboard = PerformanceDashboard.getInstance(); 