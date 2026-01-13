# Content Files

Ce dossier contient les fichiers de contenu statique de l'application, notamment les Termes et Conditions.

## Terms & Conditions

### Structure

Les Termes et Conditions sont stockés dans deux formats :

1. **`termsAndConditions.yaml`** - Fichier source YAML (facile à modifier)
2. **`termsAndConditions.ts`** - Fichier TypeScript généré (utilisé par l'application)

### Comment modifier les Termes et Conditions

#### Option 1 : Modifier directement le fichier TypeScript (Recommandé pour des modifications rapides)

1. Ouvrez `termsAndConditions.ts`
2. Modifiez le contenu dans l'objet `termsAndConditionsData`
3. Sauvegardez le fichier
4. L'application utilisera automatiquement les nouvelles données

#### Option 2 : Modifier le YAML puis convertir (Pour des modifications importantes)

1. Modifiez `termsAndConditions.yaml` avec votre éditeur préféré
2. Exécutez le script de conversion :
   ```bash
   npm run build:content
   ```
   Ou directement :
   ```bash
   node scripts/convert-yaml-to-ts.js
   ```
3. Le fichier `termsAndConditions.ts` sera automatiquement mis à jour

### Structure du YAML

```yaml
title: "Terms & Conditions"
lastUpdated: "2024-01-15"
version: "1.0"

sections:
  - title: "1. Section Title"
    content: |
      Contenu de la section...
      • Point 1
      • Point 2
```

### Notes importantes

- Le champ `lastUpdated` doit être mis à jour à chaque modification
- Le champ `version` doit être incrémenté pour les changements majeurs
- Utilisez `|` dans YAML pour les blocs de texte multi-lignes
- Les puces (•) sont automatiquement formatées dans l'application

### Exemple de modification

Pour ajouter une nouvelle section :

```typescript
// Dans termsAndConditions.ts
sections: [
  // ... sections existantes
  {
    title: "13. New Section",
    content: "Contenu de la nouvelle section..."
  }
]
```

Pensez à mettre à jour `lastUpdated` et `version` si nécessaire.

