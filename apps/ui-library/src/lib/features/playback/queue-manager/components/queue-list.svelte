<script lang="ts">
  import type { Track } from '@/shared/models'
  import TrackItem from './track-item.svelte'

  let {
    tracks = [],
    title = 'Continue Playing',
    subtitle = '',
    onTrackClick,
    onTrackRemove,
  } = $props<{
    tracks: Track[]
    title?: string
    subtitle?: string
    onTrackClick: (trackId: string) => void
    onTrackRemove: (trackId: string) => void
  }>()
</script>

<section
  class="queue-list"
  role="region"
  aria-label={title}
>
  <header class="queue-list__header">
    <h2 class="queue-list__title">{title}</h2>
    {#if subtitle}
      <p class="queue-list__subtitle">{subtitle}</p>
    {/if}
  </header>

  {#if tracks.length > 0}
    <ul
      class="queue-list__items"
      role="list"
    >
      {#each tracks as track, index (track.id)}
        <li role="listitem">
          <TrackItem
            {track}
            {index}
            onPlay={() => onTrackClick(track.id)}
            onRemove={() => onTrackRemove(track.id)}
          />
        </li>
      {/each}
    </ul>
  {:else}
    <div class="queue-list__empty">
      <p>No tracks in queue</p>
    </div>
  {/if}
</section>

<style lang="scss">
  .queue-list {
    &__header {
      margin-bottom: 1.5rem;
    }

    &__title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-on-surface);
      margin: 0 0 0.5rem 0;
    }

    &__subtitle {
      font-size: 1rem;
      color: var(--color-text-medium-emphasis);
      margin: 0;
    }

    &__items {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &__empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: var(--color-text-medium-emphasis);
      font-size: 1rem;
    }
  }
</style>
