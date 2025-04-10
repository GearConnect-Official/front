import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import OfflineScreen from '../../src/screens/OfflineScreen';
import { Linking } from 'react-native';

describe('OfflineScreen component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should render offline message', () => {
    // Rendu du composant
    const { getByText } = render(<OfflineScreen retry={() => {}} />);
    
    // Vérifier que le message est affiché
    expect(getByText('Pas de connexion')).toBeTruthy();
    expect(getByText(/Impossible de se connecter au serveur/i)).toBeTruthy();
  });
  
  it('should call retry function when retry button is pressed', () => {
    // Mock pour retry
    const mockRetry = jest.fn();
    
    // Rendu du composant
    const { getByText } = render(<OfflineScreen retry={mockRetry} />);
    
    // Trouver et cliquer sur le bouton "Réessayer"
    const retryButton = getByText('Réessayer');
    fireEvent.press(retryButton);
    
    // Vérifier que la fonction retry a été appelée
    expect(mockRetry).toHaveBeenCalled();
  });
  
  it('should open network settings when settings button is pressed', () => {
    // Rendu du composant
    const { getByText } = render(<OfflineScreen retry={() => {}} />);
    
    // Trouver et cliquer sur le bouton "Paramètres réseau"
    const settingsButton = getByText('Paramètres réseau');
    fireEvent.press(settingsButton);
    
    // Vérifier que Linking.openSettings a été appelé
    expect(Linking.openSettings).toHaveBeenCalled();
  });
  
  it('should render help links', () => {
    // Rendu du composant
    const { getByText } = render(<OfflineScreen retry={() => {}} />);
    
    // Vérifier que les liens d'aide sont affichés
    expect(getByText('Besoin d\'aide?')).toBeTruthy();
    expect(getByText('Contacter le support')).toBeTruthy();
  });
}); 