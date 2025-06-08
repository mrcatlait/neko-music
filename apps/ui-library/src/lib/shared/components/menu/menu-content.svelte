<script lang="ts">
  import clsx from 'clsx'
  import { DropdownMenu } from 'bits-ui'

  let {
    ref = $bindable(null),
    sideOffset = 4,
    portalProps,
    class: className,
    ...restProps
  }: DropdownMenu.ContentProps & {
    portalProps?: DropdownMenu.PortalProps
  } = $props()
</script>

<DropdownMenu.Portal {...portalProps}>
  <DropdownMenu.Content
    bind:ref
    data-slot="dropdown-menu-content"
    {sideOffset}
    class={clsx('dropdown-menu-content', className)}
    {...restProps}
  />
</DropdownMenu.Portal>

<style lang="scss">
  @use '../../../styles/abstracts' as abstracts;

  :global(.dropdown-menu-content) {
    // Base styles
    background-color: var(--color-surface-container-high);
    color: var(--color-text-high-emphasis);
    min-width: 112px;
    max-width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: var(--shape-corner-extra-small);
    border: 1px solid var(--color-outline-variant);

    // Use CSS custom properties from bits-ui
    max-height: var(--bits-dropdown-menu-content-available-height);
    transform-origin: var(--bits-dropdown-menu-content-transform-origin);

    @include abstracts.elevation(4);

    // Animation states based on data attributes from bits-ui
    &[data-state='open'] {
      animation:
        fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    &[data-state='closed'] {
      animation:
        fadeOut 150ms cubic-bezier(0.4, 0, 1, 1),
        zoomOut 150ms cubic-bezier(0.4, 0, 1, 1);
    }

    // Side-specific slide animations
    &[data-side='bottom'][data-state='open'] {
      animation:
        fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        slideInFromTop 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    &[data-side='left'][data-state='open'] {
      animation:
        fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        slideInFromRight 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    &[data-side='right'][data-state='open'] {
      animation:
        fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        slideInFromLeft 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    &[data-side='top'][data-state='open'] {
      animation:
        fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1),
        slideInFromBottom 150ms cubic-bezier(0.16, 1, 0.3, 1);
    }
  }

  // Animation keyframes
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes zoomOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes slideInFromTop {
    from {
      transform: translateY(-0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      transform: translateX(0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInFromLeft {
    from {
      transform: translateX(-0.5rem);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes slideInFromBottom {
    from {
      transform: translateY(0.5rem);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
