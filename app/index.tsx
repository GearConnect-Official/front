import { Redirect } from 'expo-router';
import { useAuth } from './src/context/AuthContext';
import LoadingScreen from './src/screens/LoadingScreen';

export default function Index() {
  const authContext = useAuth();
  
  // Protection contre le contexte null
  if (!authContext) {
    return <LoadingScreen />;
  }

  const { isAuthenticated, isLoading } = authContext;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Redirect href="/(app)/(tabs)/home" /> : <Redirect href="/(auth)/welcome" />;
}