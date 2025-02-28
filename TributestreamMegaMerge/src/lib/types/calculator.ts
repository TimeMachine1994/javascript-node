/**
 * Enum for service package types
 */
export enum PackageType {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

/**
 * Interface for pricing information
 */
export interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  description?: string;
}

/**
 * Interface for a service location
 */
export interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Interface for service schedule details
 */
export interface ScheduleDetails {
  date: string;
  time: string;
  timeZone: string;
  duration: number;
  location?: ServiceLocation;
}

/**
 * Interface for additional service options
 */
export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: number;
  isSelected?: boolean;
}

/**
 * Interface for calculator state
 */
export interface CalculatorState {
  selectedPackage: PackageType | null;
  scheduleDetails: ScheduleDetails;
  additionalServices: AdditionalService[];
  promoCode?: string;
  discountAmount?: number;
  discountPercent?: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: 'credit_card' | 'invoice' | null;
  tributeId?: string;
  slug?: string;
}

/**
 * Package metadata
 */
export const PACKAGE_INFO: Record<PackageType, PricingTier> = {
  [PackageType.BASIC]: {
    id: 'basic',
    name: 'Basic Package',
    price: 499,
    features: [
      'Live streaming',
      'Basic video recording',
      'Email support',
      'Up to 100 viewers'
    ],
    description: 'Essential coverage for smaller services'
  },
  [PackageType.STANDARD]: {
    id: 'standard',
    name: 'Standard Package',
    price: 799,
    features: [
      'Live streaming',
      'HD video recording',
      'Email and phone support',
      'Up to 500 viewers',
      'Video editing',
      'Digital guestbook'
    ],
    isPopular: true,
    description: 'Our most popular option for a complete memorial experience'
  },
  [PackageType.PREMIUM]: {
    id: 'premium',
    name: 'Premium Package',
    price: 1299,
    features: [
      'Live streaming',
      '4K video recording',
      'Priority support',
      'Unlimited viewers',
      'Professional video editing',
      'Digital guestbook',
      'Photo slideshow',
      'DVD copy of service',
      'Dedicated event coordinator'
    ],
    description: 'The ultimate tribute experience with premium features'
  }
};

/**
 * Additional service options
 */
export const ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    id: 'photo_slideshow',
    name: 'Photo Slideshow',
    description: 'A beautiful slideshow of photos displayed before the service',
    price: 149,
    isSelected: false
  },
  {
    id: 'dvd_copy',
    name: 'DVD Copy',
    description: 'Physical DVD copy of the service recording',
    price: 79,
    isSelected: false
  },
  {
    id: 'private_stream',
    name: 'Private Stream',
    description: 'Password-protected streaming for privacy',
    price: 99,
    isSelected: false
  },
  {
    id: 'extended_storage',
    name: 'Extended Storage',
    description: 'Keep the recording available online for 1 year',
    price: 129,
    isSelected: false
  }
];

/**
 * Calculate the price breakdown for selected options
 */
export function calculatePriceBreakdown(
  packageType: PackageType | null,
  additionalServices: AdditionalService[]
): { subtotal: number; tax: number; total: number } {
  // Base package price
  let subtotal = packageType ? PACKAGE_INFO[packageType].price : 0;
  
  // Add selected additional services
  additionalServices.forEach(service => {
    if (service.isSelected) {
      subtotal += service.price;
    }
  });
  
  // Calculate tax (assuming 8.5% tax rate)
  const taxRate = 0.085;
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total
  };
}