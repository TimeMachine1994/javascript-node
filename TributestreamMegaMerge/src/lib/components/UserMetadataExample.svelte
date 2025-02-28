<script lang="ts">
  import { page } from '$app/stores';
  import { userMetaStore, isLoadingUserMeta, userMetaError } from '$lib/stores/userMetaStore';
  import type { UserMetadata } from '$lib/types/user-metadata';

  // Using Svelte 5 $state rune for component state
  let userData = $state<UserMetadata | undefined>(undefined);
  let userId = $state<string | undefined>(undefined);
  let token = $state<string | undefined>(undefined);
  let loading = $state(true);
  let error = $state<{message: string} | null>(null);
  let deceasedName = $state('Unknown');
  let memorialDate = $state('No date set');
  let memorialTime = $state('');
  let memorialLocation = $state('');
  let contactEmail = $state('');
  let contactPhone = $state('');
  let isAuthenticated = $state(false);
  
  // Initialize data when component mounts
  function initialize() {
    console.log('🔍 Initializing UserMetadataExample component');
    
    // Get authentication state from page data
    isAuthenticated = $page.data.isAuthenticated;
    console.log('🔐 Is authenticated:', isAuthenticated);
    
    // Get user data from layout data
    const layoutUserData = $page.data.userData?.[0] as UserMetadata | undefined;
    const wpUserData = $page.data.wpUserData;
    
    console.log('📄 Layout user data:', layoutUserData);
    console.log('📄 WP user data:', wpUserData);
    
    // Set user data if available
    if (layoutUserData) {
      userData = layoutUserData;
      
      // Extract data for display
      memorialTime = userData.memorial_form_data?.memorial?.time || '';
      memorialLocation = userData.memorial_form_data?.memorial?.location || '';
      contactEmail = userData.memorial_form_data?.contact?.email || '';
      contactPhone = userData.memorial_form_data?.contact?.phone || '';
      
      console.log('✅ User data loaded from layout');
    }
    
    // Get userId from the WordPress user data
    userId = wpUserData?.metaResult?.user_id?.toString();
    console.log('👤 User ID:', userId);
    
    // Get token from cookies
    token = document.cookie
      .split('; ')
      .find(row => row.startsWith('jwt_token='))
      ?.split('=')[1];
    console.log('🔑 Token present:', !!token);
    
    if (userId) {
      // Example of accessing specific properties directly from the store
      deceasedName = userMetaStore.getUserProperty(
        userId,
        'memorial_form_data.deceased.name',
        'Unknown'
      );
      
      memorialDate = userMetaStore.getUserProperty(
        userId,
        'memorial_form_data.memorial.date',
        'No date set'
      );
      
      // Fetch fresh data to ensure we have the latest
      if (token) {
        console.log('🔄 Fetching fresh user data');
        fetchFreshData();
      }
    }
    
    // Get loading and error state
    loading = $isLoadingUserMeta;
    error = $userMetaError;
    
    console.log('🏁 Component initialization complete');
  }
  
  // Call initialize when the component mounts
  $effect(() => {
    initialize();
  });
  
  // Reactive effect to update component state when store loading state changes
  $effect(() => {
    loading = $isLoadingUserMeta;
    console.log('🔄 Loading state updated:', loading);
  });
  
  // Reactive effect to update component state when store error state changes
  $effect(() => {
    error = $userMetaError;
    if (error) {
      console.error('❌ Error state updated:', error);
    }
  });
  
  // Fetch fresh data from the store
  async function fetchFreshData() {
    if (!userId || !token) return;
    
    try {
      console.log('🔄 Fetching fresh data for user:', userId);
      const freshData = await userMetaStore.fetchUserMeta(userId, token, true);
      
      if (freshData) {
        console.log('✅ Fresh data fetched successfully:', freshData);
        userData = freshData;
        
        // Update display values
        deceasedName = freshData.memorial_form_data?.deceased?.name || 'Unknown';
        memorialDate = freshData.memorial_form_data?.memorial?.date || 'No date set';
        memorialTime = freshData.memorial_form_data?.memorial?.time || '';
        memorialLocation = freshData.memorial_form_data?.memorial?.location || '';
        contactEmail = freshData.memorial_form_data?.contact?.email || '';
        contactPhone = freshData.memorial_form_data?.contact?.phone || '';
      }
    } catch (err) {
      console.error('❌ Error fetching fresh data:', err);
    }
  }
  
  // Example function to update user metadata
  async function updateMemorialDate(event: Event) {
    if (!userId || !token) {
      console.error('Cannot update: User ID or token is missing');
      return;
    }
    
    const newDate = (event.target as HTMLInputElement).value;
    console.log('📅 Updating memorial date to:', newDate);
    
    try {
      // Get current user data
      const currentData = userMetaStore.getUserMetadata(userId);
      if (!currentData) throw new Error('No user data available');
      
      // Create updated memorial form data
      const updatedMemorialFormData = {
        ...currentData.memorial_form_data,
        memorial: {
          ...currentData.memorial_form_data.memorial,
          date: newDate
        }
      };
      
      console.log('📦 Updated memorial form data:', updatedMemorialFormData);
      
      // Update the data through the store
      const success = await userMetaStore.updateUserMeta(
        userId,
        token,
        'memorial_form_data',
        updatedMemorialFormData
      );
      
      if (success) {
        console.log('✅ Memorial date updated successfully');
        memorialDate = newDate;
      } else {
        console.error('❌ Failed to update memorial date');
      }
    } catch (err) {
      console.error('❌ Error updating memorial date:', err);
    }
  }
  
  // Handler for retry button
  function retryFetch() {
    console.log('🔄 Retrying data fetch');
    if (userId && token) {
      userMetaStore.fetchUserMeta(userId, token, true);
    }
  }
</script>

<div class="user-metadata-example">
  <h2>User Metadata Example</h2>
  
  <button onclick={initialize} class="refresh-button">Refresh Data</button>
  
  {#if loading}
    <div class="loading">
      <p>Loading user data...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error.message}</p>
      <button onclick={retryFetch}>
        Retry
      </button>
    </div>
  {:else if userData}
    <div class="user-data">
      <h3>Memorial Information</h3>
      <div class="info-card">
        <p><strong>In Memory Of:</strong> {deceasedName}</p>
        <p><strong>Date:</strong> {memorialDate}</p>
        <p><strong>Time:</strong> {memorialTime}</p>
        <p><strong>Location:</strong> {memorialLocation}</p>
      </div>
      
      <h3>Contact Information</h3>
      <div class="info-card">
        <p><strong>Email:</strong> {contactEmail}</p>
        <p><strong>Phone:</strong> {contactPhone}</p>
      </div>
      
      <h3>Update Memorial Date</h3>
      <div class="form-group">
        <label for="memorial-date">New Date:</label>
        <input
          type="date"
          id="memorial-date"
          value={memorialDate}
          onchange={updateMemorialDate}
        />
      </div>
      
      <div class="debug-info">
        <h4>Debug Information</h4>
        <pre>User ID: {userId}</pre>
        <pre>Is Authenticated: {isAuthenticated}</pre>
        <pre>Data Available: {!!userData}</pre>
      </div>
    </div>
  {:else}
    <div class="no-data">
      <p>No user data available</p>
      {#if isAuthenticated}
        <p>You are logged in, but no memorial data is available.</p>
        <button onclick={fetchFreshData}>Try Fetching Data</button>
      {:else}
        <p>Please log in to view your memorial information.</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .user-metadata-example {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .info-card {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
  }
  
  .loading, .error, .no-data {
    padding: 20px;
    border-radius: 8px;
    text-align: center;
  }
  
  .loading {
    background-color: #e9f5fd;
  }
  
  .error {
    background-color: #fde9e9;
  }
  
  .no-data {
    background-color: #f2f2f2;
  }
  
  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  button:hover {
    background-color: #0069d9;
  }
  
  .refresh-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: #6c757d;
    padding: 6px 12px;
    font-size: 0.9rem;
  }
  
  .refresh-button:hover {
    background-color: #5a6268;
  }
  
  .debug-info {
    margin-top: 30px;
    border-top: 1px dashed #ccc;
    padding-top: 15px;
  }
  
  .debug-info h4 {
    color: #6c757d;
    margin-bottom: 10px;
  }
  
  .debug-info pre {
    background-color: #f1f1f1;
    padding: 8px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9rem;
    margin: 5px 0;
  }
</style>