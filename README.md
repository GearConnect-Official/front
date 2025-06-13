# GearConnect Mobile App

Application mobile React Native pour le projet GearConnect, permettant de connecter des équipements et gérer leur utilisation.

## Sites Web GearConnect

En plus de cette application mobile, GearConnect dispose de plusieurs sites web :

- **Site vitrine et waitliste** : [https://gearconnect-status.vercel.app/](https://gearconnect-status.vercel.app/)  
  Rejoignez notre liste d'attente pour être parmi les premiers à découvrir GearConnect.

- **Statut des services** : [https://gearconnect-status.vercel.app/](https://gearconnect-status.vercel.app/)  
  Consultez le statut en temps réel de nos services et applications.

## Configuration de l'environnement

1. Clonez le repository :
```bash
git clone https://github.com/GearConnect-Official/front.git
cd front
```

2. Créez votre fichier `.env` en copiant le fichier exemple :
```bash
cp .env.example .env
```

3. Trouvez votre adresse IPv4 :
   - Windows : `ipconfig` dans le terminal
   - Mac/Linux : `ifconfig` ou `ip addr` dans le terminal

4. Modifiez le fichier `.env` avec votre IPv4 :
```env
API_HOST=votre_ipv4  # exemple: 192.168.1.100
```

5. Installez les dépendances :
```bash
npm install
```

6. Démarrez l'application :
```bash
npm start
```

## Scripts disponibles

- `npm start` : Démarre le serveur de développement Expo
- `npm android` : Lance l'application sur un émulateur ou appareil Android
- `npm ios` : Lance l'application sur un simulateur ou appareil iOS
- `npm web` : Lance l'application en mode web
- `npm test` : Exécute les tests avec Jest

## Structure du projet

- `app/` : Code source principal de l'application
  - `src/` : Sources principales
    - `components/` : Composants React Native réutilisables
      - `Feed/` : Composants liés au flux d'actualités
      - `Publication/` : Composants pour la création et l'affichage de publications
      - `CreateEvent/` : Composants pour la création d'événements
    - `screens/` : Écrans de l'application
      - `AuthScreen.tsx` : Écran de connexion
      - `RegisterScreen.tsx` : Écran d'inscription
      - `HomeScreen.tsx` : Écran d'accueil
      - `EventsScreen.tsx` : Liste des événements
      - `EventDetailScreen.tsx` : Détails d'un événement
      - `CreateEventScreen.tsx` : Création d'événement
      - `ProfileScreen.tsx` : Profil utilisateur
      - `JobsScreen.tsx` : Offres d'emploi
      - et d'autres écrans...
    - `services/` : Services d'API et logique métier
    - `context/` : Contextes React pour la gestion d'état (Auth, etc.)
    - `hooks/` : Hooks personnalisés
      - `useNetworkStatus.tsx` : Gestion de l'état de connexion
      - `useFeedback.tsx` : Gestion des notifications et feedback
    - `types/` : Types TypeScript
    - `styles/` : Styles et thèmes
      - `config/` : Configuration des thèmes et couleurs
    - `config.ts` : Configuration de l'API et constantes
  - `__tests__/` : Tests unitaires et d'intégration
  - `App.tsx` : Point d'entrée de l'application avec la configuration de navigation

  - `assets/` : Images, polices et autres ressources statiques
    - `images/` : Images et icônes
    - `fonts/` : Polices d'écriture

## Système de navigation

L'application utilise React Navigation 7 pour la gestion des routes :
- Navigation par pile (`StackNavigator`) pour les écrans principaux
- Navigation par onglets (`TabNavigator`) pour le menu inférieur
- Gestion des états d'authentification avec des piles de navigation conditionnelles

## Configuration Clerk & Authentification

### Architecture d'Authentification

L'application utilise une **architecture hybride** avec Clerk et un backend Express :

#### **Frontend (React Native/Expo)**
- Utilise `@clerk/clerk-expo` pour l'authentification
- Gère les sessions utilisateur avec Clerk
- Communique avec le backend pour les données métier

#### **Backend (Express + Prisma + MySQL)**
- **Ne stocke PAS les mots de passe** (délégation complète à Clerk)
- Stocke les profils utilisateur avec `externalId` (lien vers Clerk)
- Utilise `@clerk/clerk-sdk-node` pour vérifier les tokens
- Gère les données métier (posts, événements, performances, etc.)

#### **Clerk (Service d'Authentification)**
- Gère tous les mots de passe et l'authentification
- Fournit les fonctionnalités forgot password
- Envoie les emails de vérification et reset
- Génère et valide les tokens JWT

### Configuration Forgot Password

La fonctionnalité "mot de passe oublié" utilise **uniquement Clerk** - aucun endpoint backend n'est nécessaire.

#### 1. Configuration Dashboard Clerk

1. Connectez-vous à votre [Dashboard Clerk](https://dashboard.clerk.com/)
2. Sélectionnez votre application
3. Allez dans **User & Authentication** > **Email, Phone, Username**
4. Dans la section **Email address**, activez :
   - ✅ **Require email address**
   - ✅ **Allow password reset**

#### 2. Fonctionnalités Implémentées

- ✅ **Reset par Email** : Utilise directement les APIs Clerk
- ✅ **Interface simple** : Processus en 2 étapes (email → code + nouveau mot de passe)
- ✅ **Validation côté client** : Format email, longueur mot de passe
- ✅ **Gestion d'erreurs** : Messages contextuels de Clerk
- ✅ **Sécurité** : Support 2FA, expiration automatique des codes
- ✅ **UX optimisée** : États de chargement, navigation fluide

#### 3. Pourquoi pas d'endpoint backend ?

```typescript
// ❌ PAS BESOIN de ça dans le backend
// app.post('/auth/forgot-password', ...)
// app.post('/auth/reset-password', ...)

// ✅ À la place, le frontend utilise directement Clerk
await signIn.create({
  strategy: 'reset_password_email_code',
  identifier: email,
});
```

**Avantages de cette approche :**
- **Sécurité renforcée** : Les mots de passe ne transitent jamais par notre backend
- **Maintenance réduite** : Clerk gère la complexité (emails, validation, expiration)
- **Conformité** : Clerk gère GDPR, sécurité, etc.
- **Performance** : Moins de charge sur notre backend

#### 4. Test de la fonctionnalité

1. Naviguez vers l'écran de connexion
2. Cliquez sur "Forgot Password?"
3. Entrez votre adresse email
4. Vérifiez votre boîte mail pour le code de vérification
5. Saisissez le code reçu + votre nouveau mot de passe
6. Connexion automatique après reset réussi

#### 5. Dépannage

- **Email non reçu** : Vérifiez les spams, configuration email dans Clerk
- **Code invalide** : Les codes expirent après quelques minutes, demandez un nouveau code
- **Email non trouvé** : Vérifiez que l'email est bien enregistré dans votre application

## Notes importantes

- Ne jamais commiter le fichier `.env` (il est déjà dans .gitignore)
- Toujours utiliser l'IPv4 de votre machine, pas localhost
- Si vous changez de réseau, mettez à jour votre IPv4 dans le `.env`
- Pour tester sur un appareil physique, assurez-vous que celui-ci est connecté au même réseau que votre machine de développement

## Technologies utilisées

- React Native
- Expo
- TypeScript
- React Navigation 7
- Axios pour les requêtes API
- Jest pour les tests
- Clerk pour l'authentification
- Express + Prisma + MySQL pour le backend

## Contribution

Pour contribuer au projet :
1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout de fonctionnalité X'`)
3. Poussez votre branche (`git push origin feature/nom-fonctionnalite`)
4. Ouvrez une Pull Request