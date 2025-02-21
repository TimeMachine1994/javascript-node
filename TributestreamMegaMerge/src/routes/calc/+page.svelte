<script lang="ts">
  import type { PageData } from './$types';
  import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
  import { error } from '@sveltejs/kit';

  const props = $props();
  const { userData, wpUserData } = props.data as PageData;

  // Ensure userData and wpUserData exist before rendering calculator
  $effect(() => {
    if (!userData?.length || !wpUserData?.metaResult?.user_id) {
      throw error(500, 'Required user data not available');
    }
  });
</script>

{#if userData?.length && wpUserData?.metaResult?.user_id}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Memorial Calculator</h1>
    <MemorialCalculator
      data={{ userData, wpUserData }}
      initialPackage="Solo"
      onSave={(orderData) => {
        // Success is handled by the MemorialCalculator component
        console.log('Calculator data saved:', orderData);
      }}
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