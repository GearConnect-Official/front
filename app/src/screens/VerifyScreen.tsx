import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#6A707C',
  },
  loader: {
    marginTop: 20,
  },
});

export default VerifyScreen; 