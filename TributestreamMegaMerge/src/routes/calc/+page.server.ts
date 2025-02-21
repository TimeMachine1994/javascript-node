import type { PageServerLoad } from './$types';
import type { CalculatorData, Package } from '$lib/types/user-metadata';

function createDefaultPackage(): Package {
  return {
    id: 'Solo',
    name: 'Solo Package',
    description: 'Basic memorial package',
    basePrice: 599,
    features: []
  };
}

const DEFAULT_CALCULATOR_DATA: CalculatorData = {
  meta: {
    status: 'draft',
    lastUpdated: new Date().toISOString(),
    version: '2.0.0'
  },
  scheduleDays: [{
    date: new Date().toISOString().split('T')[0],
    locations: [{
      name: "",
      address: "",
      travelExceedsHour: false,
      startTime: "09:00",
      duration: 2,
      notes: ""
    }]
  }],
  selectedPackage: createDefaultPackage(),
  cart: {
    items: [],
    subtotal: 599,
    total: 599,
    discounts: [],
    taxes: []
  },
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferences: {
      contactMethod: 'email',
      notifications: true
    }
  }
};

export const load: PageServerLoad = async ({ parent, fetch }) => {
  // Get the parent layout data which includes userData
  const { userData } = await parent();
  
  // Initialize calculator data if it doesn't exist
  if (userData?.[0] && !userData[0].calculator_data) {
    try {
      const response = await fetch('/api/user-meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userData[0].id,
          meta_key: 'calculator_data',
          meta_value: JSON.stringify(DEFAULT_CALCULATOR_DATA)
        })
      });

      if (!response.ok) {
        console.error('Failed to save default calculator data');
      } else {
        // Update the userData with default calculator data
        userData[0].calculator_data = DEFAULT_CALCULATOR_DATA;
      }
    } catch (error) {
      console.error('Error saving default calculator data:', error);
    }
  }
  
  return {
    userData
  };
};