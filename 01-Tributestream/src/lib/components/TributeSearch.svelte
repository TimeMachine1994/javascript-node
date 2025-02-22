<script lang="ts">
  import { onMount } from 'svelte';
  import type { Tribute } from '$lib/types/api';
  
  // Props
  let { tributes = [] } = $props<{
    tributes: Tribute[];
  }>();

  // State
  let searchQuery = $state('');
  let filteredTributes = $state<Tribute[]>([]);
  let isLoading = $state(true);

  // Search function
  function searchTributes(query: string) {
    if (!query.trim()) {
      filteredTributes = tributes;
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    filteredTributes = tributes.filter((tribute: Tribute) => {
      const titleLower = tribute.title.toLowerCase();
      const contentLower = tribute.content.toLowerCase();
      
      // Check if all search terms are found in either title or content
      return searchTerms.every(term => 
        titleLower.includes(term) || contentLower.includes(term)
      );
    });
  }

  // Effect to update filtered tributes when search query changes
  $effect(() => {
    searchTributes(searchQuery);
  });

  // Initialize filtered tributes with all tributes
  onMount(() => {
    filteredTributes = tributes;
    isLoading = false;
  });
</script>

<div class="tribute-search">
  <!-- Search Input -->
  <div class="search-container mb-6">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search tributes..."
      class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none"
    />
  </div>

  <!-- Results -->
  <div class="results-container">
    {#if isLoading}
      <div class="text-center py-8">
        <span class="text-gray-600">Loading tributes...</span>
      </div>
    {:else if filteredTributes.length === 0}
      <div class="text-center py-8">
        <span class="text-gray-600">No tributes found</span>
      </div>
    {:else}
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each filteredTributes as tribute (tribute.id)}
          <a 
            href="/tributes/{tribute.id}" 
            class="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <h3 class="text-lg font-semibold mb-2">{tribute.title}</h3>
            <p class="text-sm text-gray-600 line-clamp-3">
              {tribute.content}
            </p>
            <div class="mt-2 text-xs text-gray-500">
              {new Date(tribute.date).toLocaleDateString()}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>