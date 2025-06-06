<script lang="ts">
  import { CollectionMetadataState, type CollectionMetadata } from '../states/collection-metadata.state.svelte';
  import { onMount } from 'svelte';

  // Initialize state with service
  const collectionState = new CollectionMetadataState({
    async getUserCollections() {
      // API call returns only metadata - no tracks
      const response = await fetch('/api/collections');
      return response.json();
    },
    
    async getCollectionTracks(collectionId: string) {
      // Load tracks only when needed
      const response = await fetch(`/api/collections/${collectionId}/tracks`);
      return response.json();
    },
    
    async getCollectionPreview(collectionId: string, count: number) {
      // Get just a few tracks for quick preview
      const response = await fetch(`/api/collections/${collectionId}/preview?count=${count}`);
      return response.json();
    },
    
    // ... other service methods
  } as any);

  // Load collections on mount - FAST because no tracks included
  onMount(() => {
    collectionState.loadUserCollections();
  });

  // Handle play collection - loads tracks on-demand
  async function handlePlayCollection(collection: CollectionMetadata) {
    const result = await collectionState.playCollection(collection.id);
    if (result) {
      // Now we have both metadata and tracks
      console.log('Playing collection:', result.collection.name);
      console.log('Track count:', result.tracks.length);
      
      // Pass to playback system
      // playbackState.startPlayback(result.tracks, result.collection);
    }
  }

  // Handle shuffle play - loads and shuffles tracks
  async function handleShufflePlay(collection: CollectionMetadata) {
    const result = await collectionState.shufflePlayCollection(collection.id);
    if (result) {
      console.log('Shuffle playing:', result.collection.name);
      // playbackState.startPlayback(result.tracks, result.collection, { shuffle: true });
    }
  }
</script>

<!-- Ultra-fast initial render - only metadata needed -->
<div class="collections-grid">
  {#if collectionState.isLoadingCollections}
    <div class="loading">Loading your music...</div>
  {:else}
    <!-- Search and filters -->
    <div class="controls">
      <input 
        bind:value={collectionState.searchQuery}
        placeholder="Search collections..."
        class="search-input"
      />
      
      <select bind:value={collectionState.selectedType}>
        <option value="all">All Types</option>
        <option value="album">Albums</option>
        <option value="playlist">Playlists</option>
        <option value="collection">Collections</option>
      </select>
    </div>

    <!-- Collection grid - renders immediately with metadata -->
    {#each collectionState.filteredCollections as collection (collection.id)}
      <div class="collection-card">
        <!-- Artwork loads independently -->
        {#if collection.artwork}
          <img 
            src={collection.artwork.url} 
            alt={collection.name}
            class="artwork"
            style="background-color: {collection.artwork.background_color}"
          />
        {/if}
        
        <!-- Metadata available immediately -->
        <div class="info">
          <h3>{collection.name}</h3>
          <p class="details">
            {collection.trackCount} tracks • 
            {collectionState.getTotalDuration(collection.id)}
          </p>
          {#if collection.description}
            <p class="description">{collection.description}</p>
          {/if}
        </div>
        
        <!-- Action buttons -->
        <div class="actions">
          <!-- Play button - loads tracks on demand -->
          <button 
            onclick={() => handlePlayCollection(collection)}
            disabled={collectionState.isLoadingTracks}
            class="play-btn"
          >
            {#if collectionState.isLoadingTracks}
              Loading...
            {:else}
              ▶ Play
            {/if}
          </button>
          
          <!-- Shuffle button -->
          <button 
            onclick={() => handleShufflePlay(collection)}
            disabled={collectionState.isLoadingTracks}
            class="shuffle-btn"
          >
            🔀 Shuffle
          </button>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .collections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
    padding: 1rem;
  }

  .controls {
    grid-column: 1 / -1;
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .search-input, select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .collection-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .artwork {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 4px;
  }

  .info h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .details {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }

  .description {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: auto;
  }

  .play-btn, .shuffle-btn {
    flex: 1;
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .play-btn {
    background: #1db954;
    color: white;
  }

  .shuffle-btn {
    background: #f0f0f0;
    color: #333;
  }

  .play-btn:disabled, .shuffle-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #666;
  }
</style> 