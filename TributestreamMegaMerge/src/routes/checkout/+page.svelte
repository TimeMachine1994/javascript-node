<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import CheckoutContainer from '$lib/components/checkout/CheckoutContainer.svelte';
    import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte';
    import type { OrderData } from '$lib/types/memorial-calculator';
    import type { PaymentBookingFormData } from '$lib/types/checkout';

    // Get calculator data from navigation state
    let calculatorData = $state<OrderData | null>(null);
    let isLoading = $state(false);
    let loadingMessage = $state('');

    // Initialize on mount
    $effect(() => {
        const state = $page.state;
        if (state && 'calculatorData' in state) {
            calculatorData = state.calculatorData as OrderData;
        } else {
            // Redirect back to calculator if no data
            goto('/calc');
        }
    });

    // Transform calculator data to checkout form data
    function mapCalculatorToFormData(data: OrderData): PaymentBookingFormData {
        return {
            personalDetails: {
                firstName: data.personalDetails.firstName,
                lastName: data.personalDetails.lastName,
                email: data.personalDetails.email,
                phone: data.personalDetails.phone,
                relationship: '', // To be filled during checkout
            },
            billingAddress: {
                street: '',
                city: '',
                state: '',
                zip: '',
                country: 'US',
            },
            orderDetails: {
                pricing: {
                    items: data.orderDetails.pricing.items,
                    subtotal: data.orderDetails.pricing.subtotal,
                    total: data.orderDetails.pricing.total,
                },
                package: {
                    name: data.package.name,
                    scheduleDays: data.package.scheduleDays,
                    price: data.orderDetails.pricing.total
                }
            },
            package: {
                name: data.package.name,
                scheduleDays: data.package.scheduleDays,
                price: data.orderDetails.pricing.total
            }
        };
    }

    // Handle checkout completion
    async function handleCheckoutComplete(formData: PaymentBookingFormData) {
        try {
            isLoading = true;
            loadingMessage = 'Processing your order...';

            // Send order to API
            const response = await fetch('/api/tributes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const result = await response.json();

            // Navigate to success page
            goto(`/checkout/success?order=${result.tribute.id}`);
        } catch (error) {
            console.error('Checkout error:', error);
            // Handle error (could add error state and display)
            loadingMessage = '';
            isLoading = false;
        }
    }

    // Handle checkout cancellation
    function handleCheckoutCancel() {
        // Return to calculator
        goto('/calc');
    }
</script>

{#if isLoading}
    <LoadingOverlay message={loadingMessage} isTransparent={true} />
{/if}

{#if calculatorData}
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">
            Complete Your Memorial Service Booking
        </h1>

        <CheckoutContainer
            formData={mapCalculatorToFormData(calculatorData)}
            onComplete={handleCheckoutComplete}
            onCancel={handleCheckoutCancel}
        />
    </div>
{:else}
    <div class="flex items-center justify-center min-h-screen">
        <LoadingOverlay message="Loading checkout..." />
    </div>
{/if}

<style lang="postcss">
    /* Add any page-specific styles here */
</style>