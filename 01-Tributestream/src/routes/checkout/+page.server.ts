import type { PageServerLoad } from './$types';
import type { CalculatorData, UserMetadata, Package } from '$lib/types/user-metadata';

function createDefaultPackage(): Package {
  return {
    id: 'Solo',
    name: 'Solo Package',
    description: 'Basic memorial package',
    basePrice: 599,
    features: []
  };
}

export const load: PageServerLoad = async ({ parent }) => {
  // Get parent data which includes userData from the root layout
  const { userData } = await parent();
  
  // Default values if calculator data is not available
  const defaultCalculatorData: CalculatorData = {
    meta: {
      status: 'draft',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0'
    },
    scheduleDays: [],
    selectedPackage: createDefaultPackage(),
    cart: {
      items: [],
      subtotal: 0,
      total: 0,
      discounts: [],
      taxes: []
    },
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      preferences: {
        contactMethod: 'email',
        notifications: true
      }
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