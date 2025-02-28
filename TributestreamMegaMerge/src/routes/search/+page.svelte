<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import SearchResultsList from '$lib/components/search/SearchResultsList.svelte';
  import FormField from '$lib/components/forms/FormField.svelte';
  import { Button } from '$lib/components/ui/button';
  import type { PageData } from './$types';
  
  // Get data from server load function using Svelte 5 $props() instead of export let
  const { data } = $props<{ data: PageData }>();
  
  // Use browser-side state to handle search refinement
  let searchQuery = $state(data.query);
  let isSearching = $state(false);
  
  // Perform client-side search with new query
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    isSearching = true;
    
    try {
      // Navigate to the same page with updated query param
      await goto(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Error navigating to search results:', error);
    } finally {
      isSearching = false;
    }
  }
</script>

<svelte:head>
  <title>Search Tributes | Tributestream</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Search Tributes</h1>
    
    <!-- Search form -->
    <form on:submit={handleSubmit} class="flex items-end space-x-4 max-w-4xl">
      <div class="flex-1">
        <FormField
          name="searchQuery"
          label="Search by name"
          type="search"
          value={searchQuery}
          placeholder="Enter a name to search"
          on:input={(e) => searchQuery = (e.currentTarget as HTMLInputElement)?.value || ''}
        />
      </div>
      
      <Button
        type="submit" 
        variant="gold"
        disabled={isSearching || !searchQuery.trim()}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </Button>
    </form>
  </div>
  
  <!-- Display search results -->
  <SearchResultsList
    results={data.results}
    query={data.query}
    error={data.error}
    isLoading={isSearching}
  />
  
  <!-- Return to home button -->
  <div class="mt-12 flex justify-center">
    <Button 
      variant="outline"
      on:click={() => goto('/')}
    >
      Return to Home
    </Button>
  </div>
</div>