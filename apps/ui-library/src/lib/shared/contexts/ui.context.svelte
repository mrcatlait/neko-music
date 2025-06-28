<script
  lang="ts"
  module
>
  import { createContext } from '../hooks'
  import { UiState } from '../states'

  export const UI_CONTEXT_KEY = 'ui'

  const { get, set } = createContext<UiState>(UI_CONTEXT_KEY)

  export { get as getUiState }
</script>

<script lang="ts">
  const { children } = $props()

  set(new UiState())
</script>

{@render children?.()}
