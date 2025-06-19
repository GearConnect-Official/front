import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import theme from "../src/styles/config/theme";
import { conversationScreenStyles as styles } from "../src/styles/screens";
import { MessageService } from "../src/services/messageService";
import { useAuth } from "../src/context/AuthContext";
import { useMessage } from "../src/context/MessageContext";

// Types pour les messages
interface User {
  id: number;
  name: string;
  username: string;
  profilePicture?: string;
  isVerify: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: User;
  createdAt: string;
  isOwn: boolean;
}

export default function ConversationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const { showError } = useMessage();
  const conversationId = params.conversationId as string;
  const conversationName =
    (params.conversationName as string) || "Conversation";

  // Charger les messages depuis l'API
  const loadMessages = async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const data = await MessageService.getMessages(Number(conversationId));
      setMessages(data);
    } catch (error: any) {
      showError?.(
        error?.response?.data?.error ||
          error?.message ||
          "Erreur lors du chargement des messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  // Faire défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;
    const messageContent = newMessage.trim();
    setNewMessage("");
    try {
      const sent = await MessageService.sendMessage(
        Number(conversationId),
        messageContent
      );
      setMessages((prev) => [...prev, sent]);
    } catch (error: any) {
      showError?.(
        error?.response?.data?.error ||
          error?.message ||
          "Erreur lors de l'envoi du message"
      );
    }
  };

  // Fonction pour formater l'heure
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Rendu d'un message
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isOwn = item.isOwn;
    const showAvatar =
      !isOwn &&
      (index === 0 || messages[index - 1]?.sender.id !== item.sender.id);
    const showTime =
      index === messages.length - 1 ||
      messages[index + 1]?.sender.id !== item.sender.id ||
      new Date(messages[index + 1]?.createdAt).getTime() -
        new Date(item.createdAt).getTime() >
        300000; // 5 min

    return (
      <View
        style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}
      >
        {/* Avatar pour les messages des autres */}
        {showAvatar && (
          <View style={styles.avatarContainer}>
            {item.sender.profilePicture ? (
              <Image
                source={{ uri: item.sender.profilePicture }}
                style={styles.messageAvatar}
              />
            ) : (
              <View style={[styles.messageAvatar, styles.defaultMessageAvatar]}>
                <FontAwesome
                  name="user"
                  size={16}
                  color={theme.colors.text.secondary}
                />
              </View>
            )}
          </View>
        )}

        {/* Message */}
        <View
          style={[
            styles.messageBubble,
            isOwn ? styles.ownMessageBubble : styles.otherMessageBubble,
            !showAvatar && !isOwn && styles.messageWithoutAvatar,
          ]}
        >
          <Text style={[styles.messageText, isOwn && styles.ownMessageText]}>
            {item.content}
          </Text>
        </View>

        {/* Heure */}
        {showTime && (
          <Text style={[styles.messageTime, isOwn && styles.ownMessageTime]}>
            {formatTime(item.createdAt)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#E10600" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {conversationName}
          </Text>
          <Text style={styles.headerSubtitle}>En ligne</Text>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome
            name="ellipsis-v"
            size={16}
            color={theme.colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Liste des messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Zone de saisie */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Tapez votre message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              newMessage.trim() && styles.sendButtonActive,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || loading}
          >
            <FontAwesome
              name="send"
              size={16}
              color={newMessage.trim() ? "white" : theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
