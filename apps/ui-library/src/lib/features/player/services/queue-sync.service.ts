import type { Queue, QueueItem, QueueType } from '../states/queue.state.svelte';
import type { Track } from '@/shared/models';

// Backend integration patterns for different queue scenarios

export interface QueueSyncEvent {
  type: 'queue_created' | 'queue_updated' | 'queue_deleted' | 'item_added' | 'item_removed' | 'playback_position' | 'queue_switched';
  queueId: string;
  userId?: string;
  deviceId?: string;
  timestamp: Date;
  data: any;
}

export interface BackendQueueState {
  id: string;
  name: string;
  type: QueueType;
  tracks: string[]; // Track IDs
  currentPosition?: number;
  metadata: Record<string, any>;
  collaborators?: string[];
  lastModified: Date;
  deviceId?: string;
}

export interface PlaybackState {
  queueId: string;
  currentTrackId?: string;
  position: number;
  isPlaying: boolean;
  timestamp: Date;
  deviceId: string;
}

export class QueueSyncService {
  private ws: WebSocket | null = null;
  private reconnectInterval = 5000;
  private maxReconnectAttempts = 5;
  private reconnectAttempts = 0;

  constructor(
    private apiBaseUrl: string,
    private userId: string,
    private deviceId: string,
    private authToken: string
  ) {}

  // === 1. CROSS-DEVICE CONTINUITY ===
  // Real-time sync of playback state across devices
  async syncPlaybackStateAcrossDevices(playbackState: PlaybackState): Promise<void> {
    // REST API to persist state
    await this.apiCall('PUT', `/users/${this.userId}/playback-state`, {
      ...playbackState,
      deviceId: this.deviceId,
      timestamp: new Date()
    });

    // Real-time notification to other devices
    this.sendWebSocketMessage({
      type: 'playback_position',
      queueId: playbackState.queueId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: playbackState
    });
  }

  async getPlaybackStateFromOtherDevices(): Promise<PlaybackState | null> {
    try {
      const response = await this.apiCall('GET', `/users/${this.userId}/playback-state?exclude_device=${this.deviceId}`);
      return response.data || null;
    } catch {
      return null;
    }
  }

  // === 2. COLLABORATIVE PLAYLISTS / SOCIAL FEATURES ===
  // Real-time collaborative queue management
  async createCollaborativeQueue(name: string, tracks: Track[]): Promise<Queue> {
    const response = await this.apiCall('POST', '/queues/collaborative', {
      name,
      type: 'collaborative',
      tracks: tracks.map(t => t.id),
      createdBy: this.userId,
      collaborators: [this.userId]
    });

    // Subscribe to real-time updates for this queue
    this.subscribeToQueueUpdates(response.data.id);
    
    return this.mapBackendQueueToFrontend(response.data);
  }

  async addCollaborator(queueId: string, userId: string): Promise<void> {
    await this.apiCall('POST', `/queues/${queueId}/collaborators`, { userId });
    
    this.sendWebSocketMessage({
      type: 'queue_updated',
      queueId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { action: 'collaborator_added', collaboratorId: userId }
    });
  }

  async addToCollaborativeQueue(queueId: string, tracks: Track[], position?: number): Promise<void> {
    const response = await this.apiCall('POST', `/queues/${queueId}/tracks`, {
      tracks: tracks.map(t => t.id),
      position,
      addedBy: this.userId
    });

    // Real-time notification to all collaborators
    this.sendWebSocketMessage({
      type: 'item_added',
      queueId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { tracks: response.data.tracks, position }
    });
  }

  // === 3. RADIO STATIONS + INFINITE QUEUES ===
  // Stream-based queue loading for radio
  async initializeRadioQueue(stationId: string): Promise<Queue> {
    const response = await this.apiCall('POST', `/radio/${stationId}/queue`, {
      deviceId: this.deviceId,
      preferences: await this.getUserPreferences()
    });

    return this.mapBackendQueueToFrontend(response.data);
  }

  async getMoreRadioTracks(queueId: string, count: number = 10): Promise<Track[]> {
    const response = await this.apiCall('GET', `/queues/${queueId}/extend?count=${count}`);
    return response.data.tracks;
  }

  // Preload next batch when queue is running low
  async preloadRadioTracks(queueId: string): Promise<void> {
    const tracks = await this.getMoreRadioTracks(queueId, 5);
    
    this.sendWebSocketMessage({
      type: 'item_added',
      queueId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { tracks, append: true }
    });
  }

  // === 4. RECOMMENDATION CONTEXTS ===
  // Context-aware recommendation queues
  async generateRecommendationQueue(context: string, seedTracks?: string[]): Promise<Queue> {
    const response = await this.apiCall('POST', '/recommendations/queue', {
      context, // 'discover_weekly', 'daily_mix_1', 'album_radio', etc.
      seedTracks,
      userId: this.userId,
      listeningHistory: await this.getRecentListeningHistory(),
      preferences: await this.getUserPreferences()
    });

    return this.mapBackendQueueToFrontend(response.data);
  }

  async refreshRecommendations(queueId: string): Promise<Track[]> {
    const response = await this.apiCall('POST', `/queues/${queueId}/refresh`);
    return response.data.tracks;
  }

  // === 5. SMART CONTEXT SWITCHING ===
  // Location/activity-based queue suggestions
  async getContextualQueues(context: { location?: string; activity?: string; timeOfDay?: string }): Promise<Queue[]> {
    const response = await this.apiCall('POST', '/queues/contextual', {
      context,
      userId: this.userId,
      deviceId: this.deviceId
    });

    return response.data.queues.map(this.mapBackendQueueToFrontend);
  }

  async reportContextChange(context: any): Promise<void> {
    await this.apiCall('POST', `/users/${this.userId}/context`, {
      ...context,
      deviceId: this.deviceId,
      timestamp: new Date()
    });
  }

  // === 6. OFFLINE / CACHING STRATEGIES ===
  // Offline-first queue management
  async syncOfflineQueues(): Promise<void> {
    // Get local changes
    const localChanges = await this.getLocalQueueChanges();
    
    // Resolve conflicts with server
    for (const change of localChanges) {
      try {
        await this.syncQueueChange(change);
      } catch (error) {
        // Handle conflict resolution
        await this.resolveQueueConflict(change, error);
      }
    }

    // Download updated queues
    await this.downloadQueueUpdates();
  }

  async cacheQueueForOffline(queueId: string): Promise<void> {
    const queue = await this.apiCall('GET', `/queues/${queueId}/full`);
    const tracks = await this.apiCall('GET', `/queues/${queueId}/tracks/downloadable`);
    
    // Store in local cache
    await this.storeLocalQueue(queue.data, tracks.data);
  }

  // === 7. LIVE EVENTS / SHARED LISTENING ===
  // Real-time shared listening sessions
  async createListeningParty(queueId: string): Promise<string> {
    const response = await this.apiCall('POST', '/listening-parties', {
      queueId,
      hostId: this.userId,
      isPublic: false
    });

    // Subscribe to party events
    this.subscribeToPartyUpdates(response.data.partyId);
    
    return response.data.partyId;
  }

  async joinListeningParty(partyId: string): Promise<void> {
    await this.apiCall('POST', `/listening-parties/${partyId}/join`, {
      userId: this.userId,
      deviceId: this.deviceId
    });

    this.subscribeToPartyUpdates(partyId);
  }

  async syncPartyPlayback(partyId: string, position: number, isPlaying: boolean): Promise<void> {
    this.sendWebSocketMessage({
      type: 'playback_position',
      queueId: partyId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { position, isPlaying, partyId }
    });
  }

  // === WEBSOCKET MANAGEMENT ===
  connectWebSocket(): void {
    if (this.ws) return;

    const wsUrl = this.apiBaseUrl.replace('http', 'ws') + `/ws?token=${this.authToken}&device=${this.deviceId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('Queue sync WebSocket connected');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const syncEvent: QueueSyncEvent = JSON.parse(event.data);
      this.handleSyncEvent(syncEvent);
    };

    this.ws.onclose = () => {
      console.log('Queue sync WebSocket disconnected');
      this.scheduleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('Queue sync WebSocket error:', error);
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connectWebSocket();
      }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts));
    }
  }

  private sendWebSocketMessage(event: QueueSyncEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  // === EVENT HANDLERS ===
  private handleSyncEvent(event: QueueSyncEvent): void {
    // Emit events for the QueueState to handle
    switch (event.type) {
      case 'queue_created':
        this.onQueueCreated?.(event);
        break;
      case 'queue_updated':
        this.onQueueUpdated?.(event);
        break;
      case 'item_added':
        this.onItemAdded?.(event);
        break;
      case 'playback_position':
        this.onPlaybackSync?.(event);
        break;
    }
  }

  // Event callbacks - to be set by QueueState
  onQueueCreated?: (event: QueueSyncEvent) => void;
  onQueueUpdated?: (event: QueueSyncEvent) => void;
  onItemAdded?: (event: QueueSyncEvent) => void;
  onPlaybackSync?: (event: QueueSyncEvent) => void;

  // === UTILITY METHODS ===
  private async apiCall(method: string, endpoint: string, data?: any): Promise<any> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.authToken}`,
        'X-Device-ID': this.deviceId,
        'X-User-ID': this.userId
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private mapBackendQueueToFrontend(backendQueue: BackendQueueState): Queue {
    return {
      id: backendQueue.id,
      name: backendQueue.name,
      type: backendQueue.type,
      items: [], // Items would be loaded separately
      createdAt: new Date(backendQueue.lastModified),
      metadata: backendQueue.metadata
    };
  }

  private subscribeToQueueUpdates(queueId: string): void {
    this.sendWebSocketMessage({
      type: 'queue_updated',
      queueId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { action: 'subscribe' }
    });
  }

  private subscribeToPartyUpdates(partyId: string): void {
    this.sendWebSocketMessage({
      type: 'queue_updated',
      queueId: partyId,
      userId: this.userId,
      deviceId: this.deviceId,
      timestamp: new Date(),
      data: { action: 'subscribe_party' }
    });
  }

  // Placeholder methods - would be implemented based on your storage strategy
  private async getUserPreferences(): Promise<any> { return {}; }
  private async getRecentListeningHistory(): Promise<any[]> { return []; }
  private async getLocalQueueChanges(): Promise<any[]> { return []; }
  private async syncQueueChange(change: any): Promise<void> {}
  private async resolveQueueConflict(change: any, error: any): Promise<void> {}
  private async downloadQueueUpdates(): Promise<void> {}
  private async storeLocalQueue(queue: any, tracks: any): Promise<void> {}
} 