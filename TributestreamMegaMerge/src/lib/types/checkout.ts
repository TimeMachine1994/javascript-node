import type { PaymentBookingFormData, PersonalDetails, Address, PricingDetails } from './payment-booking';

export type { PaymentBookingFormData, PersonalDetails, Address, PricingDetails };

/**
 * Represents the current step in the checkout flow
 */
export type CheckoutStep = 'summary' | 'buyer' | 'billing' | 'payment' | 'confirmation';

/**
 * Represents validation errors for form fields
 */
export interface ValidationErrors {
    [key: string]: string;
}

/**
 * Represents the state of the checkout process
 */
export interface CheckoutState {
    currentStep: CheckoutStep;
    orderData: PricingDetails;
    buyerInfo: PersonalDetails;
    billingAddress: Address;
    shippingAddress?: Address;
    useShippingAddress: boolean;
    paymentMethod: 'card' | 'invoice';
    saveCard: boolean;
    isLoading: boolean;
    errors: ValidationErrors;
}

/**
 * Props for the CheckoutContainer component
 */
export interface CheckoutContainerProps {
    formData: PaymentBookingFormData;
    onComplete: (data: PaymentBookingFormData) => void;
    onCancel: () => void;
}

/**
 * Configuration for Square payment processing
 */
export interface SquareConfig {
    applicationId: string;
    locationId: string;
}

/**
 * Props for the OrderSummary component
 */
export interface OrderSummaryProps {
    pricing: PricingDetails;
    packageDetails: PaymentBookingFormData['package'];
}

/**
 * Props for the BuyerInformation component
 */
export interface BuyerInformationProps {
    initialData: PersonalDetails;
    onUpdate: (data: PersonalDetails) => void;
    errors: ValidationErrors;
}

/**
 * Props for the BillingDetails component
 */
export interface BillingDetailsProps {
    initialData: {
        billing: Address;
        shipping?: Address;
    };
    useShippingAddress: boolean;
    onUpdate: (data: { billing: Address; shipping?: Address; useShippingAddress: boolean }) => void;
    errors: ValidationErrors;
}

/**
 * Props for the PaymentForm component
 */
export interface PaymentFormProps {
    amount: number;
    squareConfig: SquareConfig;
    onPaymentComplete: (token: string) => void;
    onError: (error: Error) => void;
}

/**
 * Validation rules for form fields
 */
export const validationRules = {
    required: (value: string) => (!value ? 'This field is required' : ''),
    email: (value: string) => {
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Invalid email format' : '';
    },
    phone: (value: string) => {
        if (!value) return 'Phone number is required';
        const phoneRegex = /^\+?[\d\s-()]{10,}$/;
        return !phoneRegex.test(value) ? 'Invalid phone number format' : '';
    },
    zipCode: (value: string) => {
        if (!value) return 'ZIP code is required';
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return !zipRegex.test(value) ? 'Invalid ZIP code format' : '';
    }
};

/**
 * Helper function to validate form fields
 */
export function validateFields(
    data: Record<string, string>,
    rules: Record<string, (value: string) => string>
): ValidationErrors {
    const errors: ValidationErrors = {};
    
    Object.entries(rules).forEach(([field, validator]) => {
        if (field in data) {
            const error = validator(data[field]);
            if (error) {
                errors[field] = error;
            }
        }
    });
    
    return errors;
}