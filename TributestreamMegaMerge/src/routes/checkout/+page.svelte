<script lang="ts">
  import { page } from '$app/stores';
  import type { OrderData } from '$lib/types/memorial-calculator';
  import { onMount } from 'svelte';

  interface UserMeta {
    user_id: string;
    meta_entries: {
      [key: string]: string;
    };
  }

  // State management using Svelte 5 runes
  let orderData = $state<OrderData | null>(null);
  let userData = $state<UserMeta | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);

  // Get order data from navigation state
  $effect(() => {
    const state = $page?.state as { orderData?: OrderData };
    if (state?.orderData) {
      orderData = state.orderData;
    }
  });

  // Fetch user meta data
  async function fetchUserMeta() {
    try {
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

  onMount(() => {
    fetchUserMeta();
  });

  // Derived values using Svelte 5 runes
  let userFullName = $derived(
    userData?.meta_entries?.['first_name'] && userData?.meta_entries?.['last_name']
      ? `${userData.meta_entries['first_name']} ${userData.meta_entries['last_name']}`
      : 'N/A'
  );
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Checkout Summary</h1>

  {#if isLoading}
    <div class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
      <p>{error}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- User Information -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">User Information</h2>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Full Name</p>
            <p class="font-medium">{userFullName}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{userData?.meta_entries?.['email'] ?? 'N/A'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Phone</p>
            <p class="font-medium">{userData?.meta_entries?.['phone'] ?? 'N/A'}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Company</p>
            <p class="font-medium">{userData?.meta_entries?.['company'] ?? 'N/A'}</p>
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Order Details</h2>
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-600">Package</p>
            <p class="font-medium">{orderData?.package?.name ?? 'N/A'}</p>
          </div>
          
          <!-- Schedule Days -->
          <div>
            <p class="text-sm text-gray-600 mb-2">Schedule</p>
            {#if orderData?.package?.scheduleDays}
              {#each orderData.package.scheduleDays as day, dayIndex}
                <div class="mb-4 p-3 bg-gray-50 rounded">
                  <p class="font-medium">Day {dayIndex + 1}: {day.date}</p>
                  
                  {#each day.locations as location, locationIndex}
                    <div class="mt-2 pl-4 border-l-2 border-gray-200">
                      <p class="font-medium">Location {locationIndex + 1}: {location.name}</p>
                      <p class="text-sm text-gray-600">Address: {location.address}</p>
                      <p class="text-sm text-gray-600">Time: {location.startTime}</p>
                      <p class="text-sm text-gray-600">Duration: {location.duration} hours</p>
                      {#if location.notes}
                        <p class="text-sm text-gray-600">Notes: {location.notes}</p>
                      {/if}
                      {#if location.travelExceedsHour}
                        <p class="text-sm text-amber-600">Travel time exceeds 1 hour</p>
                      {/if}
                    </div>
                  {/each}
                </div>
              {/each}
            {:else}
              <p class="text-gray-500">No schedule information available</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Pricing Summary -->
      <div class="bg-white shadow rounded-lg p-6 md:col-span-2">
        <h2 class="text-xl font-semibold mb-4">Pricing Summary</h2>
        <div class="space-y-2">
          {#if orderData?.orderDetails?.pricing?.items}
            {#each orderData.orderDetails.pricing.items as item}
