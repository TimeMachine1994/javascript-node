import type { PageServerLoad } from './$types';

const DEFAULT_CALCULATOR_DATA = {
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
  cartItems: [],
  cartTotal: 0,
  selectedPackage: "Solo",
  personalDetails: {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
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