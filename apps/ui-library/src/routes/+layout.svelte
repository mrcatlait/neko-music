<script lang="ts">
  import { UiContext } from '@/shared/contexts'
  import '../lib/styles/main.scss'

  const { children } = $props()
</script>

<UiContext>
  {@render children()}
</UiContext>
