<script lang="ts">
  import UserMetadataExample from '$lib/components/UserMetadataExample.svelte';
  import { page } from '$app/stores';
  import { userMetaStore } from '$lib/stores/userMetaStore';
  
  // Using Svelte 5 $state rune for component state
  let isAuthenticated = $state(false);
  let userId = $state<string | undefined>(undefined);
  let hasUserData = $state(false);
  
  // Initialize component state
  function initializeState() {
    console.log('📋 Initializing demo page state');
    isAuthenticated = $page.data.isAuthenticated;
    userId = $page.data.wpUserData?.metaResult?.user_id?.toString();
    hasUserData = !!$page.data.userData?.length;
    
    console.log('🔐 Is authenticated:', isAuthenticated);
    console.log('👤 User ID:', userId);
    console.log('📄 Has user data:', hasUserData);
  }
  
  // Use $effect to set up initial state when component mounts
  $effect(() => {
    initializeState();
  });
  
  // Example update function for demonstration
  async function updateProperty(userId: string, token: string, key: string, value: any) {
    console.log(`Updating ${key} for user ${userId}`);
    const success = await userMetaStore.updateUserMeta(
      userId,
      token,
      key,
      value
    );
    return success;
  }
  
  // Function to refresh page data
  function refreshPage() {
    console.log('🔄 Refreshing page data');
    window.location.reload();
  }
</script>

<div class="container">
  <h1>User Metadata Demo</h1>
  
  <p class="description">
    This page demonstrates how to use the <code>userMetaStore</code> utility to access and update user metadata.
    The example below shows how to fetch, display, and modify memorial data for a user.
  </p>
  
  {#if isAuthenticated}
    <div class="status-banner authenticated">
      <span>✅ You are logged in</span>
      <button onclick={refreshPage} class="refresh-button">Refresh Page</button>
    </div>
  {:else}
    <div class="status-banner unauthenticated">
      <span>❌ You are not logged in</span>
      <p>Please log in to see your user metadata.</p>
      <a href="/login" class="login-button">Log In</a>
    </div>
  {/if}
  
  <div class="example-wrapper">
    <UserMetadataExample />
  </div>
  
  <div class="technical-details">
    <h2>Technical Implementation (Svelte 5)</h2>
    <p>This demo uses the following components with Svelte 5 runes:</p>
    <ul>
      <li><code>userMetaStore.ts</code> - Centralized store for user metadata</li>
      <li><code>+layout.server.ts</code> - Loads user data for all routes</li>
      <li><code>UserMetadataExample.svelte</code> - Example component with Svelte 5 runes</li>
    </ul>
    
    <h3>Key Benefits</h3>
    <ul>
      <li>Type-safe access to user metadata</li>
      <li>Efficient caching to minimize API calls</li>
      <li>Consistent error handling</li>
      <li>Reactive updates with Svelte 5 runes</li>
    </ul>
    
    <h3>Svelte 5 Code Example</h3>
    <pre><code>{`// Using $state rune for reactive state
let userId = $state<string | undefined>(undefined);
let deceasedName = $state('Unknown');

// Initialize in an effect
$effect(() => {
  userId = $page.data.wpUserData?.metaResult?.user_id?.toString();
  
  // Access specific data with fallback if we have a userId
  if (userId) {
    deceasedName = userMetaStore.getUserProperty(
      userId,
      'memorial_form_data.deceased.name',
      'Unknown'
    );
  }
});

// Events use property syntax (no "on:" prefix)
function updateMemorialDate(event) {
  const newDate = event.target.value;
  // Update implementation
}

<button onclick={updateMemorialDate}>
  Update Date
</button>`}</code></pre>
  </div>
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    position: relative;
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  .description {
    margin-bottom: 30px;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .example-wrapper {
    margin: 40px 0;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 20px;
    background-color: white;
    position: relative;
  }
  
  .status-banner {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    position: relative;
  }
  
  .authenticated {
    background-color: #e7f5ea;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  .unauthenticated {
    background-color: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
  }
  
  .login-button {
    display: inline-block;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    margin-top: 10px;
  }
  
  .technical-details {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin-top: 40px;
  }
  
  pre {
    background-color: #f1f1f1;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  code {
    font-family: monospace;
  }
  
  .refresh-button {
    position: absolute;
    right: 15px;
    top: 15px;
    padding: 6px 12px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .refresh-button:hover {
    background-color: #218838;
  }
</style>