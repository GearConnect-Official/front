/**
 * Script pour démarrer l'application avec Expo Router
 */
const { spawn } = require('child_process');
const path = require('path');

// Commande pour démarrer Expo avec la nouvelle configuration
const startExpo = spawn('npx', ['expo', 'start'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    EXPO_ROUTER_IMPORT_MODE: 'sync',
    EXPO_ROUTER_APP_ROOT: './app'
  }
});

console.log('Démarrage de l\'application avec Expo Router...');

// Gestion des erreurs
startExpo.on('error', (error) => {
  console.error('Erreur lors du démarrage:', error);
  process.exit(1);
});

// Gestion de la fin du processus
startExpo.on('close', (code) => {
  if (code !== 0) {
    console.error(`Le processus s'est terminé avec le code: ${code}`);
    process.exit(code);
  }
}); 