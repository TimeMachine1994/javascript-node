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
  // Get the parent layout data which includes userData and wpUserData
  const { userData, wpUserData } = await parent();

  // Early return if no WordPress user data is available
  if (!wpUserData?.metaResult?.user_id) {
    console.error('No WordPress user ID available');
    return { userData };
  }

  // Check if we need to initialize calculator data
  const userDataEntry = userData[0];
  const needsInitialization = !userDataEntry?.calculator_data;

  if (needsInitialization) {
    try {
      // Initialize calculator data via API
      const response = await fetch('/api/user-meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: wpUserData.metaResult.user_id,
          meta_key: 'calculator_data',
          meta_value: JSON.stringify(DEFAULT_CALCULATOR_DATA)
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to save calculator data: ${response.statusText}`);
      }

      // Update local data structure only after successful API call
      const updatedUserData = [...userData];
      if (!updatedUserData[0]) {
        // Initialize new user data entry if it doesn't exist
        updatedUserData[0] = {
          memorial_form_data: userDataEntry?.memorial_form_data ?? {
            director: { firstName: '', lastName: '' },
            familyMember: { name: '', dob: '' },
            deceased: { name: '', dob: '', dateOfPassing: '' },
            contact: { email: '', phone: '' },
            memorial: { location: '', date: '', time: '' }
          },
          calculator_data: DEFAULT_CALCULATOR_DATA
        };
      } else {
        // Update existing entry's calculator data
        updatedUserData[0] = {
          ...updatedUserData[0],
          calculator_data: DEFAULT_CALCULATOR_DATA
        };
      }

      return {
        userData: updatedUserData
      };
    } catch (error) {
      console.error('Error initializing calculator data:', error);
      // Return existing data if initialization fails
      return { userData };
    }
  }

  // Return existing data if no initialization was needed
  return { userData };
};