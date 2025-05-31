import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PostItem, { Post, PostTag } from './PostItem';

/**
 * PostExample Component
 * 
 * Demonstrates the new optimized post structure with:
 * - Clear title separation
 * - Smart description truncation  
 * - Interactive tags
 * - Enhanced publication time display
 * 
 * This follows major social media platform best practices
 */

const PostExample: React.FC = () => {
  // Example post data with the new optimized structure
  const examplePosts: Post[] = [
    {
      id: "demo_1",
      username: "racing_pro",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"],
      title: "First Win of the Season! 🏆",
      description: "What an incredible race today at Monza Circuit! After months of preparation and hard work with the team, we finally achieved our first victory of the season. The weather was challenging, but our strategy paid off perfectly. Huge thanks to everyone who supported us - this is just the beginning!",
      tags: [
        { id: "t1", name: "racing" },
        { id: "t2", name: "victory" },
        { id: "t3", name: "monza" },
        { id: "t4", name: "f1" },
        { id: "t5", name: "motorsport" },
        { id: "t6", name: "teamwork" }
      ],
      likes: 1247,
      liked: false,
      saved: false,
      comments: [],
      timeAgo: "3h",
    },
    {
      id: "demo_2", 
      username: "tech_mechanic",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      images: ["https://images.unsplash.com/photo-1558617979-b4d3d20128ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"],
      title: "Behind the Scenes: Engine Tuning",
      description: "Most people see the glamorous side of racing, but here's where the real magic happens. Spending 12+ hours fine-tuning this V8 engine to perfection. Every adjustment matters when you're pushing 300+ mph on the track.",
      tags: [
        { id: "t7", name: "engineering" },
        { id: "t8", name: "mechanics" },
        { id: "t9", name: "behindthescenes" }
      ],
      likes: 892,
      liked: true,
      saved: true,
      comments: [],
      timeAgo: "1d",
    }
  ];

  // Mock handlers for demonstration
  const handleLike = (postId: string) => console.log(`Liked post: ${postId}`);
  const handleSave = (postId: string) => console.log(`Saved post: ${postId}`);
  const handleComment = (postId: string) => console.log(`Comment on post: ${postId}`);
  const handleShare = (postId: string) => console.log(`Shared post: ${postId}`);
  const handleProfilePress = (username: string) => console.log(`View profile: ${username}`);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Optimized Post Display</Text>
        <Text style={styles.headerSubtitle}>
          Enhanced content structure with separated title, description, tags, and publication date
        </Text>
      </View>

      {examplePosts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          onLike={handleLike}
          onSave={handleSave}
          onComment={handleComment}
          onShare={handleShare}
          onProfilePress={handleProfilePress}
          currentUsername="current_user"
        />
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ✨ Features demonstrated:
        </Text>
        <Text style={styles.featureText}>• Bold, prominent titles</Text>
        <Text style={styles.featureText}>• Smart description truncation with "See more"</Text>
        <Text style={styles.featureText}>• Interactive hashtags with limit display</Text>
        <Text style={styles.featureText}>• Enhanced time display with icon</Text>
        <Text style={styles.featureText}>• Optimized typography hierarchy</Text>
        <Text style={styles.featureText}>• Social media platform best practices</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E8E',
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#262626',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#262626',
    marginBottom: 6,
    paddingLeft: 8,
  },
});

export default PostExample; 