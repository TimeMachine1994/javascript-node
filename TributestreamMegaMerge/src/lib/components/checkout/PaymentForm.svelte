<script lang="ts">
    import type { PaymentFormProps } from '$lib/types/checkout';
    
    interface PaymentMethod {
        tokenize: () => Promise<{
            status: string;
            token?: string;
            errors?: any[];
        }>;
        attach: (selector: string) => Promise<void>;
    }

    // Props using runes with type inference
    let props = $props();
    let amount = props.amount as PaymentFormProps['amount'];
    let squareConfig = props.squareConfig as PaymentFormProps['squareConfig'];
    let onPaymentComplete = props.onPaymentComplete as PaymentFormProps['onPaymentComplete'];
    let onError = props.onError as PaymentFormProps['onError'];

    // Local state
    let paymentStatus = $state('');
    let card = $state<PaymentMethod | null>(null);
    let isProcessing = $state(false);
    let saveCard = $state(false);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Initialize Square payment form
    async function initializePaymentForm() {
        try {
            // @ts-ignore - Square is loaded globally
            if (!window.Square) {
                throw new Error('Square.js failed to load properly');
            }

            // @ts-ignore - Square is loaded globally
            const payments = window.Square.payments(
                squareConfig.applicationId,
                squareConfig.locationId
            );

            const newCard = await payments.card();
            await newCard.attach('#card-container');
            card = newCard;
        } catch (e: unknown) {
            const error = e instanceof Error ? e.message : String(e);
            console.error('Initializing Card failed:', error);
            onError(new Error(`Failed to initialize payment form: ${error}`));
        }
    }

    // Handle payment submission
    async function handlePaymentSubmission(event: Event) {
        event.preventDefault();
        
        if (!card || isProcessing) return;

        try {
            isProcessing = true;
            paymentStatus = 'Processing payment...';

            const result = await card.tokenize();
            
            if (result.status === 'OK' && result.token) {
                await onPaymentComplete(result.token);
                paymentStatus = 'Payment completed successfully';
            } else {
                throw new Error(
                    result.errors 
                        ? `Validation failed: ${JSON.stringify(result.errors)}`
                        : 'Failed to process payment'
                );
            }
        } catch (e: unknown) {
            const error = e instanceof Error ? e.message : String(e);
            paymentStatus = 'Payment failed';
            onError(new Error(`Payment processing failed: ${error}`));
        } finally {
            isProcessing = false;
        }
    }

    // Initialize the payment form on mount
    $effect(() => {
        initializePaymentForm();
    });
</script>

<div class="payment-form">
    <h2>Payment Details</h2>
    <p class="subtitle">Secure payment processing by Square</p>

    <div class="amount-display">
        <span>Total Amount:</span>
        <span class="amount">{formatCurrency(amount)}</span>
    </div>

    <form on:submit={handlePaymentSubmission}>
        <div class="card-container">
            <label class="label">
                Card Information <span class="required">*</span>
            </label>
            <div 
                id="card-container" 
                class="square-card-input"
                class:processing={isProcessing}
            ></div>
        </div>

        <div class="save-card-option">
            <label class="checkbox-label">
                <input
                    type="checkbox"
                    bind:checked={saveCard}
                    disabled={isProcessing}
                />
                <span>Save card for future payments</span>
            </label>
        </div>

        <button
            type="submit"
            class="submit-button"
            disabled={isProcessing || !card}
        >
            {#if isProcessing}
                Processing...
            {:else}
                Pay {formatCurrency(amount)}
            {/if}
        </button>

        {#if paymentStatus}
            <div class="status-message" class:error={paymentStatus.includes('failed')}>
                {paymentStatus}
            </div>
        {/if}
    </form>
</div>

<style>
    .payment-form {
        color: #1e293b;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #0f172a;
    }

    .subtitle {
        color: #64748b;
        margin-bottom: 2rem;
        font-size: 0.875rem;
    }

    .amount-display {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        background-color: #f8fafc;
        border-radius: 0.375rem;
        margin-bottom: 2rem;
    }

    .amount {
        font-size: 1.25rem;
        font-weight: 600;
        color: #0f172a;
    }

    .card-container {
        margin-bottom: 1.5rem;
    }

    .label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        color: #334155;
        margin-bottom: 0.5rem;
    }

    .required {
        color: #ef4444;
    }

    .square-card-input {
        min-height: 45px;
        padding: 0.625rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        transition: all 0.2s;
    }

    .square-card-input:focus-within {
        border-color: #4f46e5;
        box-shadow: 0 0 0 1px #4f46e5;
    }

    .square-card-input.processing {
        opacity: 0.7;
        pointer-events: none;
    }

    .save-card-option {
        margin-bottom: 1.5rem;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: #334155;
        font-size: 0.875rem;
    }

    .checkbox-label input[type="checkbox"] {
        width: 1rem;
        height: 1rem;
    }

    .submit-button {
        width: 100%;
        padding: 0.75rem;
        background-color: #4f46e5;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .submit-button:hover:not(:disabled) {
        background-color: #4338ca;
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .status-message {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 0.375rem;
        text-align: center;
        background-color: #f0fdf4;
        color: #166534;
    }

    .status-message.error {
        background-color: #fef2f2;
        color: #991b1b;
    }

    @media (max-width: 640px) {
        .amount-display {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
        }
    }
</style>