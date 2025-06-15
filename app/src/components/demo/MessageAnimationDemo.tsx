import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useMessage } from '../../context/MessageContext';
import MessageService from '../../services/messageService';
import AnimatedButton from '../ui/AnimatedButton';
import { QuickMessages } from '../../utils/messageUtils';
import theme from '../../styles/config/theme';

/**
 * Composant de démonstration pour tester toutes les animations et styles
 * À utiliser uniquement en développement pour valider le système
 */
const MessageAnimationDemo: React.FC = () => {
  const { showMessage, showConfirmation } = useMessage();

  // === TESTS DE MESSAGES PRÉDÉFINIS ===
  const testSuccessMessages = () => {
    setTimeout(() => showMessage(MessageService.SUCCESS.PROFILE_UPDATED), 0);
    setTimeout(() => showMessage(MessageService.SUCCESS.POST_SHARED), 1500);
    setTimeout(() => showMessage(MessageService.SUCCESS.PRODUCT_ADDED), 3000);
  };

  const testErrorMessages = () => {
    setTimeout(() => showMessage(MessageService.ERROR.LOGIN_REQUIRED), 0);
    setTimeout(() => showMessage(MessageService.ERROR.FAILED_TO_LOAD_COMMENTS), 2000);
    setTimeout(() => showMessage(MessageService.ERROR.PROFILE_UPDATE_FAILED), 4000);
  };

  const testInfoMessages = () => {
    setTimeout(() => showMessage(MessageService.INFO.COMING_SOON), 0);
    setTimeout(() => showMessage(MessageService.INFO.SUPPORT_CONTACT), 2500);
    setTimeout(() => showMessage(MessageService.INFO.TWO_FA_REQUIRED), 5000);
  };

  // === TESTS DE CONFIRMATIONS ===
  const testLogoutConfirmation = () => {
    showConfirmation({
      ...MessageService.CONFIRMATIONS.LOGOUT,
      onConfirm: () => {
        console.log('✅ Logout confirmé');
        showMessage(QuickMessages.success('Déconnexion réussie'));
      },
      onCancel: () => {
        console.log('❌ Logout annulé');
        showMessage(QuickMessages.info('Déconnexion annulée'));
      }
    });
  };

  const testDeleteConfirmation = () => {
    showConfirmation({
      ...MessageService.CONFIRMATIONS.DELETE_ACCOUNT,
      onConfirm: () => {
        console.log('🗑️ Suppression confirmée');
        showMessage(QuickMessages.success('Compte supprimé'));
      },
      onCancel: () => {
        console.log('🚫 Suppression annulée');
        showMessage(QuickMessages.info('Opération annulée'));
      }
    });
  };

  const testSuccessConfirmation = () => {
    showConfirmation({
      title: "Performance Added!",
      message: "Your race performance has been saved successfully. What would you like to do next?",
      confirmText: "View Dashboard",
      cancelText: "Add Another",
      type: 'success',
      onConfirm: () => {
        showMessage(QuickMessages.success('Navigating to dashboard...'));
      },
      onCancel: () => {
        showMessage(QuickMessages.info('Ready for next performance'));
      }
    });
  };

  const testWarningConfirmation = () => {
    showConfirmation({
      title: "Unsaved Changes",
      message: "You have unsaved changes that will be lost. Are you sure you want to continue?",
      confirmText: "Continue",
      cancelText: "Go Back",
      type: 'warning',
      onConfirm: () => {
        showMessage(QuickMessages.info('Changes discarded'));
      }
    });
  };

  const testCustomConfirmation = () => {
    showConfirmation({
      title: "Action Personnalisée",
      message: "Ceci est un test de confirmation personnalisée avec un message plus long pour voir comment le texte s'adapte dans le modal.",
      confirmText: "C'est parti !",
      cancelText: "Pas maintenant",
      type: 'info',
      onConfirm: () => {
        showMessage(QuickMessages.success('Action personnalisée réalisée !'));
      }
    });
  };

  // === TESTS AVEC QUICK MESSAGES ===
  const testQuickMessages = () => {
    setTimeout(() => showMessage(QuickMessages.success('Message rapide de succès')), 0);
    setTimeout(() => showMessage(QuickMessages.error('Message rapide d\'erreur')), 1500);
    setTimeout(() => showMessage(QuickMessages.networkError()), 3000);
    setTimeout(() => showMessage(QuickMessages.serverError()), 4500);
  };

  // === TESTS D'ANIMATIONS SPÉCIALES ===
  const testShakeAnimation = () => {
    // Test multiple d'erreurs pour voir l'animation shake
    showMessage(MessageService.ERROR.FAILED_TO_SAVE_POST);
  };

  const testLongMessage = () => {
    showMessage(MessageService.createCustomMessage(
      MessageService.SUCCESS.PROFILE_UPDATED.type,
      "Ceci est un message très long pour tester comment le système gère les textes étendus avec des animations fluides et un design responsive qui s'adapte automatiquement à la longueur du contenu.",
      6000
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>🎭 Demo Animations & Styles</Text>
          <Text style={styles.subtitle}>
            Testez toutes les fonctionnalités du système de messages
          </Text>
        </View>

        {/* Section Messages de Base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Messages de Base</Text>
          
          <AnimatedButton
            title="✅ Séquence de Succès"
            variant="primary"
            size="medium"
            onPress={testSuccessMessages}
            style={styles.button}
          />
          
          <AnimatedButton
            title="❌ Séquence d'Erreurs"
            variant="destructive"
            size="medium"
            onPress={testErrorMessages}
            style={styles.button}
          />
          
          <AnimatedButton
            title="ℹ️ Séquence d'Infos"
            variant="secondary"
            size="medium"
            onPress={testInfoMessages}
            style={styles.button}
          />
        </View>

        {/* Section Confirmations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤔 Confirmations Modernes</Text>
          
          <AnimatedButton
            title="✅ Success Confirmation"
            variant="primary"
            size="medium"
            onPress={testSuccessConfirmation}
            style={styles.button}
          />
          
          <AnimatedButton
            title="⚠️ Warning Confirmation"
            variant="secondary"
            size="medium"
            onPress={testWarningConfirmation}
            style={styles.button}
          />
          
          <AnimatedButton
            title="🚪 Logout Confirmation"
            variant="secondary"
            size="medium"
            onPress={testLogoutConfirmation}
            style={styles.button}
          />
          
          <AnimatedButton
            title="🗑️ Danger Confirmation"
            variant="destructive"
            size="medium"
            onPress={testDeleteConfirmation}
            style={styles.button}
          />
          
          <AnimatedButton
            title="ℹ️ Info Confirmation"
            variant="primary"
            size="medium"
            onPress={testCustomConfirmation}
            style={styles.button}
          />
        </View>

        {/* Section Messages Rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Messages Rapides</Text>
          
          <AnimatedButton
            title="🚀 QuickMessages Demo"
            variant="primary"
            size="medium"
            onPress={testQuickMessages}
            style={styles.button}
          />
          
          <AnimatedButton
            title="📞 Support Contact"
            variant="secondary"
            size="medium"
            onPress={() => showMessage(MessageService.INFO.SUPPORT_CONTACT)}
            style={styles.button}
          />
        </View>

        {/* Section Animations Spéciales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎨 Animations Spéciales</Text>
          
          <AnimatedButton
            title="📳 Test Shake Animation"
            variant="destructive"
            size="medium"
            onPress={testShakeAnimation}
            style={styles.button}
          />
          
          <AnimatedButton
            title="📝 Message Long"
            variant="secondary"
            size="medium"
            onPress={testLongMessage}
            style={styles.button}
          />
          
          <AnimatedButton
            title="🔄 Profil Mis à Jour"
            variant="primary"
            size="large"
            onPress={() => showMessage(MessageService.SUCCESS.PROFILE_UPDATED)}
            style={styles.button}
          />
        </View>

        {/* Section Variantes de Boutons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎛️ Variantes de Boutons</Text>
          
          <View style={styles.buttonRow}>
            <AnimatedButton
              title="Small"
              variant="primary"
              size="small"
              onPress={() => showMessage(QuickMessages.success('Bouton Small'))}
              style={styles.smallButton}
            />
            
            <AnimatedButton
              title="Medium"
              variant="secondary"
              size="medium"
              onPress={() => showMessage(QuickMessages.success('Bouton Medium'))}
              style={styles.smallButton}
            />
            
            <AnimatedButton
              title="Large"
              variant="destructive"
              size="large"
              onPress={() => showMessage(QuickMessages.success('Bouton Large'))}
              style={styles.smallButton}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🎉 Système de messages centralisé avec animations de qualité
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  smallButton: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borders.radius.md,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default MessageAnimationDemo; 