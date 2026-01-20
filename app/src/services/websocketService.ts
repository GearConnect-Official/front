/**
 * WebSocket Service pour la messagerie en temps réel
 * 
 * Ce service gère la connexion WebSocket avec le serveur pour recevoir
 * les messages en temps réel sans avoir besoin de polling.
 * 
 * UTILISATION :
 * 1. Appeler connect() au démarrage de l'app ou quand l'utilisateur se connecte
 * 2. Appeler joinConversation(id) quand l'utilisateur ouvre une conversation
 * 3. Appeler leaveConversation(id) quand l'utilisateur quitte une conversation
 * 4. S'abonner aux événements avec onNewMessage(), onMessageUpdated(), etc.
 */

import { API_URL_USERS } from '../config';

// Extraire l'URL de base pour le WebSocket
const getWebSocketUrl = (): string => {
  // Remplacer http:// par ws:// et https:// par wss://
  const baseUrl = API_URL_USERS.replace('/api/users', '').replace('http://', 'ws://').replace('https://', 'wss://');
  return `${baseUrl}/ws`;
};

// Types pour les messages WebSocket
interface WSMessage {
  type: 'join' | 'leave' | 'ping';
  conversationId?: number;
  groupId?: number;
  userId?: number;
}

interface WSNotification {
  type: 'new_message' | 'message_updated' | 'message_deleted' | 'pong';
  message?: any;
  messageId?: number;
  conversationId?: number;
  groupId?: number;
}

type MessageCallback = (message: any, conversationId?: number, groupId?: number) => void;
type DeleteCallback = (messageId: number, conversationId?: number, groupId?: number) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000; // 2 secondes
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isConnecting = false;
  private pendingMessages: WSMessage[] = []; // Queue for messages while connecting
  
  // Callbacks pour les événements
  private onNewMessageCallbacks: Set<MessageCallback> = new Set();
  private onMessageUpdatedCallbacks: Set<MessageCallback> = new Set();
  private onMessageDeletedCallbacks: Set<DeleteCallback> = new Set();
  private onConnectionChangeCallbacks: Set<(connected: boolean) => void> = new Set();

  // État de la connexion
  private _isConnected = false;
  
  get isConnected(): boolean {
    return this._isConnected;
  }

  /**
   * Se connecter au serveur WebSocket
   */
  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log('🔌 WebSocket already connected or connecting');
      return;
    }

    this.isConnecting = true;
    const wsUrl = getWebSocketUrl();
    console.log('🔌 Connecting to WebSocket:', wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected');
        this._isConnected = true;
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
        this.startPing();
        
        // Send any pending messages that were queued while connecting
        if (this.pendingMessages.length > 0) {
          console.log(`📤 Sending ${this.pendingMessages.length} pending messages`);
          this.pendingMessages.forEach(msg => {
            this.ws?.send(JSON.stringify(msg));
          });
          this.pendingMessages = [];
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WSNotification = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        this._isConnected = false;
        this.isConnecting = false;
        this.notifyConnectionChange(false);
        this.stopPing();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  /**
   * Se déconnecter du serveur WebSocket
   */
  disconnect(): void {
    this.stopPing();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this._isConnected = false;
    this.reconnectAttempts = this.maxReconnectAttempts; // Empêcher la reconnexion
  }

  /**
   * Rejoindre une conversation pour recevoir ses messages
   */
  joinConversation(conversationId: number): void {
    this.send({ type: 'join', conversationId });
    console.log(`👤 Joined conversation: ${conversationId}`);
  }

  /**
   * Quitter une conversation
   */
  leaveConversation(conversationId: number): void {
    this.send({ type: 'leave', conversationId });
    console.log(`👋 Left conversation: ${conversationId}`);
  }

  /**
   * Rejoindre un groupe pour recevoir ses messages
   */
  joinGroup(groupId: number): void {
    this.send({ type: 'join', groupId });
    console.log(`👤 Joined group: ${groupId}`);
  }

  /**
   * Quitter un groupe
   */
  leaveGroup(groupId: number): void {
    this.send({ type: 'leave', groupId });
    console.log(`👋 Left group: ${groupId}`);
  }

  /**
   * S'abonner aux nouveaux messages
   */
  onNewMessage(callback: MessageCallback): () => void {
    this.onNewMessageCallbacks.add(callback);
    return () => this.onNewMessageCallbacks.delete(callback);
  }

  /**
   * S'abonner aux messages mis à jour
   */
  onMessageUpdated(callback: MessageCallback): () => void {
    this.onMessageUpdatedCallbacks.add(callback);
    return () => this.onMessageUpdatedCallbacks.delete(callback);
  }

  /**
   * S'abonner aux messages supprimés
   */
  onMessageDeleted(callback: DeleteCallback): () => void {
    this.onMessageDeletedCallbacks.add(callback);
    return () => this.onMessageDeletedCallbacks.delete(callback);
  }

  /**
   * S'abonner aux changements de connexion
   */
  onConnectionChange(callback: (connected: boolean) => void): () => void {
    this.onConnectionChangeCallbacks.add(callback);
    return () => this.onConnectionChangeCallbacks.delete(callback);
  }

  // ========== Méthodes privées ==========

  private send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else if (this.isConnecting) {
      // Queue the message to be sent when connected
      console.log('📥 Queueing message while connecting:', message.type);
      this.pendingMessages.push(message);
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message. Attempting to connect...');
      this.pendingMessages.push(message);
      this.connect();
    }
  }

  private handleMessage(data: WSNotification): void {
    switch (data.type) {
      case 'new_message':
        console.log('📨 New message received via WebSocket');
        this.onNewMessageCallbacks.forEach(cb => 
          cb(data.message, data.conversationId, data.groupId)
        );
        break;

      case 'message_updated':
        console.log('✏️ Message updated via WebSocket');
        this.onMessageUpdatedCallbacks.forEach(cb => 
          cb(data.message, data.conversationId, data.groupId)
        );
        break;

      case 'message_deleted':
        console.log('🗑️ Message deleted via WebSocket');
        if (data.messageId) {
          this.onMessageDeletedCallbacks.forEach(cb => 
            cb(data.messageId!, data.conversationId, data.groupId)
          );
        }
        break;

      case 'pong':
        // Réponse au ping, rien à faire
        break;
    }
  }

  private notifyConnectionChange(connected: boolean): void {
    this.onConnectionChangeCallbacks.forEach(cb => cb(connected));
  }

  private startPing(): void {
    // Envoyer un ping toutes les 30 secondes pour garder la connexion active
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('❌ Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

// Export une instance singleton
const websocketService = new WebSocketService();
export default websocketService;
