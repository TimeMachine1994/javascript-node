<script lang="ts">
    import type { PageData } from './$types';
    import type { WPUserData, CalculatorData, PersonalDetails } from '$lib/types/user-metadata';
    import { enhance, type SubmitFunction } from '$app/forms';
    import { goto } from '$app/navigation';
    
    export let data: PageData;

    // Create a form with enhancement
    let form: HTMLFormElement;

    function handleSubmit(): SubmitFunction {
        return async ({ result }) => {
            if (result.type === 'success') {
                alert('Form data saved successfully!');
            } else {
                alert('Failed to save form data. Please try again.');
            }
        };
    }

    // Create a mock WPUserData from memorial form data
    const wpUserData: WPUserData = {
        displayName: data.userData[0]?.memorial_form_data?.familyMember?.name || '',
        email: data.userData[0]?.memorial_form_data?.contact?.email || '',
        nicename: data.userData[0]?.memorial_form_data?.familyMember?.name?.toLowerCase().replace(/\s+/g, '-') || '',
        roles: ['subscriber'],
        isAdmin: false,
        metaResult: {
            success: true,
            message: '',
            user_id: parseInt(data.userData[0]?.user_id || '0'),
            meta_key: 'memorial_form_data',
            meta_value: JSON.stringify(data.userData[0]?.memorial_form_data || {})
        }
    };

    // Get preview URL from memorial form data
    const location = data.userData[0]?.memorial_form_data?.memorial?.location || '';
    const previewUrl = location.split('-')[1]?.trim() || '';
    const qrCodeUrl = previewUrl ? 
        `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(previewUrl)}` : 
        '';

    // Create initial calculator data from form data
    const personalDetails: PersonalDetails = {
        firstName: data.userData[0]?.memorial_form_data?.familyMember?.name?.split(' ')[0] || '',
        lastName: data.userData[0]?.memorial_form_data?.familyMember?.name?.split(' ')[1] || '',
        email: data.userData[0]?.memorial_form_data?.contact?.email || '',
        phone: data.userData[0]?.memorial_form_data?.contact?.phone || '',
        preferences: {
            contactMethod: 'email',
            notifications: true
        }
    };

    const initialCalculatorData: CalculatorData = {
        meta: {
            status: 'draft',
            lastUpdated: new Date().toISOString(),
            version: '1.0.0'
        },
        scheduleDays: [],
        selectedPackage: {
            id: '',
            name: '',
            description: '',
            basePrice: 0,
            features: []
        },
        cart: {
            items: [],
            subtotal: 0,
            total: 0,
            discounts: [],
            taxes: []
        },
        personalDetails
    };

    // Function to navigate to calculator with data
    async function navigateToCalculator() {
        try {
            // Store the necessary data in sessionStorage to avoid URL length limitations
            sessionStorage.setItem('calculatorPrefillData', JSON.stringify({
                userData: data.userData,
                wpUserData,
                calculatorData: initialCalculatorData
            }));
            
            // Navigate to calculator page
            await goto('/calc');
        } catch (error) {
            console.error('Error navigating to calculator:', error);
            alert('Failed to proceed to calculator. Please try again.');
        }
    }
</script>

<form 
    bind:this={form}
    method="POST"
    action="?/saveCalculator"
    use:enhance={handleSubmit}
    class="contents"
>
    <div class="flex flex-col items-center justify-center text-center p-8">
        <h1 class="text-2xl font-bold mb-6">Memorial Service Confirmation</h1>
        <p class="text-xl mb-4">Tributestream offers their sincere condolences for your loss.</p>
        <p class="text-lg mb-6">Scan the QR code below to preview your memorial tribute page.</p>

        <div class="flex justify-center items-center mb-8">
            <div class="p-6 bg-white rounded-lg shadow-md">
                {#if previewUrl}
                    <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                        <img 
                            src={qrCodeUrl} 
                            alt="QR Code for memorial preview"
                            class="w-[100px] h-[100px]"
                        />
                    </a>
                {:else}
                    <div class="w-[100px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500 p-2 text-center">
                        Preview will be available after setup
                    </div>
                {/if}
            </div>
        </div>

        <button 
            type="button"
            on:click={navigateToCalculator}
            class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-2"
        >
            Continue to Payment
        </button>
        <p class="text-lg">To Complete The Reservation Process</p>
    </div>
</form>
