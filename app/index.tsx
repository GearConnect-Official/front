import { Redirect } from 'expo-router';
import { useAuth } from './src/context/AuthContext';
import LoadingScreen from './src/screens/LoadingScreen';

export default function Index() {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated ?? false;
  const isLoading = auth?.isLoading ?? true;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Redirect href="/(app)/(tabs)/home" /> : <Redirect href="/(auth)/welcome" />;
}