# GearConnect Mobile App

Application mobile React Native pour le projet GearConnect, permettant de connecter des équipements et gérer leur utilisation.

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
    - `screens/` : Écrans de l'application
    - `services/` : Services d'API et logique métier
    - `context/` : Contextes React pour la gestion d'état
    - `types/` : Types TypeScript
    - `styles/` : Styles et thèmes
    - `config.ts` : Configuration de l'API et constantes
  - `__tests__/` : Tests unitaires et d'intégration
  - `App.tsx` : Point d'entrée de l'application

- `assets/` : Images, polices et autres ressources statiques

## Notes importantes

- Ne jamais commiter le fichier `.env` (il est déjà dans .gitignore)
- Toujours utiliser l'IPv4 de votre machine, pas localhost
- Si vous changez de réseau, mettez à jour votre IPv4 dans le `.env`
- Pour tester sur un appareil physique, assurez-vous que celui-ci est connecté au même réseau que votre machine de développement

## Technologies utilisées

- React Native
- Expo
- TypeScript
- React Navigation
- Axios pour les requêtes API
- Jest pour les tests

## Contribution

Pour contribuer au projet :
1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout de fonctionnalité X'`)
3. Poussez votre branche (`git push origin feature/nom-fonctionnalite`)
4. Ouvrez une Pull Request