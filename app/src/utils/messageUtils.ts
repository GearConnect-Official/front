import MessageService from '../services/messageService';
import { MessageType } from '../types/messages';

/**
 * Utilitaires pour simplifier l'utilisation des messages centralisés
 */

/**
 * Créer un message de succès rapide
 */
export const createSuccessMessage = (message: string, duration = 3000) => {
  return MessageService.createCustomMessage(MessageType.SUCCESS, message, duration);
};

/**
 * Créer un message d'erreur rapide
 */
export const createErrorMessage = (message: string, duration = 4000) => {
  return MessageService.createCustomMessage(MessageType.ERROR, message, duration);
};

/**
 * Créer un message d'information rapide
 */
export const createInfoMessage = (message: string, duration = 4000) => {
  return MessageService.createCustomMessage(MessageType.INFO, message, duration);
};

/**
 * Créer un message d'avertissement rapide
 */
export const createWarningMessage = (message: string, duration = 4000) => {
  return MessageService.createCustomMessage(MessageType.WARNING, message, duration);
};

/**
 * Créer une confirmation rapide
 */
export const createConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  options?: {
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onCancel?: () => void;
  }
) => {
  return MessageService.createCustomConfirmation(title, message, onConfirm, options);
};

/**
 * Messages fréquemment utilisés - raccourcis
 */
export const QuickMessages = {
  // Succès
  success: (message: string) => createSuccessMessage(message),
  profileUpdated: () => MessageService.SUCCESS.PROFILE_UPDATED,
  saved: () => createSuccessMessage("Enregistré avec succès"),
  deleted: () => createSuccessMessage("Supprimé avec succès"),
  
  // Erreurs
  error: (message: string) => createErrorMessage(message),
  loginRequired: () => MessageService.ERROR.LOGIN_REQUIRED,
  networkError: () => createErrorMessage("Problème de connexion. Vérifiez votre connexion internet."),
  serverError: () => createErrorMessage("Erreur serveur. Veuillez réessayer plus tard."),
  
  // Info
  info: (message: string) => createInfoMessage(message),
  comingSoon: () => MessageService.INFO.COMING_SOON,
  
  // Confirmations
  deleteConfirmation: (onConfirm: () => void) => createConfirmation(
    "Supprimer",
    "Êtes-vous sûr de vouloir supprimer cet élément ?",
    onConfirm,
    { destructive: true }
  ),
  
  logoutConfirmation: (onConfirm: () => void) => ({
    ...MessageService.CONFIRMATIONS.LOGOUT,
    onConfirm
  }),
};

// Default export to prevent Expo Router warnings
export { default } from '../NoRoute'; 