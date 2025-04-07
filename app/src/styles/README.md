# Design System GearConnect

Ce dossier contient le design system de l'application GearConnect, conçu pour assurer la cohérence visuelle et faciliter la maintenance des styles.

## Structure

Le design system est organisé comme suit :

```
styles/
├── config/               # Configuration du design system
│   ├── colors.ts         # Palette de couleurs
│   ├── typography.ts     # Styles de typographie
│   ├── spacing.ts        # Espacements et dimensions
│   ├── shadows.ts        # Ombres et élévations
│   ├── borders.ts        # Styles de bordures
│   ├── theme.ts          # Configuration globale du thème
│   └── index.ts          # Point d'entrée pour l'import
└── [composant]Styles.ts  # Styles spécifiques aux composants
```

## Utilisation

### Importer le design system

```typescript
// Import du thème complet
import theme from './styles/config';

// Import de parties spécifiques
import { colors, typography, spacing } from './styles/config';
```

### Utiliser les éléments du design system

```typescript
import { StyleSheet } from 'react-native';
import theme from './styles/config';

const styles = StyleSheet.create({
  container: {
    ...theme.common.container,
    padding: theme.spacing.md,
  },
  
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary.main,
  },
  
  card: {
    ...theme.common.card,
    marginBottom: theme.spacing.lg,
  },
  
  button: {
    ...theme.common.button,
    backgroundColor: theme.colors.secondary.main,
  },
});
```

### Utiliser les utilitaires

#### Bordures

```typescript
// Utiliser une bordure prédéfinie
const cardStyle = theme.borders.apply({}, { preset: 'card' });

// Personnaliser une bordure
const customBorder = theme.borders.apply({}, { 
  width: 2, 
  color: theme.colors.primary.main, 
  radius: 'lg' 
});
```

#### Ombres

```typescript
// Appliquer une ombre prédéfinie avec la méthode apply
const cardWithShadow = theme.shadows.apply({}, 'md');

// Récupérer une ombre avec la méthode getShadow
const shadow = theme.getShadow('lg');

// Combiner avec d'autres styles
const card = {
  ...theme.borders.apply({}, { preset: 'card' }),
  ...theme.shadows.apply({}, 'md'),
  padding: theme.spacing.md,
};
```

## Bonnes pratiques

1. **Toujours utiliser le design system** pour les nouveaux composants
2. **Éviter les valeurs codées en dur** pour les couleurs, espacements, etc.
3. **Utiliser les styles communs** (`theme.common`) pour la cohérence
4. **Préférer les valeurs sémantiques** (`theme.colors.primary.main` au lieu de `'#1E232C'`)
5. **Refactoriser progressivement** les anciens composants pour utiliser le design system

## Contribution

Pour ajouter ou modifier des éléments du design system :

1. Identifier le fichier approprié dans `styles/config/`
2. Ajouter ou modifier les valeurs nécessaires
3. Mettre à jour la documentation si nécessaire
4. Vérifier que les modifications sont compatibles avec l'existant 