import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Modal,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/profileStyles";
import { useAuth } from "../context/AuthContext";
import ProfilePost from "../components/Feed/ProfilePost";

// Largeur de l'écran pour calculer les dimensions des images de la grille
const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const TILE_WIDTH = width / NUM_COLUMNS;
const TILE_HEIGHT = TILE_WIDTH;
const TILE_SPACING = 1;

// Type pour les publications
interface Post {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption?: string;
  location?: string;
  timeAgo?: string;
  multipleImages?: boolean;
}

// Type pour les événements
interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  description?: string;
  participants?: number;
  isOrganizer?: boolean;
  result?: string; // Pour les résultats de course
}

// Type pour les statistiques de pilote
interface DriverStats {
  races: number;
  wins: number;
  podiums: number;
  championshipPosition?: number;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [eventFilter, setEventFilter] = useState<"all" | "organized" | "participated">("all");
  const [stats, setStats] = useState({
    posts: 24,
    followers: 1248,
    following: 420,
  });
  const [driverStats, setDriverStats] = useState<DriverStats>({
    races: 12,
    wins: 3,
    podiums: 7,
    championshipPosition: 2
  });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postModalVisible, setPostModalVisible] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Publications simulées pour la grille
    const mockPosts: Post[] = [
      {
        id: "1",
        imageUrl: "https://images.pexels.com/photos/12801367/pexels-photo-12801367.jpeg",
        likes: 128,
        comments: 14,
        location: "Circuit de Monza",
        multipleImages: true,
        caption: "Incroyable journée sur le circuit de Monza. Préparation pour la saison à venir ! 🏎️ #F3 #Racing #Monza",
        timeAgo: "2 jours",
      },
      {
        id: "2",
        imageUrl: "https://images.pexels.com/photos/12316494/pexels-photo-12316494.jpeg",
        likes: 253,
        comments: 32,
        location: "Circuit Paul Ricard",
        caption: "Essais au Paul Ricard. Conditions parfaites et bonne performance de l'équipe. Prêts pour la compétition ! 💪",
        timeAgo: "1 semaine",
      },
      {
        id: "3",
        imageUrl: "https://images.pexels.com/photos/12120915/pexels-photo-12120915.jpeg",
        likes: 86,
        comments: 9,
        location: "Karting de Cormeilles",
        multipleImages: true,
        caption: "Retour aux sources avec une session de karting. Rien de tel pour perfectionner sa technique !",
        timeAgo: "2 semaines",
      },
      {
        id: "4",
        imageUrl: "https://images.pexels.com/photos/1719647/pexels-photo-1719647.jpeg",
        likes: 176,
        comments: 21,
        caption: "Nouveau casque personnalisé pour la saison ! Qu'en pensez-vous ? #Racing #Equipment",
        timeAgo: "3 semaines",
      },
      {
        id: "5",
        imageUrl: "https://images.pexels.com/photos/9660/business-car-vehicle-black-and-white.jpg",
        likes: 142,
        comments: 17,
        location: "Circuit Spa-Francorchamps",
        caption: "Week-end de course à Spa. Une piste mythique avec des conditions météo changeantes !",
        timeAgo: "1 mois",
      },
      {
        id: "6",
        imageUrl: "https://images.pexels.com/photos/2804393/pexels-photo-2804393.jpeg",
        likes: 95,
        comments: 7,
        caption: "En attendant la prochaine course, focus sur l'entraînement physique 🏃‍♂️",
        timeAgo: "1 mois",
      },
      {
        id: "7",
        imageUrl: "https://images.pexels.com/photos/109699/pexels-photo-109699.jpeg",
        likes: 204,
        comments: 27,
        multipleImages: true,
        caption: "Visite de l'usine de l'équipe. Incroyable de voir le travail des ingénieurs et mécaniciens !",
        timeAgo: "2 mois",
      },
      {
        id: "8",
        imageUrl: "https://images.pexels.com/photos/12801381/pexels-photo-12801381.jpeg",
        likes: 118,
        comments: 12,
        caption: "Analyse des données de la dernière course. Toujours chercher à s'améliorer ! 📊",
        timeAgo: "2 mois",
      },
      {
        id: "9",
        imageUrl: "https://images.pexels.com/photos/15825503/pexels-photo-15825503/free-photo-of-voiture-de-course-de-formule-1-et-drapeaux-a-damier.jpeg",
        likes: 163,
        comments: 19,
        location: "Circuit de Barcelona-Catalunya",
        caption: "Premiers tests à Barcelona. La nouvelle voiture est prometteuse ! 🏎️ #Testing #F3 #Barcelona",
        timeAgo: "3 mois",
      },
    ];

    // Événements simulés
    const mockEvents: Event[] = [
      {
        id: "1",
        title: "Championnat F3 - Manche 1",
        imageUrl: "https://images.pexels.com/photos/12138012/pexels-photo-12138012.jpeg",
        date: "15-17 Mars 2023",
        location: "Circuit de Monza, Italie",
        description: "Première manche du championnat F3 2023. Qualification P3, résultat course 1: P2, course 2: P1.",
        result: "Victoire",
        participants: 22
      },
      {
        id: "2",
        title: "Course d'exhibition - 4h du Mans",
        imageUrl: "https://images.pexels.com/photos/12062013/pexels-photo-12062013.jpeg",
        date: "5-6 Avril 2023",
        location: "Circuit des 24h du Mans, France",
        description: "Course d'exhibition en lever de rideau des 24h du Mans.",
        result: "P4",
        participants: 30
      },
      {
        id: "3",
        title: "Championnat F3 - Manche 2",
        imageUrl: "https://images.pexels.com/photos/2399249/pexels-photo-2399249.jpeg",
        date: "29 Avril - 1 Mai 2023",
        location: "Circuit Paul Ricard, France",
        description: "Deuxième manche du championnat F3 2023. Qualification P1, course 1: P1, course 2: DNF (problème technique).",
        result: "Victoire / Abandon",
        participants: 22
      },
      {
        id: "4",
        title: "Journée Karting - Promotion Jeunes Pilotes",
        imageUrl: "https://images.pexels.com/photos/8985459/pexels-photo-8985459.jpeg",
        date: "15 Mai 2023",
        location: "Karting de Cormeilles, France",
        description: "Journée d'initiation organisée pour les jeunes pilotes. Partage d'expérience et coaching.",
        isOrganizer: true,
        participants: 15
      },
      {
        id: "5",
        title: "Championnat F3 - Manche 3",
        imageUrl: "https://images.pexels.com/photos/265881/pexels-photo-265881.jpeg",
        date: "20-22 Mai 2023",
        location: "Circuit de Barcelona-Catalunya, Espagne",
        description: "Troisième manche du championnat F3 2023. Qualification P5, course 1: P4, course 2: P3.",
        result: "P3",
        participants: 22
      },
      {
        id: "6",
        title: "Stage de Pilotage - Avancé",
        imageUrl: "https://images.pexels.com/photos/14777754/pexels-photo-14777754.jpeg",
        date: "10 Juin 2023",
        location: "Circuit de Magny-Cours, France",
        description: "Stage de pilotage pour pilotes confirmés. Techniques avancées et analyse de télémétrie.",
        isOrganizer: true,
        participants: 8
      },
    ];

    setPosts(mockPosts);
    setEvents(mockEvents);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setPostModalVisible(true);
  };

  const handleClosePostModal = () => {
    setPostModalVisible(false);
    setSelectedPost(null);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + 1
          };
        }
        return post;
      })
    );
  };

  const handleCommentPost = (postId: string) => {
    console.log(`Open comments for post ${postId}`);
    // Ici vous pourriez ouvrir un modal de commentaires
  };

  const handleSharePost = (postId: string) => {
    console.log(`Share post ${postId}`);
    // Ici vous pourriez ouvrir un modal de partage
  };

  const handleProfilePress = (username: string) => {
    console.log(`Navigate to profile of ${username}`);
    // Comme on est déjà sur le profil, cette fonction serait plus utile
    // si on naviguait vers d'autres profils depuis le profil actuel
  };

  const handleEventPress = (eventId: string) => {
    console.log(`View event details for ${eventId}`);
    // Navigation vers la page détaillée de l'événement
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postTile}
      activeOpacity={0.8}
      onPress={() => handlePostPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postTileImage} />
      {item.multipleImages && (
        <View style={styles.multipleImagesIcon}>
          <FontAwesome name="clone" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      activeOpacity={0.8}
      onPress={() => handleEventPress(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View style={styles.eventOverlay}>
        {item.isOrganizer && (
          <View style={styles.organizerBadge}>
            <FontAwesome name="star" size={12} color="#FFFFFF" />
            <Text style={styles.organizerText}>Organisateur</Text>
          </View>
        )}
        {item.result && (
          <View style={styles.resultBadge}>
            <Text style={styles.resultText}>{item.result}</Text>
          </View>
        )}
      </View>
      {item.result === "Victoire" && (
        <View style={styles.achievementBadge}>
          <FontAwesome name="trophy" size={12} color="#FFFFFF" />
          <Text style={styles.achievementText}>1ère place</Text>
        </View>
      )}
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <View style={styles.eventMetaItem}>
            <FontAwesome name="calendar" size={14} color="#6E6E6E" style={styles.eventMetaIcon} />
            <Text style={styles.eventMetaText}>{item.date}</Text>
          </View>
          <View style={styles.eventMetaItem}>
            <FontAwesome name="map-marker" size={14} color="#6E6E6E" style={styles.eventMetaIcon} />
            <Text style={styles.eventMetaText}>{item.location}</Text>
          </View>
          {item.participants && (
            <View style={styles.eventMetaItem}>
              <FontAwesome name="users" size={14} color="#6E6E6E" style={styles.eventMetaIcon} />
              <Text style={styles.eventMetaText}>{item.participants} participants</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPostsGrid = () => {
    if (posts.length === 0) {
      return renderEmptyComponent();
    }

    // Calculer le nombre de lignes nécessaires pour afficher tous les posts
    const rows = Math.ceil(posts.length / NUM_COLUMNS);
    const postRows = [];

    for (let i = 0; i < rows; i++) {
      const rowItems = posts.slice(i * NUM_COLUMNS, (i + 1) * NUM_COLUMNS);
      const row = (
        <View key={`row-${i}`} style={{ flexDirection: 'row' }}>
          {rowItems.map(item => renderPostItem({ item }))}
          {/* Remplir la rangée avec des espaces vides si nécessaire */}
          {Array(NUM_COLUMNS - rowItems.length).fill(0).map((_, index) => (
            <View key={`empty-${index}`} style={[styles.postTile, { backgroundColor: 'transparent' }]} />
          ))}
        </View>
      );
      postRows.push(row);
    }

    return (
      <View style={styles.postsContainer}>
        {postRows}
      </View>
    );
  };

  const renderEventsList = () => {
    if (events.length === 0) {
      return renderEmptyComponent();
    }

    // Filtrer les événements selon le filtre actif
    const filteredEvents = events.filter(event => {
      if (eventFilter === "all") return true;
      if (eventFilter === "organized") return !!event.isOrganizer;
      if (eventFilter === "participated") return !event.isOrganizer; // Supposant que tous les événements non organisés sont participés
      return true;
    });

    // Si aucun événement ne correspond au filtre, afficher un message approprié
    if (filteredEvents.length === 0) {
      return (
        <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
          <FontAwesome name="calendar-times-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>
            {eventFilter === "organized" 
              ? "Aucun événement organisé" 
              : "Aucune participation"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {eventFilter === "organized"
              ? "Les événements que vous organisez apparaîtront ici."
              : "Les événements auxquels vous participez apparaîtront ici."}
          </Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Créer un événement</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.eventsContainer}>
        {/* Filtres d'événements */}
        <View style={styles.eventFiltersContainer}>
          <TouchableOpacity 
            style={[
              styles.eventFilterButton, 
              eventFilter === "all" && styles.activeEventFilter
            ]}
            onPress={() => setEventFilter("all")}
          >
            <Text style={[
              styles.eventFilterText, 
              eventFilter === "all" && styles.activeEventFilterText
            ]}>
              Tous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.eventFilterButton, 
              eventFilter === "organized" && styles.activeEventFilter
            ]}
            onPress={() => setEventFilter("organized")}
          >
            <Text style={[
              styles.eventFilterText, 
              eventFilter === "organized" && styles.activeEventFilterText
            ]}>
              Organisés
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.eventFilterButton, 
              eventFilter === "participated" && styles.activeEventFilter
            ]}
            onPress={() => setEventFilter("participated")}
          >
            <Text style={[
              styles.eventFilterText, 
              eventFilter === "participated" && styles.activeEventFilterText
            ]}>
              Participations
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Liste des événements filtrés */}
        {filteredEvents.map(item => (
          <View key={item.id}>
            {renderEventItem({ item })}
          </View>
        ))}
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={[styles.emptyContainer, { flex: 1, minHeight: 300 }]}>
      {activeTab === 'posts' ? (
        <>
          <FontAwesome name="camera" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Aucune publication</Text>
          <Text style={styles.emptySubtitle}>Les photos et vidéos de vos courses et entraînements apparaîtront ici.</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Partager une photo</Text>
          </TouchableOpacity>
        </>
      ) : activeTab === 'events' ? (
        <>
          <FontAwesome name="calendar-plus-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Aucun événement</Text>
          <Text style={styles.emptySubtitle}>Vos courses, championnats et sessions d'entraînement apparaîtront ici.</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Créer un événement</Text>
          </TouchableOpacity>
        </>
      ) : activeTab === 'reels' ? (
        <>
          <FontAwesome name="film" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Aucune vidéo</Text>
          <Text style={styles.emptySubtitle}>Partagez les meilleurs moments de vos courses et circuits.</Text>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Ajouter une vidéo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <FontAwesome name="bookmark-o" size={60} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Aucun élément sauvegardé</Text>
          <Text style={styles.emptySubtitle}>Sauvegardez des circuits, publications et événements pour les retrouver facilement.</Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* En-tête avec nom et bouton de retour */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={20} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.username}>esteban_dardillac</Text>
          <TouchableOpacity style={styles.menuButton}>
            <FontAwesome name="ellipsis-v" size={20} color="#1E1E1E" />
          </TouchableOpacity>
        </View>

        {/* Section profil avec avatar et statistiques */}
        <View style={styles.profileContainer}>
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Image
                source={{
                  uri: "https://images.pexels.com/photos/3482523/pexels-photo-3482523.jpeg",
                }}
                style={styles.profileAvatar}
              />

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(stats.posts)}</Text>
                  <Text style={styles.statLabel}>Publications</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(stats.followers)}</Text>
                  <Text style={styles.statLabel}>Abonnés</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(stats.following)}</Text>
                  <Text style={styles.statLabel}>Abonnements</Text>
                </View>
              </View>
            </View>

            {/* Bio et informations */}
            <View style={styles.bioSection}>
              <Text style={styles.displayName}>Esteban Dardillac</Text>
              <Text style={styles.bioText}>🏎️ Pilote F3 | Karting Fr Championship 🏆</Text>
              <Text style={styles.bioText}>Ambassadeur @racing_gear</Text>
              <TouchableOpacity style={styles.websiteLink}>
                <Text style={styles.websiteText}>circuits-passion.com/esteban</Text>
              </TouchableOpacity>
            </View>

            {/* Statistiques de pilote */}
            <View style={styles.statsCard}>
              <View style={styles.statColumn}>
                <FontAwesome name="flag-checkered" size={20} style={styles.statIcon} />
                <Text style={styles.driverStatLabel}>Courses</Text>
                <Text style={styles.driverStatValue}>{driverStats.races}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statColumn}>
                <FontAwesome name="trophy" size={20} style={styles.statIcon} />
                <Text style={styles.driverStatLabel}>Victoires</Text>
                <Text style={styles.driverStatValue}>{driverStats.wins}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statColumn}>
                <FontAwesome name="certificate" size={20} style={styles.statIcon} />
                <Text style={styles.driverStatLabel}>Podiums</Text>
                <Text style={styles.driverStatValue}>{driverStats.podiums}</Text>
              </View>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.primaryActionButton}>
                <Text style={styles.primaryActionButtonText}>Suivre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallActionButton}>
                <FontAwesome name="user-plus" size={14} color="#1E1E1E" />
              </TouchableOpacity>
            </View>

            {/* Stories à la une */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.highlightsContainer}
              contentContainerStyle={styles.highlightsContent}
            >
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image 
                    source={{ uri: "https://images.pexels.com/photos/12012678/pexels-photo-12012678.jpeg" }} 
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>F3 2023</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image 
                    source={{ uri: "https://images.pexels.com/photos/461705/pexels-photo-461705.jpeg" }} 
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Victoires</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image 
                    source={{ uri: "https://images.pexels.com/photos/12120941/pexels-photo-12120941.jpeg" }} 
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Karting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <Image 
                    source={{ uri: "https://images.pexels.com/photos/17236741/pexels-photo-17236741/free-photo-of-sport-auto-rapide-puissant.jpeg" }} 
                    style={styles.highlightImage}
                  />
                </View>
                <Text style={styles.highlightText}>Équipe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.highlightItem}>
                <View style={styles.highlightImageContainer}>
                  <View style={styles.newHighlightPlus}>
                    <FontAwesome name="plus" size={24} color="#1E1E1E" />
                  </View>
                </View>
                <Text style={styles.highlightText}>Nouveau</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Onglets */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'posts' && styles.activeTab]} 
              onPress={() => setActiveTab('posts')}
            >
              <FontAwesome 
                name="th" 
                size={22} 
                color={activeTab === 'posts' ? "#E10600" : "#6E6E6E"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'events' && styles.activeTab]} 
              onPress={() => setActiveTab('events')}
            >
              <FontAwesome 
                name="calendar" 
                size={22} 
                color={activeTab === 'events' ? "#E10600" : "#6E6E6E"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'reels' && styles.activeTab]} 
              onPress={() => setActiveTab('reels')}
            >
              <FontAwesome 
                name="film" 
                size={22} 
                color={activeTab === 'reels' ? "#E10600" : "#6E6E6E"} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'saved' && styles.activeTab]} 
              onPress={() => setActiveTab('saved')}
            >
              <FontAwesome 
                name="bookmark-o" 
                size={22} 
                color={activeTab === 'saved' ? "#E10600" : "#6E6E6E"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenu des onglets */}
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          {activeTab === 'posts' ? renderPostsGrid() : 
           activeTab === 'events' ? renderEventsList() : 
           renderEmptyComponent()}
        </View>

        {/* Bouton flottant pour les événements */}
        {activeTab === 'events' && events.length > 0 && (
          <TouchableOpacity 
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: '#E10600',
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
            onPress={() => console.log('Créer un événement')}
          >
            <FontAwesome name="plus" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Modal pour afficher un post en détail */}
      <Modal
        visible={postModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClosePostModal}
      >
        <SafeAreaView style={styles.container}>
          {selectedPost && (
            <ProfilePost
              post={{
                ...selectedPost,
                username: "esteban_dardillac",
                userAvatar: "https://images.pexels.com/photos/3482523/pexels-photo-3482523.jpeg"
              }}
              onClose={handleClosePostModal}
              onLike={handleLikePost}
              onComment={handleCommentPost}
              onShare={handleSharePost}
              onProfilePress={handleProfilePress}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
