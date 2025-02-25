<script lang="ts">
  import { cn } from "$lib/utils";
  import { buttonVariants } from "./variants";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import type { VariantProps } from "class-variance-authority";
  import { createEventDispatcher } from "svelte";

  type ButtonVariants = VariantProps<typeof buttonVariants>;
  
  interface $$Props extends HTMLButtonAttributes {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: string;
  }

  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export let class_name = "";

  const dispatch = createEventDispatcher();

  $: buttonClass = cn(buttonVariants({ variant, size }), class_name);

  function handleClick(event: MouseEvent) {
    dispatch('click', event);
  }
</script>

<button 
  class={buttonClass} 
  {...$$restProps} 
  onclick={handleClick}
>
  <slot />
</button>