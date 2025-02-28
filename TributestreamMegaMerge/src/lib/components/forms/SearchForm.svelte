<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import FormField from './FormField.svelte';
  
  // Props
  let {
    onCreateClick = () => {}
  } = $props<{
    onCreateClick?: () => void;
  }>();
  
  // Form state
  let searchQuery = $state('');
  let isSearching = $state(false);
  let error = $state<string | null>(null);
  
  // Form validation
  const isValid = $derived(!!searchQuery.trim());
  
  // Search tributes
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    if (!isValid) {
      error = 'Please enter a name to search';
      return;
    }
    
    try {
      isSearching = true;
      error = null;
      await goto(`/search?q=${encodeURIComponent(searchQuery)}`);
    } catch (e) {
      console.error('Error navigating to search page:', e);
      error = 'An error occurred while searching. Please try again.';
    } finally {
      isSearching = false;
    }
  }
</script>

<div class="search-form-container">
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  
  <p class="text-center mb-8 text-lg md:text-xl">
    Tributestream broadcasts high quality audio and video of your loved one's celebration of life. <br> 
    Enter your loved one's name below to begin your journey with Tributestream.
  </p>
  
  <form on:submit={handleSubmit} class="w-full">
    <FormField
      name="searchQuery"
      label=""
      type="text"
      placeholder="Loved One's Name Here"
      value={searchQuery}
      required={true}
      class="text-center mb-4"
      on:input={(e) => searchQuery = (e.currentTarget as HTMLInputElement)?.value || ''}
    />
    
    <div class="flex space-x-4 justify-center">
      <Button 
        type="button"
        variant="gold"
        on:click={onCreateClick}
        disabled={!isValid}
      >
        Create Tribute
      </Button>
      
      <Button
        type="submit"
        variant="gold"
        disabled={isSearching || !isValid}
      >
        {isSearching ? 'Searching...' : 'Search Streams'}
      </Button>
    </div>
  </form>
</div>