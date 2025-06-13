#!/usr/bin/env node

/**
 * Script pour vérifier le statut du système GearConnect
 * Usage: bun run status:check
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration de l'API
const API_CONFIG = {
  protocol: process.env.API_PROTOCOL || 'http',
  host: process.env.API_HOST || 'localhost',
  port: process.env.API_PORT || '5000',
};

const API_BASE_URL = `${API_CONFIG.protocol}://${API_CONFIG.host}:${API_CONFIG.port}/api`;

// Couleurs pour le terminal
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function getStatusIcon(status) {
  switch (status) {
    case 'healthy': return '✅';
    case 'degraded': return '⚠️';
    case 'down': return '❌';
    default: return '❓';
  }
}

// Test de connectivité API
async function checkApiHealth() {
  try {
    console.log(colorize('🔍 Checking API health...', 'blue'));
    
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
    });
    
    const status = response.status === 200 ? 'healthy' : 'degraded';
    const responseTime = response.headers['x-response-time'] || 'N/A';
    
    console.log(`  ${getStatusIcon(status)} API: ${colorize(status.toUpperCase(), status === 'healthy' ? 'green' : 'yellow')}`);
    console.log(`     Response time: ${responseTime}ms`);
    
    return { status, responseTime };
  } catch (error) {
    console.log(`  ${getStatusIcon('down')} API: ${colorize('DOWN', 'red')}`);
    console.log(`     Error: ${error.message}`);
    
    return { status: 'down', error: error.message };
  }
}

// Test de connectivité base de données via API
async function checkDatabaseHealth() {
  try {
    console.log(colorize('🔍 Checking database health...', 'blue'));
    
    const response = await axios.get(`${API_BASE_URL}/posts?limit=1`, {
      timeout: 5000,
    });
    
    const status = response.status === 200 ? 'healthy' : 'degraded';
    
    console.log(`  ${getStatusIcon(status)} Database: ${colorize(status.toUpperCase(), status === 'healthy' ? 'green' : 'yellow')}`);
    
    return { status };
  } catch (error) {
    console.log(`  ${getStatusIcon('down')} Database: ${colorize('DOWN', 'red')}`);
    console.log(`     Error: ${error.message}`);
    
    return { status: 'down', error: error.message };
  }
}

// Test de connectivité Cloudinary
async function checkStorageHealth() {
  try {
    console.log(colorize('🔍 Checking storage health...', 'blue'));
    
    const response = await axios.get('https://api.cloudinary.com/v1_1/demo/ping', {
      timeout: 5000,
    });
    
    const status = response.status === 200 ? 'healthy' : 'degraded';
    
    console.log(`  ${getStatusIcon(status)} Storage: ${colorize(status.toUpperCase(), status === 'healthy' ? 'green' : 'yellow')}`);
    
    return { status };
  } catch (error) {
    console.log(`  ${getStatusIcon('degraded')} Storage: ${colorize('DEGRADED', 'yellow')}`);
    console.log(`     Note: Storage is not critical for basic functionality`);
    
    return { status: 'degraded', error: error.message };
  }
}

// Calculer le statut global
function calculateOverallStatus(services) {
  const statuses = Object.values(services).map(service => service.status);
  
  if (statuses.every(status => status === 'healthy')) {
    return 'healthy';
  } else if (statuses.some(status => status === 'down')) {
    return 'down';
  } else {
    return 'degraded';
  }
}

// Générer un rapport de statut
function generateStatusReport(results) {
  const overallStatus = calculateOverallStatus(results.services);
  const timestamp = new Date().toISOString();
  
  const report = {
    timestamp,
    overall: {
      status: overallStatus,
      message: getOverallMessage(overallStatus),
    },
    services: results.services,
    metadata: {
      checkDuration: results.duration,
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    },
  };
  
  return report;
}

function getOverallMessage(status) {
  switch (status) {
    case 'healthy': return 'All systems operational';
    case 'degraded': return 'Some services experiencing issues';
    case 'down': return 'Major system outage';
    default: return 'Status unknown';
  }
}

// Sauvegarder le rapport
function saveReport(report, outputPath) {
  try {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(colorize(`\n📄 Report saved to: ${outputPath}`, 'blue'));
  } catch (error) {
    console.error(colorize(`Failed to save report: ${error.message}`, 'red'));
  }
}

// Fonction principale
async function main() {
  console.log(colorize('🚀 GearConnect Status Check', 'bold'));
  console.log(colorize('================================', 'blue'));
  
  const startTime = Date.now();
  
  try {
    // Exécuter les checks en parallèle
    const [apiResult, dbResult, storageResult] = await Promise.allSettled([
      checkApiHealth(),
      checkDatabaseHealth(),
      checkStorageHealth(),
    ]);
    
    const services = {
      api: apiResult.status === 'fulfilled' ? apiResult.value : { status: 'down', error: apiResult.reason.message },
      database: dbResult.status === 'fulfilled' ? dbResult.value : { status: 'down', error: dbResult.reason.message },
      storage: storageResult.status === 'fulfilled' ? storageResult.value : { status: 'down', error: storageResult.reason.message },
    };
    
    const duration = Date.now() - startTime;
    const overallStatus = calculateOverallStatus(services);
    
    // Afficher le résumé
    console.log(colorize('\n📊 Status Summary', 'bold'));
    console.log(colorize('==================', 'blue'));
    console.log(`Overall Status: ${getStatusIcon(overallStatus)} ${colorize(overallStatus.toUpperCase(), overallStatus === 'healthy' ? 'green' : overallStatus === 'degraded' ? 'yellow' : 'red')}`);
    console.log(`Check Duration: ${duration}ms`);
    console.log(`Timestamp: ${new Date().toLocaleString()}`);
    
    // Générer et sauvegarder le rapport
    const report = generateStatusReport({ services, duration });
    const outputPath = path.join(__dirname, '..', 'status-report.json');
    saveReport(report, outputPath);
    
    // Code de sortie basé sur le statut
    if (overallStatus === 'down') {
      process.exit(1);
    } else if (overallStatus === 'degraded') {
      process.exit(2);
    } else {
      process.exit(0);
    }
    
  } catch (error) {
    console.error(colorize(`\n❌ Status check failed: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Gestion des arguments en ligne de commande
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node check-status.js [options]

Options:
  --help, -h     Show this help message
  --quiet, -q    Suppress output (only exit codes)
  --json         Output in JSON format only

Exit codes:
  0    All systems healthy
  1    System down / critical error
  2    System degraded
    `);
    process.exit(0);
  }
  
  main().catch(error => {
    console.error(colorize(`Fatal error: ${error.message}`, 'red'));
    process.exit(1);
  });
} 