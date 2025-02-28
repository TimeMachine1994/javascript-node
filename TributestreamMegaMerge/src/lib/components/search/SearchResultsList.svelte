<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { slugToDisplayName } from '$lib/utils/slugify';
  import { goto } from '$app/navigation';
  import type { Tribute } from '$lib/types/tribute';
  
  // Props without type assertions for Svelte 5 compatibility
  let {
    results = [],
    isLoading = false,
    error = null,
    query = '',
  } = $props<{
    results: any[];
    isLoading?: boolean;
    error?: string | null;
    query?: string;
  }>();
  
  // Function to navigate to tribute page
  function navigateToTribute(tribute: Tribute) {
    goto(`/celebration-of-life-for-${tribute.slug}`);
  }
</script>

<div class="search-results mt-6">
  <!-- Search header -->
  <div class="mb-6">
    <h2 class="text-2xl font-semibold text-gray-800">
      {#if isLoading}
        Searching...
      {:else if results.length > 0}
        Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
      {:else}
        No results found for "{query}"
      {/if}
    </h2>
  </div>
  
  <!-- Loading state -->
  {#if isLoading}
    <div class="flex justify-center items-center py-12">
      <div class="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  
  <!-- Error state -->
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Error: </strong>
      <span class="block sm:inline">{error}</span>
    </div>
  
  <!-- Empty results -->
  {:else if results.length === 0}
    <div class="text-center py-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-gray-600 mb-4">No tributes found matching your search criteria.</p>
      <p class="text-gray-500">Try adjusting your search terms or create a new tribute.</p>
      
      <div class="mt-6">
        <Button 
          variant="gold"
          on:click={() => goto('/')}
        >
          Create a New Tribute
        </Button>
      </div>
    </div>
  
  <!-- Results list -->
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each results as tribute (tribute.id)}
        <div 
          class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          on:click={() => navigateToTribute(tribute)}
          on:keydown={(e) => e.key === 'Enter' && navigateToTribute(tribute)}
          tabindex="0"
        >
          <!-- If there's a photo, show it -->
          {#if tribute.deceased.photoUrl}
            <div class="h-48 overflow-hidden">
              <img 
                src={tribute.deceased.photoUrl} 
                alt={tribute.deceased.fullName} 
                class="w-full h-full object-cover"
              />
            </div>
          {:else}
            <!-- Placeholder for no photo -->
            <div class="h-48 bg-gray-100 flex items-center justify-center">
              <span class="text-4xl text-gray-400 font-bold">
                {tribute.deceased.firstName.charAt(0)}{tribute.deceased.lastName.charAt(0)}
              </span>
            </div>
          {/if}
          
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {tribute.deceased.fullName}
            </h3>
            
            {#if tribute.deceased.dateOfBirth && tribute.deceased.dateOfPassing}
              <p class="text-gray-600 mb-2">
                {new Date(tribute.deceased.dateOfBirth).getFullYear()} - {new Date(tribute.deceased.dateOfPassing).getFullYear()}
              </p>
            {/if}
            
            {#if tribute.scheduleDetails}
              <p class="text-sm text-gray-600">
                <span class="font-medium">Service Date:</span> {new Date(tribute.scheduleDetails.date).toLocaleDateString()}
              </p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">Time:</span> {tribute.scheduleDetails.time}
              </p>
            {/if}
            
            <Button 
              variant="outline"
              class="mt-4 w-full"
            >
              View Tribute
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>