# GearConnect

## Configuration de l'environnement

1. Créez votre fichier `.env` en copiant le fichier exemple :
```bash
cp .env.example .env
```

2. Trouvez votre adresse IPv4 :
   - Windows : `ipconfig` dans le terminal
   - Mac/Linux : `ifconfig` ou `ip addr` dans le terminal

3. Modifiez le fichier `.env` avec votre IPv4 :
```env
API_HOST=votre_ipv4  # exemple: 192.168.1.100
```

4. Installez les dépendances :
```bash
npm install
```

5. Démarrez l'application :
```bash
npm start
```

## Notes importantes

- Ne jamais commiter le fichier `.env` (il est déjà dans .gitignore)
- Toujours utiliser l'IPv4 de votre machine, pas localhost
- Si vous changez de réseau, mettez à jour votre IPv4 dans le `.env`

## Structure du projet

- `app/` : Code source de l'application
  - `src/` : Sources principales
    - `config.ts` : Configuration de l'API
    - `types/` : Types TypeScript
    - `services/` : Services d'API
  - `assets/` : Images et ressources
  - `components/` : Composants React Native