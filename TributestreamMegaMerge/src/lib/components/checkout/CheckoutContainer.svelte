<script lang="ts">
    import type { CheckoutContainerProps, CheckoutState, CheckoutStep } from '$lib/types/checkout';
    import { validationRules, validateFields } from '$lib/types/checkout';
    import OrderSummary from './OrderSummary.svelte';
    import BuyerInformation from './BuyerInformation.svelte';
    import BillingDetails from './BillingDetails.svelte';
    import PaymentForm from './PaymentForm.svelte';

    // Props using runes with type inference
    let props = $props();
    let formData = props.formData;
    let onComplete = props.onComplete;
    let onCancel = props.onCancel;

    // State management using runes
    let state = $state<CheckoutState>({
        currentStep: 'summary',
        orderData: formData.orderDetails.pricing,
        buyerInfo: formData.personalDetails,
        billingAddress: formData.billingAddress,
        shippingAddress: formData.shippingAddress,
        useShippingAddress: !!formData.shippingAddress,
        paymentMethod: 'card',
        saveCard: false,
        isLoading: false,
        errors: {}
    });

    // Derived values
    let isValid = $derived(Object.keys(state.errors).length === 0);
    let canProceed = $derived(isValid && !state.isLoading);

    // Step configuration
    const steps: CheckoutStep[] = ['summary', 'buyer', 'billing', 'payment', 'confirmation'];
    let currentStepIndex = $derived(steps.indexOf(state.currentStep));

    // Navigation functions
    function nextStep() {
        if (currentStepIndex < steps.length - 1 && canProceed) {
            validateCurrentStep();
            if (isValid) {
                state.currentStep = steps[currentStepIndex + 1];
            }
        }
    }

    function previousStep() {
        if (currentStepIndex > 0) {
            state.currentStep = steps[currentStepIndex - 1];
        }
    }

    // Validation
    function validateCurrentStep() {
        state.errors = {};
        
        switch (state.currentStep) {
            case 'buyer':
                state.errors = validateFields(state.buyerInfo as unknown as Record<string, string>, {
                    firstName: validationRules.required,
                    lastName: validationRules.required,
                    email: validationRules.email,
                    phone: validationRules.phone
                });
                break;
            
            case 'billing':
                state.errors = validateFields(state.billingAddress as unknown as Record<string, string>, {
                    street: validationRules.required,
                    city: validationRules.required,
                    state: validationRules.required,
                    zip: validationRules.zipCode,
                    country: validationRules.required
                });
                
                if (state.useShippingAddress && state.shippingAddress) {
                    const shippingErrors = validateFields(
                        state.shippingAddress as unknown as Record<string, string>,
                        {
                            street: validationRules.required,
                            city: validationRules.required,
                            state: validationRules.required,
                            zip: validationRules.zipCode,
                            country: validationRules.required
                        }
                    );
                    state.errors = { ...state.errors, ...shippingErrors };
                }
                break;
        }
    }

    // Event handlers
    function handleBuyerUpdate(buyerData: typeof state.buyerInfo) {
        state.buyerInfo = buyerData;
        state.errors = {};
    }

    function handleBillingUpdate(billingData: { 
        billing: typeof state.billingAddress;
        shipping?: typeof state.shippingAddress;
        useShippingAddress: boolean;
    }) {
        state.billingAddress = billingData.billing;
        state.shippingAddress = billingData.shipping;
        state.useShippingAddress = billingData.useShippingAddress;
        state.errors = {};
    }

    async function handlePaymentComplete(token: string) {
        try {
            state.isLoading = true;
            // Here you would typically make an API call to process the payment
            // For MVP, we'll just simulate a successful payment
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const completedFormData = {
                ...formData,
                personalDetails: state.buyerInfo,
                billingAddress: state.billingAddress,
                shippingAddress: state.shippingAddress
            };
            
            onComplete(completedFormData);
            state.currentStep = 'confirmation';
        } catch (error) {
            console.error('Payment processing failed:', error);
            state.errors = { payment: 'Payment processing failed. Please try again.' };
        } finally {
            state.isLoading = false;
        }
    }

    function handlePaymentError(error: Error) {
        state.errors = { payment: error.message };
    }
</script>

<div class="checkout-container">
    <!-- Progress indicator -->
    <div class="progress-bar">
        {#each steps as step, index}
            <div 
                class="step" 
                class:active={currentStepIndex === index}
                class:completed={currentStepIndex > index}
            >
                <div class="step-number">{index + 1}</div>
                <div class="step-label">{step}</div>
            </div>
        {/each}
    </div>

    <!-- Main content -->
    <div class="content">
        {#if state.currentStep === 'summary'}
            <OrderSummary
                pricing={state.orderData}
                packageDetails={formData.package}
            />
        {:else if state.currentStep === 'buyer'}
            <BuyerInformation
                initialData={state.buyerInfo}
                onUpdate={handleBuyerUpdate}
                errors={state.errors}
            />
        {:else if state.currentStep === 'billing'}
            <BillingDetails
                initialData={{
                    billing: state.billingAddress,
                    shipping: state.shippingAddress
                }}
                useShippingAddress={state.useShippingAddress}
                onUpdate={handleBillingUpdate}
                errors={state.errors}
            />
        {:else if state.currentStep === 'payment'}
            <PaymentForm
                amount={state.orderData.total}
                squareConfig={{
                    applicationId: import.meta.env.VITE_SQUARE_APP_ID,
                    locationId: import.meta.env.VITE_SQUARE_LOCATION_ID
                }}
                onPaymentComplete={handlePaymentComplete}
                onError={handlePaymentError}
            />
        {:else if state.currentStep === 'confirmation'}
            <div class="confirmation">
                <h2>Thank you for your order!</h2>
                <p>Your payment has been processed successfully.</p>
                <p>You will receive a confirmation email shortly.</p>
            </div>
        {/if}
    </div>

    <!-- Navigation buttons -->
    <div class="navigation">
        {#if state.currentStep !== 'confirmation'}
            {#if currentStepIndex > 0}
                <button
                    type="button"
                    class="btn btn-secondary"
                    on:click={previousStep}
                    disabled={state.isLoading}
                >
                    Previous
                </button>
            {/if}

            {#if currentStepIndex < steps.length - 2}
                <button
                    type="button"
                    class="btn btn-primary"
                    on:click={nextStep}
                    disabled={!canProceed}
                >
                    Next
                </button>
            {:else if state.currentStep === 'payment'}
                <!-- Payment form has its own submit button -->
            {:else}
                <button
                    type="button"
                    class="btn btn-primary"
                    on:click={onCancel}
                    disabled={state.isLoading}
                >
                    Cancel
                </button>
            {/if}
        {/if}
    </div>
</div>

<style>
    .checkout-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    .progress-bar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        padding: 0 1rem;
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        position: relative;
    }

    .step:not(:last-child)::after {
        content: '';
        position: absolute;
        top: 1rem;
        left: 50%;
        width: 100%;
        height: 2px;
        background-color: #e2e8f0;
    }

    .step.completed:not(:last-child)::after {
        background-color: #4f46e5;
    }

    .step-number {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: #e2e8f0;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        margin-bottom: 0.5rem;
        z-index: 1;
    }

    .step.active .step-number {
        background-color: #4f46e5;
        color: white;
    }

    .step.completed .step-number {
        background-color: #4f46e5;
        color: white;
    }

    .step-label {
        font-size: 0.875rem;
        color: #64748b;
        text-transform: capitalize;
    }

    .step.active .step-label {
        color: #1e293b;
        font-weight: 500;
    }

    .content {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        padding: 2rem;
        margin-bottom: 2rem;
    }

    .navigation {
        display: flex;
        justify-content: space-between;
        padding: 1rem 0;
    }

    .btn {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-primary {
        background-color: #4f46e5;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background-color: #4338ca;
    }

    .btn-secondary {
        background-color: #e2e8f0;
        color: #1e293b;
    }

    .btn-secondary:hover:not(:disabled) {
        background-color: #cbd5e1;
    }

    .confirmation {
        text-align: center;
        padding: 2rem;
    }

    .confirmation h2 {
        color: #4f46e5;
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    @media (max-width: 640px) {
        .checkout-container {
            padding: 1rem;
        }

        .progress-bar {
            padding: 0;
        }

        .step-label {
            display: none;
        }

        .content {
            padding: 1rem;
        }
    }
</style>