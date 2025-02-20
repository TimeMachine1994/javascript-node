import type { PageServerLoad } from './$types';
import type { CalculatorData, UserMetadata } from '$lib/types/user-metadata';

export const load: PageServerLoad = async ({ parent }) => {
  // Get parent data which includes userData from the root layout
  const { userData } = await parent();
  
  // Default values if calculator data is not available
  const defaultCalculatorData: CalculatorData = {
    scheduleDays: [],
    cartItems: [],
    cartTotal: 0,
    selectedPackage: '',
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  };

  // Get the first user's data if available
  const currentUser = Array.isArray(userData) && userData.length > 0 
    ? userData[0] 
    : null;

  // Return calculator data or defaults if not available
  return {
    calculatorData: currentUser?.calculator_data || defaultCalculatorData
  };
};