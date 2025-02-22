<script lang="ts">
import TributeSearch from '$lib/components/TributeSearch.svelte';
import { useAuth } from '$lib/hooks/useAuth';
import type { Tribute } from '$lib/types/api';
import type { PageData } from './$types';

const { data } = $props<{ data: PageData }>();

// Authentication state
const { isAuthenticated, userData } = useAuth();
let displayName = $state('');

// Subscribe to userData store and update displayName
$effect(() => {
  displayName = $userData?.displayName ?? '';
});

// Page state using Svelte 5 runes
let isLoading = $state(false);
let featuredTributes = $state<Tribute[]>(data.featuredTributes);
let searchResults = $state<Tribute[]>(data.initialSearchResults);

// Derived values
const welcomeMessage = $derived(
  $isAuthenticated ? `Welcome back, ${displayName}` : 'Welcome to TributeStream'
);

// Handle search results update
function handleSearchResults(tributes: Tribute[]) {
  searchResults = tributes;
}
</script>

<div class="min-h-screen bg-background">
  <!-- Hero Section -->
  <section class="py-16 px-4 text-center bg-primary/5">
    <div class="container mx-auto max-w-4xl">
      <h1 class="text-4xl font-bold text-primary mb-4">{welcomeMessage}</h1>
      <p class="text-lg text-muted-foreground mb-8">
        Create, share, and preserve memories of your loved ones
      </p>
      <div class="flex gap-4 justify-center">
        {#if !$isAuthenticated}
          <a
            href="/login"
            class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Get Started
          </a>
        {:else}
          <a
            href="/calc"
            class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Create Memorial
          </a>
        {/if}
        <a
          href="/schedule"
          class="px-6 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition"
        >
          Schedule Service
        </a>
      </div>
    </div>
  </section>

  <!-- Search Section -->
  <section class="py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-2xl font-semibold text-foreground mb-6 text-center">
        Find a Memorial
      </h2>
      <div class="mb-8">
        <TributeSearch tributes={searchResults} />
      </div>
      
      {#if isLoading}
        <div class="text-center text-muted-foreground">
          Searching...
        </div>
      {:else if searchResults.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each searchResults as tribute (tribute.id)}
            <div class="p-4 border rounded-lg bg-card text-card-foreground">
              <h3 class="font-semibold">{tribute.title}</h3>
              <p class="text-sm text-muted-foreground mt-2 line-clamp-2">
                {tribute.content}
              </p>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Featured Section -->
  <section class="py-12 px-4 bg-muted/30">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-2xl font-semibold text-foreground mb-6 text-center">
        Recent Memorials
      </h2>
      {#if featuredTributes.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each featuredTributes as tribute (tribute.id)}
            <div class="p-4 border rounded-lg bg-card text-card-foreground">
              <h3 class="font-semibold">{tribute.title}</h3>
              <p class="text-sm text-muted-foreground mt-2 line-clamp-2">
                {tribute.content}
              </p>
              <div class="text-xs text-muted mt-2">
                {new Date(tribute.date).toLocaleDateString()}
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <p class="text-center text-muted-foreground">
          No recent memorials to display
        </p>
      {/if}
    </div>
  </section>
</div>
