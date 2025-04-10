import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/verifyStyles';

const VerifyScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    // Redirection automatique vers BottomTabs après 2 secondes
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }],
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user?.username} !</Text>
      <Text style={styles.subtitle}>
        Vous êtes maintenant connecté à GearConnect
      </Text>
      <ActivityIndicator size="large" color="#1E232C" style={styles.loader} />
    </View>
  );
};

export default VerifyScreen; 