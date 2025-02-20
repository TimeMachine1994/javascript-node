<script lang="ts">
  import type { PageData } from './$types';
  import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
  import { error } from '@sveltejs/kit';

  const props = $props();
  const { userData } = props.data as PageData;

  // Ensure userData exists before rendering calculator
  $effect(() => {
    if (!userData?.length) {
      throw error(500, 'User data not available');
    }
  });
</script>

{#if userData?.length}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Memorial Calculator</h1>
    <MemorialCalculator 
      data={{ userData }}
      initialPackage="Solo"
    />
  </div>
{:else}
  <div class="container mx-auto px-4 py-8">
    <p class="text-red-500">Loading user data...</p>
  </div>
{/if}

<style lang="postcss">
  /* Add any component-specific styles here */
</style>