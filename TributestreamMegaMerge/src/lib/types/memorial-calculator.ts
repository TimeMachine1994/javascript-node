export interface Director {
  firstName: string;
  lastName: string;
}

export interface FamilyMember {
  firstName: string;
  lastName: string;
  dob: string;
}

export interface Deceased {
  firstName: string;
  lastName: string;
  dob: string;
  dop: string;
}

export interface Contact {
  email: string;
  phone: string;
}

export interface Location {
  name: string;
  address: string;
  travelExceedsHour: boolean;
  startTime: string;
  duration: number; // in hours
  notes: string;
}

export interface ScheduleDay {
  date: string;
  locations: Location[];
}

export interface Memorial {
  locationName: string;
  locationAddress: string;
  time: string;
  date: string;
}

export interface MemorialFormData {
  director: Director;
  familyMember: FamilyMember;
  deceased: Deceased;
  contact: Contact;
  memorial: Memorial;
}

export interface Package {
  name: string;
  price: number;
}

export interface CartItem {
  name: string;
  price: number;
  description?: string;
}

export interface OrderData {
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  package: {
    name: string;
    scheduleDays: ScheduleDay[];
  };
  orderDetails: {
    pricing: {
      items: CartItem[];
      subtotal: number;
      total: number;
    };
    package: {
      name: string;
      scheduleDays: ScheduleDay[];
    };
  };
}