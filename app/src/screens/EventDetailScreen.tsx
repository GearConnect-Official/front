import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const MOCK_EVENT = {
  id: 1,
  title: "Open Circuit Débutant Val de Vienne",
  category: "Open day, Free Entry",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  tags: ["Open", "France"],
  images: [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/1f7b0c5c6c3b4d5c9a4f8a8b8c9a5b5a",
  ],
  details: {
    location: "Val de Vienne",
    date: "16/01/25",
    time: "08:00 - 18:00",
  },
  relatedProducts: [
    {
      id: 1,
      title: "Apprendre à piloter",
      price: "10€",
      image: "https://via.placeholder.com/100",
      tag: "New Arrival",
    },
    {
      id: 2,
      title: "Comment Battre Max Verstappen",
      price: "1 000 000€",
      image: "https://via.placeholder.com/100",
      tag: "Best Seller",
    },
  ],
  reviews: [
    {
      id: 1,
      user: "Rapheal",
      rating: 5,
      comment: "Great event, highly recommend!",
      avatar: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      user: "André(Romain)",
      rating: 3,
      comment: "Average experience, could be better.",
      avatar: "https://via.placeholder.com/50",
    },
  ],
};

const EventDetailScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewText}>Review</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{MOCK_EVENT.title}</Text>
        <Text style={styles.eventCategory}>{MOCK_EVENT.category}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Image source={{ uri: MOCK_EVENT.images[0] }} style={styles.eventImage} />
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About</Text>
          <View style={styles.tagContainer}>
            {MOCK_EVENT.tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
          <Text style={styles.description}>{MOCK_EVENT.description}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Best of Images</Text>
      <Image source={{ uri: MOCK_EVENT.images[0] }} style={styles.mainEventImage} />

      <Text style={styles.sectionTitle}>Event Details</Text>
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={20} color="gray" />
        <Text style={styles.detailText}>{MOCK_EVENT.details.location}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={20} color="gray" />
        <Text style={styles.detailText}>{MOCK_EVENT.details.date}</Text>
        <Ionicons name="time-outline" size={20} color="gray" style={{ marginLeft: 10 }} />
        <Text style={styles.detailText}>{MOCK_EVENT.details.time}</Text>
      </View>

      <Text style={styles.sectionTitle}>Related Products</Text>
      <FlatList
        horizontal
        data={MOCK_EVENT.relatedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productTag}>{item.tag}</Text>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productTitle}>{item.title}</Text>
            <Text style={styles.productPrice}>Price: {item.price}</Text>
          </View>
        )}
      />

      {/* Customer Reviews */}
      <Text style={styles.sectionTitle}>Customer Reviews</Text>
      <FlatList
        horizontal
        data={MOCK_EVENT.reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Image source={{ uri: item.avatar }} style={styles.reviewAvatar} />
            <Text style={styles.reviewUser}>{item.user}</Text>
            <Text>{item.comment}</Text>
          </View>
        )}
      />

      {/* Buttons */}
      <TouchableOpacity style={styles.shareButton}>
        <Text>Share</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addCalendarButton}>
        <Text>Add to Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Buy a Ticket</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  reviewButton: { backgroundColor: "black", padding: 8, borderRadius: 5 },
  reviewText: { color: "white" },
  eventInfo: { marginBottom: 10 },
  eventTitle: { fontSize: 20, fontWeight: "bold" },
  eventCategory: { color: "gray" },
  descriptionContainer: { flexDirection: "row", marginBottom: 10 },
  eventImage: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
  aboutContainer: { flex: 1 },
  aboutTitle: { fontWeight: "bold" },
  tagContainer: { flexDirection: "row", marginTop: 5 },
  tag: { backgroundColor: "#ddd", padding: 5, borderRadius: 5, marginRight: 5 },
  description: { marginTop: 5 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10 },
  mainEventImage: { width: "100%", height: 200, borderRadius: 10 },
  detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  detailText: { marginLeft: 5 },
  productCard: { padding: 10, marginRight: 10, borderWidth: 1, borderRadius: 10 },
  productImage: { width: 80, height: 80 },
  productTitle: { fontWeight: "bold" },
  reviewCard: { padding: 10, borderWidth: 1, borderRadius: 10, marginRight: 10 },
  reviewAvatar: { width: 30, height: 30, borderRadius: 15 },
  buyButton: { backgroundColor: "black", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
});

export default EventDetailScreen;
