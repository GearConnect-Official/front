import { StyleSheet } from 'react-native';
import theme from './config';

const styles = StyleSheet.create({
  // Conteneur principal de la carte
  container: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.md,
    ...theme.shadows.apply({}, 'card'),
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  
  // En-tête de la carte
  header: {
    ...theme.common.spaceBetween,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[100],
  },
  
  // Informations de l'auteur
  authorContainer: {
    ...theme.common.row,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borders.radius.round,
    marginRight: theme.spacing.xs,
  },
  
  authorInfo: {
    flex: 1,
  },
  
  authorName: {
    ...theme.typography.subtitle1,
    color: theme.colors.text.primary,
  },
  
  timestamp: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  
  // Actions sur la carte
  actionButton: {
    padding: theme.spacing.xs,
  },
  
  // Contenu de la carte
  content: {
    padding: theme.spacing.md,
  },
  
  title: {
    ...theme.typography.h5,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  
  description: {
    ...theme.typography.body1,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  
  image: {
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.md,
  },
  
  // Pied de la carte
  footer: {
    ...theme.common.row,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[100],
  },
  
  // Boutons d'action
  actionContainer: {
    ...theme.common.row,
    flex: 1,
  },
  
  action: {
    ...theme.common.row,
    marginRight: theme.spacing.md,
  },
  
  actionIcon: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.xxs,
    tintColor: theme.colors.grey[600],
  },
  
  actionText: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  
  // Etats de la carte
  cardSuccess: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.success,
  },
  
  cardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.warning,
  },
  
  cardError: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.error,
  },
  
  cardInfo: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.status.info,
  },
});

export default styles; 