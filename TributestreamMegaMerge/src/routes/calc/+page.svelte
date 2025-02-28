<script lang="ts">
  import type { PageData } from './$types';
  import { error } from '@sveltejs/kit';
  import { onMount } from 'svelte';
  import SelectableSquares from '$lib/SelectableSquares.svelte';
  import Calc from '$lib/Calc.svelte';
  import { masterStore } from '$lib/stores/userStore';

  const props = $props();
  let userData = props.data?.userData;
  let wpUserData = props.data?.wpUserData;
  
  // Try to get data from sessionStorage on mount
  onMount(() => {
    try {
      const storedData = sessionStorage.getItem('calculatorPrefillData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        userData = parsedData.userData || userData;
        wpUserData = parsedData.wpUserData || wpUserData;
        
        // Clear the session storage after retrieving the data
        sessionStorage.removeItem('calculatorPrefillData');
        
        // Initialize user data in the master store
        if (userData?.[0]?.memorial_form_data) {
          try {
            const parsedMemorialData = JSON.parse(userData[0].memorial_form_data);
            
            // Update the master store with user data
            masterStore.updateUserData({
              userMeta: {
                memorial_form_data: userData[0].memorial_form_data
              }
            });
            
            // Initialize order data with memorial information
            masterStore.updateOrderData({
              funeralHome: {
                name: parsedMemorialData.memorial?.locationName || '',
                address: parsedMemorialData.memorial?.locationAddress || '',
                directorName: `${parsedMemorialData.director?.firstName || ''} ${parsedMemorialData.director?.lastName || ''}`
              },
              memorialLocation: {
                name: parsedMemorialData.memorial?.locationName || '',
                address: parsedMemorialData.memorial?.locationAddress || ''
              },
              details: {
                livestreamDate: parsedMemorialData.memorial?.date || '',
                livestreamStartTime: parsedMemorialData.memorial?.time || ''
              }
            });
          } catch (parseError) {
            console.error('Error parsing memorial form data:', parseError);
          }
        }
      }
    } catch (err) {
      console.error('Error retrieving calculator data from sessionStorage:', err);
    }
  });

  // Ensure userData and wpUserData exist before rendering calculator
  $effect(() => {
    if (!userData?.length || !wpUserData?.metaResult?.user_id) {
      throw error(500, 'Required user data not available');
    }
  });
</script>

{#if userData?.length && wpUserData?.metaResult?.user_id}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Memorial Calculator</h1>
    <div class="calculator-container">
      <SelectableSquares />
      <Calc initialStartTime={userData[0]?.memorial_form_data?.memorial?.time || ''} />
    </div>
  </div>
{:else}
  <div class="container mx-auto px-4 py-8">
    <p class="text-red-500">Loading user data...</p>
  </div>
{/if}

<style lang="postcss">
  .calculator-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
</style>