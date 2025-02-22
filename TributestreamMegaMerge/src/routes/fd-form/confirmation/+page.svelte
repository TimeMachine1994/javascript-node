<script lang="ts">
    import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
    import type { PageData } from './$types';
    import type { OrderData } from '$lib/types/memorial-calculator';
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { WPUserData } from '$lib/types/user-metadata';
    
    export let data: PageData;

    // Create a form with enhancement
    let form: HTMLFormElement;

    function handleSubmit() {
        return async ({ result }: { result: { type: string } }) => {
            if (result.type === 'success') {
                alert('Calculator data saved successfully!');
            } else {
                alert('Failed to save calculator data. Please try again.');
            }
        };
    }

    async function handleCalcSave(orderData: OrderData) {
        const formData = new FormData();
        formData.append('calculatorData', JSON.stringify(orderData));
        
        try {
            // Submit the form
            await form.requestSubmit();
        } catch (error) {
            console.error('Error in form submission:', error);
            alert('Failed to save calculator data. Please try again.');
        }
    }

    async function handleCheckout(orderData: OrderData) {
        try {
            await handleCalcSave(orderData);
            await goto('/schedule/payment_booking');
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    }

    // Get preview URL from memorial form data
    const location = data.userData[0]?.memorial_form_data?.memorial?.location || '';
    const previewUrl = location.split('-')[1]?.trim() || '';
    const qrCodeUrl = previewUrl ? 
        `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(previewUrl)}` : 
        '';

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
            onclick={() => goto('/schedule/payment_booking')}
            class="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 mb-2"
        >
            Continue to Payment
        </button>
        <p class="text-lg">To Complete The Reservation Process</p>
    </div>

    <MemorialCalculator
        data={{
            userData: data.userData,
            wpUserData
        }}
        onSave={handleCalcSave}
        onCheckout={handleCheckout}
    />
</form>
