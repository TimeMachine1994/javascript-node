<script lang="ts">
  import '../app.css';
  import type { UserMetadata, WPUserData } from '$lib/types/user-metadata';
  
  // Get the data passed from layout.server.ts
  export let data: { userData: UserMetadata[]; wpUserData?: WPUserData };

  // Reactive declarations for WordPress user data
  $: wpUser = data.wpUserData;
  $: isLoggedIn = !!wpUser;
  $: isAdmin = wpUser?.roles?.includes('administrator') ?? false;
  $: userDisplayName = wpUser?.displayName ?? '';

  // Debug: Log the data when it changes
  $: console.log('Layout Data:', data);
</script>

<!-- User Info Section -->
{#if isLoggedIn}
  <div class="bg-secondary text-secondary-foreground p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        Welcome, {userDisplayName}
        {#if isAdmin}
          <span class="ml-2 px-2 py-1 bg-primary text-primary-foreground rounded text-xs">Admin</span>
        {/if}
      </div>
      <div class="text-sm">
        {wpUser?.email}
      </div>
    </div>
  </div>
{/if}

<!-- Debug display -->
<div class="bg-gray-100 p-4 text-sm">
  <h3 class="font-bold mb-2">Debug Info:</h3>
  <pre class="whitespace-pre-wrap">
    {JSON.stringify(data, null, 2)}
  </pre>
</div>

{#if data.userData.length > 0}
  <header class="bg-primary text-primary-foreground p-4">
    <div class="container mx-auto">
      {#each data.userData as user}
        <div class="grid gap-4 border-b border-primary-foreground/20 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
          <!-- Memorial Form Data -->
          {#if user.memorial_form_data}
            <div>
              <h3 class="font-bold text-lg mb-2">Memorial Information</h3>
              <div class="grid gap-2">
                {#if user.memorial_form_data.deceased}
                  <div>
                    <strong>Deceased:</strong> {user.memorial_form_data.deceased.name}
                    {#if user.memorial_form_data.deceased.dateOfPassing}
                      (Passed: {user.memorial_form_data.deceased.dateOfPassing})
                    {/if}
                  </div>
                {/if}

                {#if user.memorial_form_data.director}
                  <div>
                    <strong>Director:</strong> 
                    {user.memorial_form_data.director.firstName} 
                    {user.memorial_form_data.director.lastName}
                  </div>
                {/if}

                {#if user.memorial_form_data.memorial}
                  <div>
                    <strong>Memorial:</strong><br>
                    Location: {user.memorial_form_data.memorial.location}<br>
                    Date: {user.memorial_form_data.memorial.date}<br>
                    Time: {user.memorial_form_data.memorial.time}
                  </div>
                {/if}

                {#if user.memorial_form_data.contact}
                  <div>
                    <strong>Contact:</strong><br>
                    Email: {user.memorial_form_data.contact.email}<br>
                    Phone: {user.memorial_form_data.contact.phone}
                  </div>
                {/if}
              </div>
            </div>
          {/if}

          <!-- Calculator Data -->
          {#if user.calculator_data}
            <div>
              <h3 class="font-bold text-lg mb-2">Booking Details</h3>
              <div class="grid gap-2">
                {#if user.calculator_data.personalDetails}
                  <div>
                    <strong>Contact:</strong> 
                    {user.calculator_data.personalDetails.firstName} 
                    {user.calculator_data.personalDetails.lastName}
                    ({user.calculator_data.personalDetails.email})
                  </div>
                {/if}

                {#if user.calculator_data.selectedPackage}
                  <div>
                    <strong>Package:</strong> {user.calculator_data.selectedPackage}
                  </div>
                {/if}

                {#if user.calculator_data.cart?.total}
                  <div>
                    <strong>Total:</strong> ${user.calculator_data.cart.total}
                  </div>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </header>
{/if}

<main>
  <slot />
</main>