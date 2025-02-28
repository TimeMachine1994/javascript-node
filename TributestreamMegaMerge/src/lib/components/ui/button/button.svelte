<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { buttonVariants, type ButtonVariantProps } from './variants';
  
  // Define props using $props in Svelte 5
  let {
    variant = 'default',
    size = 'default',
    type = 'button',
    disabled = false,
    class: className = ''
  } = $props<{
    variant?: ButtonVariantProps['variant'];
    size?: ButtonVariantProps['size'];
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    class?: string;
  }>();
  
  // Computed class using the variants
  const buttonClass = $derived(cn(buttonVariants({ variant, size }), className));
</script>

<button
  {type}
  class={buttonClass}
  {disabled}
  on:click
  on:mouseenter
  on:mouseleave
>
  <slot />
</button>