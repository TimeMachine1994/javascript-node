import type { ScheduleDay } from './api';

/**
 * Type definitions for payment booking form data
 */

/**
 * Represents a location where the service will be held
 */
export interface Location {
    name: string;
    address: string;
    startTime: string;
    duration: number;
    travelExceedsHour: boolean;
    notes?: string;
}

/**
 * Represents package details
 */
export interface PackageDetails {
    name: string;
    scheduleDays: ScheduleDay[];
    price: number;
}

/**
 * Represents an item in the order with its pricing
 */
export interface OrderItem {
    name: string;
    price: number;
    description?: string;
}

/**
 * Represents pricing details including individual items and totals
 */
export interface PricingDetails {
    items: OrderItem[];
    subtotal: number;
    total: number;
}

/**
 * Represents personal/contact information
 */
export interface PersonalDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    relationship?: string;
    otherRelationship?: string;
}

/**
 * Represents a physical address
 */
export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

/**
 * Represents sensitive card details (client-side only)
 */
export interface CardDetails {
    number: string;
    expiry: string;
    cvv: string;
}

/**
 * Main type definition for the payment booking form
 */
export interface PaymentBookingFormData {
    // Personal information
    personalDetails: PersonalDetails;
    
    // Package information from calculator
    package: PackageDetails;
    
    // Order details including pricing and package info
    orderDetails: {
        pricing: PricingDetails;
        package: PackageDetails;
    };
    
    // Address information for payment processing
    billingAddress: Address;
    shippingAddress?: Address;
    
    // Optional card details (client-side only)
    cardDetails?: CardDetails;
}

/**
 * Helper type for transforming calculator cookie data
 */
export interface CalculatorCookieData {
    cartItems: OrderItem[];
    total: number;
    scheduleDays: ScheduleDay[];
    selectedPackage: string;
    funeralHomeName: string;
    funeralDirectorName: string;
}

/**
 * Helper type for transforming memorial form cookie data
 */
export interface MemorialFormCookieData {
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
        dateOfPassing: string;
    };
    contact: {
        email: string;
        phone: string;
        relationship?: string;
    };
    memorial: {
        location: string;
        date: string;
        time: string;
    };
}

/**
 * Utility type for cookie data transformation
 */
export type CookieDataTransformer = {
    fromCalculatorCookie: (data: CalculatorCookieData) => Partial<PaymentBookingFormData>;
    fromMemorialFormCookie: (data: MemorialFormCookieData) => Partial<PaymentBookingFormData>;
};