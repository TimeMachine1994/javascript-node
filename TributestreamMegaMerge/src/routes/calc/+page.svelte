<script lang="ts">
  import { onMount } from 'svelte';
  import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';

  // Define TypeScript interface for user meta data
  interface UserMeta {
    user_id: string;
    meta_entries: {
      [key: string]: string;
    };
  }

  // State management using Svelte 5 runes
  let userData = $state<UserMeta | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Fetch user meta data
  async function fetchUserMeta() {
    try {
      // Get the user ID from URL params or localStorage - for now using a dummy ID
      const userId = '1'; // TODO: Replace with actual user ID from auth context
      
      const response = await fetch(`/api/user-meta?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user meta data');
      }
      
      const data = await response.json();
      userData = data;
    } catch (e) {
      error = e instanceof Error ? e.message : 'An error occurred';
    } finally {
      isLoading = false;
    }
  }

  // Lifecycle
  onMount(() => {
    fetchUserMeta();
  });

  // Derived state using Svelte 5 runes
  let userFullName = $derived(
    userData?.meta_entries?.['first_name'] && userData?.meta_entries?.['last_name']
      ? `${userData.meta_entries['first_name']} ${userData.meta_entries['last_name']}`
      : 'N/A'
  );
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Memorial Calculator</h1>

  {#if isLoading}
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <p>{error}</p>
    </div>
  {:else}
    <!-- User Meta Data Display -->
    <div class="bg-white shadow rounded-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">User Information</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Full Name</p>
          <p class="font-medium">{userFullName}</p>
        </div>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Email</p>
          <p class="font-medium">{userData?.meta_entries?.['email'] ?? 'N/A'}</p>
        </div>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Phone</p>
          <p class="font-medium">{userData?.meta_entries?.['phone'] ?? 'N/A'}</p>
        </div>
        <div class="space-y-2">
          <p class="text-sm text-gray-600">Company</p>
          <p class="font-medium">{userData?.meta_entries?.['company'] ?? 'N/A'}</p>
        </div>
      </div>
    </div>

    <!-- Memorial Calculator Component -->
    <MemorialCalculator 
      initialPackage="Solo"
      onSave={(data) => {
        console.log('Saving order data:', data);
        // TODO: Implement save functionality
      }}
      onCheckout={(data) => {
        console.log('Processing checkout:', data);
        // TODO: Implement checkout functionality
      }}
    />
  {/if}
</div>

<style>
  /* Add any additional custom styles here */
</style>