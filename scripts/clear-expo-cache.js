/**
 * Script pour nettoyer le cache d'Expo et redémarrer l'application
 */
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Nettoyage du cache Expo...');

// Suppression du dossier .expo-shared s'il existe
const sharedPath = path.join(__dirname, '..', '.expo-shared');
if (fs.existsSync(sharedPath)) {
  console.log('Suppression du dossier .expo-shared');
  fs.rmSync(sharedPath, { recursive: true, force: true });
}

// Vider le cache Expo
try {
  console.log('Vidage du cache Expo...');
  execSync('npx expo start --clear', { stdio: 'inherit' });
} catch (error) {
  console.log('Le cache a été nettoyé, mais nous avons terminé prématurément le processus Expo.');
}

// Démarrer l'application avec expo-router
console.log('Redémarrage de l\'application avec Expo Router...');
const startExpo = spawn('node', ['./scripts/start-expo-router.js'], {
  stdio: 'inherit',
  shell: true
});

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