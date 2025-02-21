/**
 * Types for user metadata handling and display
 */

export interface MemorialFormData {
  director: {
    firstName: string;
    lastName: string;
  };
  familyMember: {
    name: string;
    dob: string;
  };
  deceased: {
    name: string;
    dob: string;
    dateOfPassing: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  memorial: {
    location: string;
    date: string;
    time: string;
  };
}

export interface Location {
  name: string;
  address: string;
  startTime: string;
  duration: number;
  travelExceedsHour: boolean;
  notes: string;
}

export interface ScheduleDay {
  date: string;
  locations: Location[];
}

export interface CartItem {
  name: string;
  price: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
}

export interface CartData {
  items: CartItem[];
  subtotal: number;
  total: number;
  discounts: Array<{
    code: string;
    amount: number;
  }>;
  taxes: Array<{
    name: string;
    rate: number;
    amount: number;
  }>;
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferences: {
    contactMethod: 'email' | 'phone';
    notifications: boolean;
  };
}

export interface CalculatorData {
  meta: {
    status: 'draft' | 'pending' | 'complete' | 'error';
    lastUpdated: string;
    version: string;
    errors?: string[];
  };
  scheduleDays: ScheduleDay[];
  selectedPackage: Package;
  cart: CartData;
  personalDetails: PersonalDetails;
}

export interface UserMetadata {
  memorial_form_data: MemorialFormData;
  calculator_data: CalculatorData;
  [key: string]: any;
}

export interface UserMetadataPageData {
  personalInfo: {
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
  memorialDetails: {
    deceased: {
      name: string;
      dob: string;
      dateOfPassing: string;
    };
    schedule: ScheduleDay[];
    package: string;
  };
  pricing: {
    items: CartItem[];
    total: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface MetaEntry {
  meta_key: string;
  meta_value: string;
}