#!/bin/bash

# GearConnect - Installation et lancement automatique
# Ce script installe l'APK sur votre appareil Android et capture les logs

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Dossiers
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$(dirname "$SCRIPT_DIR")"
APKS_DIR="$BUILD_DIR/apks"
TOOLS_DIR="$BUILD_DIR/tools" 
LOGS_DIR="$BUILD_DIR/logs"

# Configuration
PACKAGE_NAME="com.gearconnect.app"
LOG_FILE="$LOGS_DIR/gearconnect_$(date +%Y%m%d_%H%M%S).log"

echo -e "${BLUE}🚀 GearConnect - Installation et lancement automatique${NC}"
echo "=================================================="

# Fonction pour vérifier si ADB est installé
check_adb() {
    if ! command -v adb &> /dev/null; then
        echo -e "${RED}❌ ADB n'est pas installé ou pas dans le PATH${NC}"
        echo "Installez Android SDK Platform Tools ou ajoutez ADB au PATH"
        exit 1
    fi
    echo -e "${GREEN}✅ ADB trouvé${NC}"
}

# Fonction pour vérifier si un appareil est connecté
check_device() {
    local devices=$(adb devices | grep -v "List" | grep "device" | wc -l)
    if [ "$devices" -eq 0 ]; then
        echo -e "${RED}❌ Aucun appareil Android connecté${NC}"
        echo "Connectez votre appareil Android avec le debug USB activé"
        echo "Pour activer le debug USB :"
        echo "1. Allez dans Paramètres > À propos du téléphone"
        echo "2. Tapez 7 fois sur 'Numéro de build'"
        echo "3. Allez dans Paramètres > Options de développement"
        echo "4. Activez 'Débogage USB'"
        exit 1
    fi
    echo -e "${GREEN}✅ Appareil Android connecté${NC}"
    adb devices
}

# Fonction pour lister les APKs disponibles
list_apks() {
    echo -e "${BLUE}📱 APKs disponibles :${NC}"
    local i=1
    for apk in "$APKS_DIR"/*.apk; do
        if [ -f "$apk" ]; then
            local size=$(du -h "$apk" | cut -f1)
            echo "  $i. $(basename "$apk") ($size)"
            ((i++))
        fi
    done
}

# Fonction pour sélectionner un APK
select_apk() {
    local apks=("$APKS_DIR"/*.apk)
    local count=${#apks[@]}
    
    if [ $count -eq 0 ]; then
        echo -e "${RED}❌ Aucun APK trouvé dans $APKS_DIR${NC}"
        exit 1
    elif [ $count -eq 1 ]; then
        selected_apk="${apks[0]}"
        echo -e "${GREEN}📱 APK sélectionné : $(basename "$selected_apk")${NC}"
    else
        list_apks
        echo -e "${YELLOW}Choisissez un APK (1-$count) :${NC}"
        read -r choice
        if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le $count ]; then
            selected_apk="${apks[$((choice-1))]}"
            echo -e "${GREEN}📱 APK sélectionné : $(basename "$selected_apk")${NC}"
        else
            echo -e "${RED}❌ Choix invalide${NC}"
            exit 1
        fi
    fi
}

# Fonction pour désinstaller l'ancienne version
uninstall_old() {
    echo -e "${YELLOW}🗑️  Désinstallation de l'ancienne version...${NC}"
    adb uninstall "$PACKAGE_NAME" 2>/dev/null || echo "Aucune version précédente trouvée"
}

# Fonction pour installer l'APK
install_apk() {
    echo -e "${BLUE}📦 Installation de $(basename "$selected_apk")...${NC}"
    if adb install "$selected_apk"; then
        echo -e "${GREEN}✅ Installation réussie${NC}"
    else
        echo -e "${RED}❌ Échec de l'installation${NC}"
        exit 1
    fi
}

# Fonction pour démarrer la capture de logs
start_logging() {
    echo -e "${BLUE}📝 Démarrage de la capture de logs...${NC}"
    echo "Logs sauvegardés dans : $LOG_FILE"
    
    # Vider le buffer de logs
    adb logcat -c
    
    # Démarrer la capture en arrière-plan
    adb logcat -v time "*:V" | grep -i -E "(gearconnect|expo|react|fatal|error)" > "$LOG_FILE" &
    LOG_PID=$!
    
    echo -e "${GREEN}✅ Capture de logs démarrée (PID: $LOG_PID)${NC}"
}

# Fonction pour lancer l'application
launch_app() {
    echo -e "${BLUE}🚀 Lancement de GearConnect...${NC}"
    adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
    echo -e "${GREEN}✅ Application lancée${NC}"
}

# Fonction pour surveiller l'application
monitor_app() {
    echo -e "${BLUE}👀 Surveillance de l'application...${NC}"
    echo "Appuyez sur Ctrl+C pour arrêter la surveillance"
    echo "Logs en temps réel :"
    echo "==================="
    
    # Afficher les logs en temps réel
    tail -f "$LOG_FILE" &
    TAIL_PID=$!
    
    # Attendre l'interruption
    trap cleanup INT
    wait $TAIL_PID
}

# Fonction de nettoyage
cleanup() {
    echo -e "\n${YELLOW}🛑 Arrêt de la surveillance...${NC}"
    
    # Arrêter la capture de logs
    if [ ! -z "$LOG_PID" ]; then
        kill $LOG_PID 2>/dev/null || true
    fi
    
    # Arrêter l'affichage des logs
    if [ ! -z "$TAIL_PID" ]; then
        kill $TAIL_PID 2>/dev/null || true
    fi
    
    echo -e "${GREEN}✅ Logs sauvegardés dans : $LOG_FILE${NC}"
    echo -e "${BLUE}📊 Résumé des erreurs :${NC}"
    grep -i "error\|fatal\|exception" "$LOG_FILE" | tail -10 || echo "Aucune erreur trouvée"
    
    exit 0
}

# Fonction principale
main() {
    # Créer le dossier de logs s'il n'existe pas
    mkdir -p "$LOGS_DIR"
    
    # Vérifications préalables
    check_adb
    check_device
    
    # Sélection et installation de l'APK
    select_apk
    uninstall_old
    install_apk
    
    # Démarrage de la surveillance
    start_logging
    launch_app
    
    # Attendre un peu que l'app se lance
    sleep 3
    
    # Surveiller l'application
    monitor_app
}

# Options de ligne de commande
case "${1:-}" in
    "--help"|"-h")
        echo "Usage: $0 [OPTIONS]"
        echo "Options:"
        echo "  --help, -h     Afficher cette aide"
        echo "  --list, -l     Lister les APKs disponibles"
        echo "  --logs, -g     Voir les derniers logs"
        exit 0
        ;;
    "--list"|"-l")
        list_apks
        exit 0
        ;;
    "--logs"|"-g")
        echo "Derniers logs :"
        find "$LOGS_DIR" -name "*.log" -type f -exec ls -lt {} \; | head -1 | awk '{print $9}' | xargs cat | tail -50
        exit 0
        ;;
    *)
        main
        ;;
esac 