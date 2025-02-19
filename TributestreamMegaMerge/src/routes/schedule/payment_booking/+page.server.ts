import type { PageServerLoad } from './$types';
import type { 
    CookieDataTransformer, 
    CalculatorCookieData, 
    MemorialFormCookieData,
    PaymentBookingFormData 
} from '$lib/types/payment-booking';

export const load: PageServerLoad = async ({ cookies }) => {
    // Get calculator data from cookie
    const calcDataStr = cookies.get('calculator_data');
    const calcData: CalculatorCookieData = calcDataStr ? JSON.parse(calcDataStr) : null;

    // Get memorial form data from cookie
    const memorialDataStr = cookies.get('memorial_form_data');
    const memorialData: MemorialFormCookieData = memorialDataStr ? JSON.parse(memorialDataStr) : null;

    // Define data transformers
    const transformer: CookieDataTransformer = {
        fromCalculatorCookie: (data: CalculatorCookieData): Partial<PaymentBookingFormData> => ({
            package: {
                name: data.selectedPackage,
                duration: data.duration,
                livestreamDate: data.livestreamDate,
                livestreamStartTime: data.livestreamStartTime,
                locations: data.locations
            },
            orderDetails: {
                pricing: {
                    items: data.cartItems,
                    subtotal: data.total,
                    total: data.total
                },
                package: {
                    name: data.selectedPackage,
                    duration: data.duration,
                    livestreamDate: data.livestreamDate,
                    livestreamStartTime: data.livestreamStartTime,
                    locations: data.locations
                }
            }
        }),
        fromMemorialFormCookie: (data: MemorialFormCookieData): Partial<PaymentBookingFormData> => ({
            personalDetails: {
                firstName: data.director.firstName,
                lastName: data.director.lastName,
                email: data.contact.email,
                phone: data.contact.phone
            }
        })
    };

    // Transform and merge data
    const formData: Partial<PaymentBookingFormData> = {
        ...(calcData ? transformer.fromCalculatorCookie(calcData) : {}),
        ...(memorialData ? transformer.fromMemorialFormCookie(memorialData) : {})
    };

    // Validate required data is present
    if (!calcData || !memorialData) {
        throw new Error('Missing required booking data. Please complete the calculator and memorial form first.');
    }

    return {
        formData
    };
};