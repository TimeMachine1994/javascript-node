<script lang="ts">
	import { cn } from "$lib/utils.js";

	// Props declaration using Svelte 5 $props rune
	let props = $props<{
		class?: string;
		children?: any;
		[key: string]: any; // For rest props
	}>();

	// Create a derived value for className
	let className = $derived(props.class);
</script>

<div class={cn("p-6", className)} {...props}>
	{@render props.children?.()}
</div>
