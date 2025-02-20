import type { LayoutServerLoad } from './$types';
import type { UserMetadata } from '$lib/types/user-metadata';

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
          calculator_data: {
            scheduleDays: [],
            cartItems: [],
            cartTotal: 0,
            selectedPackage: '',
            personalDetails: {
              firstName: wpMemorialData.familyMember.firstName,
              lastName: wpMemorialData.familyMember.lastName,
              email: wpMemorialData.contact.email,
              phone: wpMemorialData.contact.phone
            }
          }
        };

        // Add to array
        userDataArray.push(userData);
      }

      console.log('Parsed User Data Array:', userDataArray);
    }
  } catch (error) {
    console.error('Error parsing userData cookie:', error);
  }

  return {
    userData: userDataArray
  };
};