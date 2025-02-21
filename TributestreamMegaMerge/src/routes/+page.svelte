<script lang="ts">
  import type { PageData } from './$types';
  import TributeSearch from '$lib/components/TributeSearch.svelte';

  const props = $props();
  const { tributes, error } = props.data;
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Tributestream</h1>
  
  {#if error}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
      {error}
    </div>
  {/if}

  <div class="mb-8">
    <TributeSearch {tributes} />
  </div>
</div>

<style lang="postcss">
  /* Add any page-specific styles here */
</style>
