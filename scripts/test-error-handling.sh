#!/bin/bash

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Tests de gestion des erreurs et anomalies ===${NC}"
echo -e "Exécution des tests pour vérifier la robustesse de l'application face aux anomalies..."

# Vérifier la présence de jest
if ! command -v jest &> /dev/null
then
    echo -e "${RED}Erreur: Jest n'est pas installé ou n'est pas dans le PATH${NC}"
    echo "Installez les dépendances avec: npm install"
    exit 1
fi

# Liste des tests à exécuter
TEST_FILES=(
    "services/axiosConfig.test.ts"
    "hooks/useFeedback.test.tsx"
    "hooks/useNetworkStatus.test.tsx"
    "components/FeedbackMessage.test.tsx"
    "components/ErrorBoundary.test.tsx"
    "screens/OfflineScreen.test.tsx"
)

# Nombre total de tests
TOTAL_TESTS=${#TEST_FILES[@]}
PASSED_TESTS=0
FAILED_TESTS=0

# Exécuter chaque test individuellement
for test_file in "${TEST_FILES[@]}"; do
    echo -e "\n${YELLOW}Exécution du test: ${test_file}${NC}"
    
    # Exécuter le test
    if npx jest --config=jest.config.js app/__tests__/${test_file}; then
        echo -e "${GREEN}✓ Test réussi: ${test_file}${NC}"
        ((PASSED_TESTS++))
    else
        echo -e "${RED}✗ Test échoué: ${test_file}${NC}"
        ((FAILED_TESTS++))
    fi
done

# Afficher le résumé
echo -e "\n${YELLOW}=== Résumé des tests ===${NC}"
echo -e "Tests exécutés: ${TOTAL_TESTS}"
echo -e "${GREEN}Tests réussis: ${PASSED_TESTS}${NC}"
echo -e "${RED}Tests échoués: ${FAILED_TESTS}${NC}"

# Sortie avec code d'erreur si des tests ont échoué
if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "\n${RED}Certains tests ont échoué. Vérifiez les erreurs ci-dessus.${NC}"
    exit 1
else
    echo -e "\n${GREEN}Tous les tests ont réussi ! La gestion des erreurs fonctionne correctement.${NC}"
    exit 0
fi 