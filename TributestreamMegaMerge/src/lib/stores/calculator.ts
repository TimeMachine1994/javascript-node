import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import {
  type CalculatorState,
  type AdditionalService,
  PackageType,
  PACKAGE_INFO,
  ADDITIONAL_SERVICES,
  calculatePriceBreakdown,
  type ScheduleDetails,
  type ServiceLocation
} from '$lib/types/calculator';

/**
 * Default initial calculator state
 */
const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  selectedPackage: null,
  scheduleDetails: {
    date: '',
    time: '',
    timeZone: 'America/New_York',
    duration: 2,
  },
  additionalServices: ADDITIONAL_SERVICES,
  subtotal: 0,
  tax: 0,
  total: 0,
  paymentMethod: null
};

/**
 * Initialize calculator data from localStorage if available
 */
const initCalculatorState = (): CalculatorState => {
  if (browser) {
    const stored = localStorage.getItem('calculator');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored calculator data', e);
      }
    }
  }
  
  return DEFAULT_CALCULATOR_STATE;
};

/**
 * Create a store for managing calculator state
 */
const createCalculatorStore = () => {
  const { subscribe, set, update } = writable<CalculatorState>(initCalculatorState());
  
  // Subscribe to changes and update localStorage
  if (browser) {
    subscribe(state => {
      localStorage.setItem('calculator', JSON.stringify(state));
    });
  }
  
  return {
    subscribe,
    
    /**
     * Reset calculator to default state
     */
    reset: (tributeId?: string, slug?: string) => {
      set({
        ...DEFAULT_CALCULATOR_STATE,
        tributeId,
        slug
      });
    },
    
    /**
     * Select a package
     */
    selectPackage: (packageType: PackageType | null) => {
      update(state => {
        // Update price calculations
        const { subtotal, tax, total } = calculatePriceBreakdown(
          packageType,
          state.additionalServices
        );
        
        return {
          ...state,
          selectedPackage: packageType,
          subtotal,
          tax,
          total
        };
      });
    },
    
    /**
     * Toggle an additional service on/off
     */
    toggleAdditionalService: (serviceId: string) => {
      update(state => {
        // Update additional services
        const additionalServices = state.additionalServices.map(service => 
          service.id === serviceId 
            ? { ...service, isSelected: !service.isSelected }
            : service
        );
        
        // Update price calculations
        const { subtotal, tax, total } = calculatePriceBreakdown(
          state.selectedPackage,
          additionalServices
        );
        
        return {
          ...state,
          additionalServices,
          subtotal,
          tax,
          total
        };
      });
    },
    
    /**
     * Update schedule details
     */
    updateSchedule: (scheduleDetails: Partial<ScheduleDetails>) => {
      update(state => {
        return {
          ...state,
          scheduleDetails: {
            ...state.scheduleDetails,
            ...scheduleDetails
          }
        };
      });
    },
    
    /**
     * Update service location
     */
    updateLocation: (location: ServiceLocation) => {
      update(state => {
        return {
          ...state,
          scheduleDetails: {
            ...state.scheduleDetails,
            location
          }
        };
      });
    },
    
    /**
     * Apply promo code
     */
    applyPromoCode: (promoCode: string) => {
      update(state => {
        // In a real implementation, you'd validate the promo code
        // against a backend API and get the discount amount
        const isValidPromo = promoCode.toLowerCase() === 'welcome10';
        
        if (isValidPromo) {
          // Apply 10% discount
          const discountPercent = 10;
          const discountAmount = state.subtotal * (discountPercent / 100);
          const newTotal = state.subtotal + state.tax - discountAmount;
          
          return {
            ...state,
            promoCode,
            discountAmount,
            discountPercent,
            total: newTotal
          };
        }
        
        // If invalid promo code, remove any existing discount
        const { discountAmount, discountPercent, ...restState } = state;
        return {
          ...restState,
          promoCode: undefined,
          total: state.subtotal + state.tax
        };
      });
    },
    
    /**
     * Set payment method
     */
    setPaymentMethod: (method: 'credit_card' | 'invoice' | null) => {
      update(state => {
        return {
          ...state,
          paymentMethod: method
        };
      });
    },
    
    /**
     * Set tribute ID association
     */
    setTributeId: (tributeId: string, slug?: string) => {
      update(state => {
        return {
          ...state,
          tributeId,
          slug
        };
      });
    }
  };
};

// Create and export the calculator store
export const calculatorStore = createCalculatorStore();

// For convenience, export types from the calculator module
export type { CalculatorState, ScheduleDetails, AdditionalService };
export { PackageType, PACKAGE_INFO, ADDITIONAL_SERVICES };