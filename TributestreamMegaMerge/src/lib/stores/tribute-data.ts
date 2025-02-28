import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// Define the tribute data interface
export interface TributeData {
  // Deceased information
  deceased: {
    fullName: string;
    dateOfBirth?: string;
    dateOfPassing?: string;
    photoUrl?: string;
  };
  
  // Service details
  service: {
    date: string;
    time: string;
    location?: {
      name: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      id: string;
    };
    duration: number;
    timeZone: string;
  };
  
  // Director/organizer information
  organizer: {
    name: string;
    organization?: string;
    email: string;
    phone: string;
    type: 'family' | 'funeral_director' | 'other';
  };
  
  // Package and payment info
  package: {
    id: string;
    name: string;
    price: number;
    type: 'basic' | 'standard' | 'premium';
  } | null;
  
  // Additional services
  additionalServices: Array<{
    id: string;
    name: string;
    price: number;
    selected: boolean;
  }>;
  
  // Payment information
  payment: {
    method: 'credit_card' | 'invoice' | null;
    status: 'pending' | 'completed' | 'failed' | null;
    subtotal: number;
    tax: number;
    total: number;
    discountCode?: string;
    discountAmount?: number;
  };
  
  // Tribute page information
  tributePage: {
    slug: string;
    customUrl: string;
    created: string; // ISO date string
    published: boolean;
  };
  
  // Tribute ID (undefined for new tributes)
  id?: string;
}

// Initialize default tribute data
const defaultTributeData: TributeData = {
  deceased: {
    fullName: '',
  },
  service: {
    date: '',
    time: '',
    duration: 2,
    timeZone: 'America/New_York',
  },
  organizer: {
    name: '',
    email: '',
    phone: '',
    type: 'family',
  },
  package: null,
  additionalServices: [],
  payment: {
    method: null,
    status: null,
    subtotal: 0,
    tax: 0,
    total: 0,
  },
  tributePage: {
    slug: '',
    customUrl: '',
    created: new Date().toISOString(),
    published: false,
  },
};

// Load data from localStorage
const loadTributeData = (): TributeData => {
  if (browser) {
    const stored = localStorage.getItem('tributeData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored tribute data', e);
      }
    }
  }
  return { ...defaultTributeData };
};

// Create the tribute data store
function createTributeDataStore() {
  const { subscribe, set, update } = writable<TributeData>(loadTributeData());
  
  // Persist data to localStorage when it changes
  if (browser) {
    subscribe(data => {
      localStorage.setItem('tributeData', JSON.stringify(data));
    });
  }
  
  return {
    subscribe,
    
    // Reset the store with default values but keep a specific ID if provided
    reset: (tributeId?: string) => {
      const newData = { ...defaultTributeData };
      if (tributeId) {
        newData.id = tributeId;
      }
      set(newData);
    },
    
    // Update deceased information
    updateDeceased: (deceasedInfo: Partial<TributeData['deceased']>) => {
      update(data => {
        return {
          ...data,
          deceased: {
            ...data.deceased,
            ...deceasedInfo
          }
        };
      });
      
      // If name was updated, update the slug as well
      if (deceasedInfo.fullName) {
        const currentData = get({ subscribe });
        if (currentData.deceased.fullName) {
          const slug = currentData.deceased.fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
            
          update(data => {
            return {
              ...data,
              tributePage: {
                ...data.tributePage,
                slug,
                customUrl: `http://www.tributestream.com/celebration-of-life-for-${slug}`
              }
            };
          });
        }
      }
    },
    
    // Update service details
    updateService: (serviceInfo: Partial<TributeData['service']>) => {
      update(data => {
        return {
          ...data,
          service: {
            ...data.service,
            ...serviceInfo
          }
        };
      });
    },
    
    // Update service location
    updateServiceLocation: (location: TributeData['service']['location']) => {
      update(data => {
        return {
          ...data,
          service: {
            ...data.service,
            location
          }
        };
      });
    },
    
    // Update organizer information
    updateOrganizer: (organizerInfo: Partial<TributeData['organizer']>) => {
      update(data => {
        return {
          ...data,
          organizer: {
            ...data.organizer,
            ...organizerInfo
          }
        };
      });
    },
    
    // Set package selection
    setPackage: (pkg: TributeData['package']) => {
      update(data => {
        // Recalculate totals
        const packagePrice = pkg?.price || 0;
        const additionalServicesTotal = data.additionalServices
          .filter(service => service.selected)
          .reduce((sum, service) => sum + service.price, 0);
          
        const subtotal = packagePrice + additionalServicesTotal;
        const tax = subtotal * 0.085; // 8.5% tax rate
        const total = subtotal + tax;
        
        return {
          ...data,
          package: pkg,
          payment: {
            ...data.payment,
            subtotal,
            tax,
            total
          }
        };
      });
    },
    
    // Update additional services
    updateAdditionalService: (serviceId: string, selected: boolean) => {
      update(data => {
        // Update the service selection
        const updatedServices = data.additionalServices.map(service =>
          service.id === serviceId ? { ...service, selected } : service
        );
        
        // Recalculate totals
        const packagePrice = data.package?.price || 0;
        const additionalServicesTotal = updatedServices
          .filter(service => service.selected)
          .reduce((sum, service) => sum + service.price, 0);
          
        const subtotal = packagePrice + additionalServicesTotal;
        const tax = subtotal * 0.085; // 8.5% tax rate
        const total = subtotal + tax;
        
        return {
          ...data,
          additionalServices: updatedServices,
          payment: {
            ...data.payment,
            subtotal,
            tax,
            total
          }
        };
      });
    },
    
    // Set available additional services (typically called once during initialization)
    setAvailableAdditionalServices: (services: Array<{id: string; name: string; price: number}>) => {
      update(data => {
        // Convert to the right format and preserve selection state from existing services
        const existingServicesMap = new Map(
          data.additionalServices.map(service => [service.id, service.selected])
        );
        
        const updatedServices = services.map(service => ({
          ...service,
          selected: existingServicesMap.has(service.id) 
            ? existingServicesMap.get(service.id)! 
            : false
        }));
        
        return {
          ...data,
          additionalServices: updatedServices
        };
      });
    },
    
    // Update payment information
    updatePayment: (paymentInfo: Partial<TributeData['payment']>) => {
      update(data => {
        return {
          ...data,
          payment: {
            ...data.payment,
            ...paymentInfo
          }
        };
      });
    },
    
    // Apply a discount code
    applyDiscountCode: (code: string, discountPercent: number) => {
      update(data => {
        const subtotal = data.payment.subtotal;
        const discountAmount = subtotal * (discountPercent / 100);
        const total = subtotal + data.payment.tax - discountAmount;
        
        return {
          ...data,
          payment: {
            ...data.payment,
            discountCode: code,
            discountAmount,
            total
          }
        };
      });
    },
    
    // Get slug
    getSlug: () => {
      const currentData = get({ subscribe });
      return currentData.tributePage.slug;
    },
    
    // Update tribute page info
    updateTributePage: (tributePageInfo: Partial<TributeData['tributePage']>) => {
      update(data => {
        return {
          ...data,
          tributePage: {
            ...data.tributePage,
            ...tributePageInfo
          }
        };
      });
    },
    
    // Import FD form data - this is a key function for data propagation
    importFromFDForm: (formData: {
      deceasedName: string;
      dateOfBirth?: string;
      dateOfPassing: string;
      serviceDate: string;
      serviceTime: string;
      serviceLocation: string;
      serviceAddress: string;
      serviceCity: string;
      serviceState: string;
      serviceZipCode: string;
      serviceDuration: number;
      directorName: string;
      funeralHome: string;
      directorEmail: string;
      directorPhone: string;
      paymentChoice: 'credit_card' | 'invoice' | null;
    }) => {
      update(data => {
        // Generate slug from the deceased name
        const slug = formData.deceasedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
          
        // Generate a unique ID for the location
        const locationId = `loc_${Date.now()}`;
        
        return {
          ...data,
          deceased: {
            ...data.deceased,
            fullName: formData.deceasedName,
            dateOfBirth: formData.dateOfBirth || '',
            dateOfPassing: formData.dateOfPassing
          },
          service: {
            ...data.service,
            date: formData.serviceDate,
            time: formData.serviceTime,
            duration: formData.serviceDuration,
            location: {
              id: locationId,
              name: formData.serviceLocation,
              address: formData.serviceAddress,
              city: formData.serviceCity,
              state: formData.serviceState,
              zipCode: formData.serviceZipCode
            }
          },
          organizer: {
            ...data.organizer,
            name: formData.directorName,
            organization: formData.funeralHome,
            email: formData.directorEmail,
            phone: formData.directorPhone,
            type: 'funeral_director'
          },
          payment: {
            ...data.payment,
            method: formData.paymentChoice
          },
          tributePage: {
            ...data.tributePage,
            slug,
            customUrl: `http://www.tributestream.com/celebration-of-life-for-${slug}`
          }
        };
      });
    },
    
    // Import calculator data - ensures data propagation from calculator to checkout
    importFromCalculator: (calculatorData: {
      selectedPackage: { id: string; name: string; price: number; type: 'basic' | 'standard' | 'premium' } | null;
      additionalServices: Array<{ id: string; name: string; price: number; selected: boolean }>;
      scheduleDetails: {
        date: string;
        time: string;
        timeZone: string;
        duration: number;
        location?: {
          id: string;
          name: string;
          address: string;
          city: string;
          state: string;
          zipCode: string;
        };
      };
      payment: {
        subtotal: number;
        tax: number;
        total: number;
        discountCode?: string;
        discountAmount?: number;
        method: 'credit_card' | 'invoice' | null;
      };
    }) => {
      update(data => {
        return {
          ...data,
          package: calculatorData.selectedPackage,
          additionalServices: calculatorData.additionalServices,
          service: {
            ...data.service,
            date: calculatorData.scheduleDetails.date || data.service.date,
            time: calculatorData.scheduleDetails.time || data.service.time,
            timeZone: calculatorData.scheduleDetails.timeZone || data.service.timeZone,
            duration: calculatorData.scheduleDetails.duration || data.service.duration,
            location: calculatorData.scheduleDetails.location || data.service.location
          },
          payment: {
            ...data.payment,
            method: calculatorData.payment.method,
            subtotal: calculatorData.payment.subtotal,
            tax: calculatorData.payment.tax, 
            total: calculatorData.payment.total,
            discountCode: calculatorData.payment.discountCode,
            discountAmount: calculatorData.payment.discountAmount
          }
        };
      });
    }
  };
}

export const tributeDataStore = createTributeDataStore();