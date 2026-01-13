import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../styles/screens/subscription/subscriptionStyles';

interface FeatureRow {
  feature: string;
  included: boolean;
}

const SubscriptionScreen: React.FC = () => {
  const router = useRouter();

  const features: FeatureRow[] = [
    { feature: 'Accès illimité à toutes les fonctionnalités', included: true },
    { feature: 'Statistiques de performance détaillées', included: true },
    { feature: 'Historique complet des courses', included: true },
    { feature: 'Analyses avancées des temps au tour', included: true },
    { feature: 'Suivi de progression personnalisé', included: true },
    { feature: 'Support prioritaire', included: true },
    { feature: 'Contenu exclusif et événements VIP', included: true },
    { feature: 'Pas de publicités', included: true },
  ];

  const handlePay = () => {
    // TODO: Implémenter la logique de paiement
    console.log('Paiement de l\'abonnement');
    // Ici vous pouvez ajouter la logique pour intégrer un système de paiement
    // Par exemple: Stripe, Apple Pay, Google Pay, etc.
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement Premium</Text>
        <View style={styles.placeholderRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <FontAwesome name="star" size={40} color="#E10600" />
          </View>
          <Text style={styles.mainTitle}>Passez à Premium</Text>
          <Text style={styles.subtitle}>
            Débloquez toutes les fonctionnalités et profitez d&apos;une expérience optimale
          </Text>
        </View>

        {/* Features Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Fonctionnalités</Text>
            <Text style={styles.tableHeaderText}>Inclus</Text>
          </View>
          
          {features.map((row, index) => (
            <View 
              key={index} 
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven
              ]}
            >
              <Text style={styles.featureText}>{row.feature}</Text>
              <View style={styles.checkContainer}>
                {row.included ? (
                  <FontAwesome name="check" size={20} color="#27AE60" />
                ) : (
                  <FontAwesome name="times" size={20} color="#E10600" />
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Pricing Section */}
        <View style={styles.pricingSection}>
          <Text style={styles.priceLabel}>Prix</Text>
          <Text style={styles.price}>9,99 € / mois</Text>
          <Text style={styles.priceNote}>Facturé mensuellement</Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePay}
          activeOpacity={0.8}
        >
          <Text style={styles.payButtonText}>Payer maintenant</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionScreen;
