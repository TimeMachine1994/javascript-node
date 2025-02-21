import type { LayoutServerLoad } from './$types';
import type { UserMetadata, CalculatorData, Package } from '$lib/types/user-metadata';

interface WPUserData {
  displayName: string;
  email: string;
  nicename: string;
  roles: string[];
  isAdmin: boolean;
  metaResult: {
    success: boolean;
    message: string;
    user_id: number;
    meta_key: string;
    meta_value: string;
    version?: string;
  };
}

interface WPMemorialFormData {
  director: {
    firstName: string;
    lastName: string;
  };
  familyMember: {
    firstName: string;
    lastName: string;
    dob: string;
  };
  deceased: {
    firstName: string;
    lastName: string;
    dob: string;
    dop: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  memorial: {
    locationName: string;
    locationAddress: string;
    time: string;
    date: string;
  };
}

function getDataVersion(wpUserData: WPUserData): string {
  return wpUserData.metaResult?.version || '1.0.0';
}

function needsMigration(version: string): boolean {
  return version !== '2.0.0';
}

function createDefaultPackage(): Package {
  return {
    id: 'Solo',
    name: 'Solo Package',
    description: 'Basic memorial package',
    basePrice: 599,
    features: []
  };
}

function createNewCalculatorData(wpMemorialData: WPMemorialFormData): CalculatorData {
  return {
    meta: {
      status: 'draft',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0'
    },
    scheduleDays: [{
      date: wpMemorialData.memorial.date,
      locations: [{
        name: wpMemorialData.memorial.locationName,
        address: wpMemorialData.memorial.locationAddress,
        startTime: wpMemorialData.memorial.time,
        duration: 60,
        travelExceedsHour: false,
        notes: ''
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
      firstName: wpMemorialData.familyMember.firstName,
      lastName: wpMemorialData.familyMember.lastName,
      email: wpMemorialData.contact.email,
      phone: wpMemorialData.contact.phone,
      preferences: {
        contactMethod: 'email',
        notifications: true
      }
    }
  };
}

function migrateCalculatorData(oldData: any, wpMemorialData: WPMemorialFormData): CalculatorData {
  // Start with a fresh calculator data structure
  const newData = createNewCalculatorData(wpMemorialData);

  // If we have old data, try to preserve relevant information
  if (oldData) {
    if (oldData.scheduleDays?.length > 0) {
      newData.scheduleDays = oldData.scheduleDays;
    }
    if (oldData.cartItems?.length > 0) {
      newData.cart.items = oldData.cartItems.map((item: any) => ({
        name: item.name,
        price: item.price
      }));
      newData.cart.subtotal = oldData.cartTotal || 599;
      newData.cart.total = oldData.cartTotal || 599;
    }
  }

  return newData;
}

function handleDataError(error: Error): CalculatorData {
  return {
    meta: {
      status: 'error',
      lastUpdated: new Date().toISOString(),
      version: '2.0.0',
      errors: [error.message]
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
}

export const load: LayoutServerLoad = async ({ cookies }) => {
  const userDataCookie = cookies.get('user');
  console.log('userDataCookie:', userDataCookie);
  
  let userDataArray: UserMetadata[] = [];

  try {
    if (userDataCookie) {
      // Parse the cookie string into WPUserData
      const wpUserData: WPUserData = JSON.parse(userDataCookie);
      
      // Parse the meta_value string which contains the memorial form data
      if (wpUserData.metaResult?.meta_value) {
        const wpMemorialData: WPMemorialFormData = JSON.parse(wpUserData.metaResult.meta_value);
        const version = getDataVersion(wpUserData);
        
        // Create a UserMetadata object with proper structure mapping
        const userData: UserMetadata = {
          memorial_form_data: {
            director: {
              firstName: wpMemorialData.director.firstName,
              lastName: wpMemorialData.director.lastName
            },
            familyMember: {
              name: `${wpMemorialData.familyMember.firstName} ${wpMemorialData.familyMember.lastName}`,
              dob: wpMemorialData.familyMember.dob
            },
            deceased: {
              name: `${wpMemorialData.deceased.firstName} ${wpMemorialData.deceased.lastName}`,
              dob: wpMemorialData.deceased.dob,
              dateOfPassing: wpMemorialData.deceased.dop
            },
            contact: {
              email: wpMemorialData.contact.email,
              phone: wpMemorialData.contact.phone
            },
            memorial: {
              location: `${wpMemorialData.memorial.locationName} - ${wpMemorialData.memorial.locationAddress}`,
              date: wpMemorialData.memorial.date,
              time: wpMemorialData.memorial.time
            }
          },
          calculator_data: needsMigration(version) 
            ? migrateCalculatorData(null, wpMemorialData)
            : createNewCalculatorData(wpMemorialData)
        };

        // Add to array
        userDataArray.push(userData);
      }

      console.log('Parsed User Data Array:', userDataArray);
    }
  } catch (error) {
    console.error('Error parsing userData cookie:', error);
    if (error instanceof Error) {
      userDataArray.push({
        memorial_form_data: {
          director: { firstName: '', lastName: '' },
          familyMember: { name: '', dob: '' },
          deceased: { name: '', dob: '', dateOfPassing: '' },
          contact: { email: '', phone: '' },
          memorial: { location: '', date: '', time: '' }
        },
        calculator_data: handleDataError(error)
      });
    }
  }

  return {
    userData: userDataArray
  };
};