import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { Package } from '$lib/types/user-metadata';

function createDefaultPackage(): Package {
  return {
    id: 'Solo',
    name: 'Solo Package',
    description: 'Basic memorial package',
    basePrice: 599,
    features: []
  };
}

export const load: PageServerLoad = async ({ parent, fetch }) => {
  // Get the parent layout data which includes userData and wpUserData
  const { userData, wpUserData } = await parent();

  // Early return if no WordPress user data is available
  if (!wpUserData?.metaResult?.user_id) {
    console.error('No WordPress user ID available');
    return { userData };
  }

  return { userData };
};

export const actions: Actions = {
  // Action to save calculator data and redirect to checkout
  savePayNow: async ({ request }) => {
    console.log('💰 [CALC] savePayNow action started');
    
    try {
      const formData = await request.formData();
      const calculatorDataStr = formData.get('calculatorData')?.toString();
      
      if (calculatorDataStr) {
        // We could process the data here if needed
        const calculatorData = JSON.parse(calculatorDataStr);
        console.log('✅ [CALC] Calculator data processed for checkout');
        
        // Data would be saved by client-side state in the master store
        // No need for API calls - just redirect
      }
    } catch (err) {
      console.error('❌ [CALC] Error processing calculator data:', err);
      // Continue with redirect even if processing fails
    }
    
    // Simply redirect to checkout page
    console.log('➡️ [CALC] Redirecting to checkout page');
    throw redirect(303, '/checkout');
  },
  
  // Action to save calculator data and redirect to family dashboard
  savePayLater: async ({ request }) => {
    console.log('🏠 [CALC] savePayLater action started');
    
    try {
      const formData = await request.formData();
      const calculatorDataStr = formData.get('calculatorData')?.toString();
      
      if (calculatorDataStr) {
        // We could process the data here if needed
        const calculatorData = JSON.parse(calculatorDataStr);
        console.log('✅ [CALC] Calculator data processed for family dashboard');
        
        // Data would be saved by client-side state in the master store
        // No need for API calls - just redirect
      }
    } catch (err) {
      console.error('❌ [CALC] Error processing calculator data:', err);
      // Continue with redirect even if processing fails
    }
    
    // Simply redirect to family dashboard
    console.log('➡️ [CALC] Redirecting to family dashboard');
    throw redirect(303, '/family-dashboard');
  }
};