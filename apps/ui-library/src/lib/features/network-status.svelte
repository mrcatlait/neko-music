<script lang="ts">
  import { onMount } from 'svelte'
  import { trackCacheService } from '@/shared/services'

  type NetworkStatus = 'online' | 'offline' | 'slow' | 'unstable'

  let networkStatus = $state<NetworkStatus>('online')
  let isVisible = $state(false)
  let connectionSpeed = $state<number | null>(null)
  let lastTest = $state<Date | null>(null)
  let hideTimeout: ReturnType<typeof setTimeout> | null = null

  // Connection test endpoint - small response for speed testing
  const testEndpoint = '/api/health'

  // Test connection speed
  const testConnection = async (): Promise<number> => {
    const start = performance.now()
    try {
      const response = await fetch(testEndpoint, {
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Connection test failed')
      }

      const end = performance.now()
      return end - start
    } catch (error) {
      console.error('Connection test failed:', error)
      return -1
    }
  }

  // Update network status based on connection speed
  const updateNetworkStatus = (speed: number) => {
    let newStatus: NetworkStatus

    if (speed === -1) {
      newStatus = 'offline'
    } else if (speed > 3000) {
      newStatus = 'slow'
    } else if (speed > 1000) {
      newStatus = 'unstable'
    } else {
      newStatus = 'online'
    }

    if (newStatus !== networkStatus) {
      networkStatus = newStatus
      connectionSpeed = speed === -1 ? null : speed
      lastTest = new Date()

      // Show notification for non-optimal connections
      if (newStatus !== 'online') {
        showNotification()
      } else {
        hideNotification()
      }
    }
  }

  // Show network status notification
  const showNotification = () => {
    isVisible = true

    // Clear existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    // Auto-hide after 5 seconds for non-critical issues
    if (networkStatus !== 'offline') {
      hideTimeout = setTimeout(() => {
        hideNotification()
      }, 5000)
    }
  }

  // Hide network status notification
  const hideNotification = () => {
    isVisible = false
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  // Retry connection test
  const retryConnection = async () => {
    const speed = await testConnection()
    updateNetworkStatus(speed)
  }

  // Clear cache on network issues
  const clearCacheAndRetry = () => {
    trackCacheService.clearCache()
    retryConnection()
  }

  // Monitor connection periodically
  onMount(() => {
    // Initial connection test
    testConnection().then(updateNetworkStatus)

    // Periodic connection monitoring
    const interval = setInterval(async () => {
      const speed = await testConnection()
      updateNetworkStatus(speed)
    }, 30000) // Test every 30 seconds

    // Listen for online/offline events
    const handleOnline = () => {
      testConnection().then(updateNetworkStatus)
    }

    const handleOffline = () => {
      updateNetworkStatus(-1)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }
  })

  // Get status message and icon
  const getStatusInfo = (status: NetworkStatus) => {
    switch (status) {
      case 'offline':
        return {
          icon: 'wifi_off',
          message: 'No internet connection',
          color: 'error',
          persistent: true,
        }
      case 'slow':
        return {
          icon: 'signal_wifi_1_bar',
          message: 'Slow connection detected',
          color: 'warning',
          persistent: false,
        }
      case 'unstable':
        return {
          icon: 'signal_wifi_2_bar',
          message: 'Unstable connection',
          color: 'warning',
          persistent: false,
        }
      default:
        return {
          icon: 'wifi',
          message: 'Connected',
          color: 'success',
          persistent: false,
        }
    }
  }

  $: statusInfo = getStatusInfo(networkStatus)
</script>

{#if isVisible}
  <div
    class="network-status"
    class:error={statusInfo.color === 'error'}
    class:warning={statusInfo.color === 'warning'}
    class:success={statusInfo.color === 'success'}
    role="alert"
    aria-live="polite"
  >
    <div class="network-status__content">
      <i class="network-status__icon">{statusInfo.icon}</i>

      <div class="network-status__text">
        <span class="network-status__message">{statusInfo.message}</span>

        {#if connectionSpeed !== null}
          <small class="network-status__speed">
            {Math.round(connectionSpeed)}ms response time
          </small>
        {/if}
      </div>

      <div class="network-status__actions">
        {#if networkStatus === 'offline'}
          <button
            onclick={retryConnection}
            class="network-status__button"
          >
            <i>refresh</i>
            Retry
          </button>
        {:else if networkStatus !== 'online'}
          <button
            onclick={clearCacheAndRetry}
            class="network-status__button"
          >
            <i>clear_all</i>
            Clear Cache
          </button>
        {/if}

        {#if !statusInfo.persistent}
          <button
            onclick={hideNotification}
            class="network-status__close"
          >
            <i>close</i>
          </button>
        {/if}
      </div>
    </div>

    {#if lastTest}
      <div class="network-status__timestamp">
        Last checked: {lastTest.toLocaleTimeString()}
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  .network-status {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 1000;
    min-width: 300px;
    max-width: 400px;
    background: var(--color-surface);
    border-radius: var(--shape-corner-medium);
    box-shadow: var(--elevation-3);
    backdrop-filter: blur(10px);
    animation: slideIn 0.3s ease;

    &.error {
      background: rgba(255, 0, 0, 0.1);
      border: 1px solid rgba(255, 0, 0, 0.3);
    }

    &.warning {
      background: rgba(255, 165, 0, 0.1);
      border: 1px solid rgba(255, 165, 0, 0.3);
    }

    &.success {
      background: rgba(0, 255, 0, 0.1);
      border: 1px solid rgba(0, 255, 0, 0.3);
    }

    &__content {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
    }

    &__icon {
      font-size: 24px;
      color: var(--color-text-medium-emphasis);

      .error & {
        color: var(--color-error, #ff4444);
      }

      .warning & {
        color: var(--color-warning, #ff8800);
      }

      .success & {
        color: var(--color-success, #00aa00);
      }
    }

    &__text {
      flex: 1;
      min-width: 0;
    }

    &__message {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: var(--color-text-high-emphasis);
      margin-bottom: 2px;
    }

    &__speed {
      display: block;
      font-size: 12px;
      color: var(--color-text-medium-emphasis);
      opacity: 0.8;
    }

    &__actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: var(--color-primary);
      color: white;
      border: none;
      border-radius: var(--shape-corner-small);
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--color-primary-dark);
      }

      i {
        font-size: 16px;
      }
    }

    &__close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: none;
      border: none;
      color: var(--color-text-medium-emphasis);
      cursor: pointer;
      border-radius: var(--shape-corner-small);
      transition: background 0.2s ease;

      &:hover {
        background: var(--color-surface-variant);
      }

      i {
        font-size: 16px;
      }
    }

    &__timestamp {
      padding: 8px 16px;
      font-size: 11px;
      color: var(--color-text-medium-emphasis);
      border-top: 1px solid var(--color-outline-variant);
      background: var(--color-surface-variant);
      border-radius: 0 0 var(--shape-corner-medium) var(--shape-corner-medium);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @media (max-width: 640px) {
    .network-status {
      left: 16px;
      right: 16px;
      min-width: auto;
      max-width: none;
    }
  }
</style>
