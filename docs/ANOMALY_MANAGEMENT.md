# Gestion des Anomalies - Frontend

Ce document décrit les mécanismes de gestion des anomalies, des erreurs et des dysfonctionnements dans l'application frontend de GearConnect.

## Architecture de Gestion des Erreurs

Notre système de gestion des anomalies repose sur plusieurs niveaux :

1. **Interception des erreurs API** : Normalisation et gestion centralisée des erreurs de l'API
2. **Gestion de la connectivité** : Surveillance et réponse aux problèmes réseau
3. **Feedback utilisateur** : Affichage de messages d'erreur adaptés et informatifs
4. **Erreurs non gérées** : Capture des exceptions JavaScript non interceptées ailleurs

## Composants Principaux

### 1. Intercepteur Axios (`axiosConfig.ts`)

Intercepte et normalise toutes les erreurs API :

```typescript
// Configuration dans src/services/axiosConfig.ts
axios.interceptors.response.use(
  response => response,
  error => {
    // Conversion en format ApiError standardisé
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);
```

L'intercepteur transforme toutes les erreurs en format `ApiError` standardisé avec :
- Type d'erreur (`ErrorType`)
- Code HTTP
- Message d'erreur
- Données détaillées (le cas échéant)

### 2. Hook de Feedback (`useFeedback.tsx`)

Utilisé pour afficher les messages de feedback à l'utilisateur :

```typescript
// Exemple d'utilisation
const { showError, showSuccess, showApiError } = useFeedback();

// Afficher une erreur API
try {
  await userService.updateProfile(data);
  showSuccess('Profil mis à jour avec succès');
} catch (error) {
  showApiError(error, 'Impossible de mettre à jour le profil');
}
```

### 3. Gestionnaire de Connectivité (`useNetworkStatus.tsx`)

Surveille l'état de la connexion réseau et la disponibilité du serveur :

```typescript
// Exemple d'utilisation
const { isOnline, canMakeRequests, checkConnection } = useNetworkStatus();

// Vérifier si nous sommes en ligne avant de faire une requête
const handleSubmit = async () => {
  if (!isOnline) {
    showError('Vous êtes hors ligne. Impossible d\'envoyer le formulaire.');
    return;
  }
  
  // Continuer avec la requête...
};
```

### 4. Composant de Barrière d'Erreurs (`ErrorBoundary.tsx`)

Capture les erreurs JavaScript non gérées et affiche une interface de secours :

```typescript
// Utilisation dans App.tsx
<ErrorBoundary>
  <MainApp />
</ErrorBoundary>
```

## Types d'Erreurs

| Type            | Description                                          | Gestion                                        |
|-----------------|------------------------------------------------------|------------------------------------------------|
| `VALIDATION`    | Données invalides envoyées à l'API                   | Affichage des messages d'erreur par champ      |
| `UNAUTHORIZED`  | Problèmes d'authentification ou d'autorisation       | Redirection vers la page de connexion          |
| `NOT_FOUND`     | Ressource demandée introuvable                       | Affichage d'un message ou page 404             |
| `SERVER`        | Erreur interne du serveur                            | Message d'erreur générique + retry             |
| `NETWORK`       | Problèmes de connexion ou timeout                    | Affichage du mode hors ligne + retry           |
| `UNKNOWN`       | Erreurs non classifiées                              | Message d'erreur générique                     |

## Gestion des Erreurs Réseau

L'application détecte automatiquement les problèmes de connectivité et prend les mesures suivantes :

1. Affichage d'un indicateur de statut "hors ligne"
2. Mise en cache des requêtes qui échouent pour réessayer plus tard
3. Basculement vers un mode hors ligne avec fonctionnalités limitées
4. Synchronisation automatique lorsque la connexion est rétablie

## Bonnes Pratiques

1. **Toujours utiliser `showApiError` pour les erreurs API** plutôt que de gérer manuellement les erreurs.

2. **Vérifier l'état de la connexion** avant d'effectuer des opérations qui nécessitent le réseau.

3. **Envelopper les composants sensibles** dans des `ErrorBoundary` pour éviter que les erreurs ne fassent planter toute l'application.

4. **Fournir des messages d'erreur clairs et orientés solution** qui indiquent à l'utilisateur comment résoudre le problème.

5. **Implémenter des stratégies de retry** pour les opérations critiques en cas d'échec.

## Tests de la Gestion d'Erreurs

Des tests automatisés vérifient que les erreurs sont correctement gérées :

```bash
# Exécuter le script de test de gestion des erreurs
npm run test:error-handling
```

Ce script exécute une série de tests spécifiques pour vérifier la robustesse de l'application face aux anomalies.

## Débogage des Problèmes

Pour déboguer les problèmes liés aux erreurs :

1. Vérifiez les logs de la console pour les détails des erreurs (en développement)
2. Utilisez les outils de développement du navigateur ou de React Native
3. Vérifiez les réponses HTTP brutes dans l'onglet Réseau 