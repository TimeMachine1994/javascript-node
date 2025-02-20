<script lang="ts">
    import type { PaymentBookingFormData } from '$lib/types/payment-booking';
    import { goto } from '$app/navigation';
    import CheckoutContainer from '$lib/components/checkout/CheckoutContainer.svelte';

    export let data: { formData: PaymentBookingFormData };

    function handleComplete(completedData: PaymentBookingFormData) {
        // Here you would typically save the completed data
        // For MVP, we'll just navigate to a success page
        goto('/schedule/payment_booking/success');
    }

    function handleCancel() {
        // Navigate back to the previous page
        goto('/schedule');
    }
</script>

<div class="payment-booking">
    <div class="container">
        <header>
            <h1>Complete Your Booking</h1>
            <p>Please review your order and complete the payment process</p>
        </header>

        <main>
            <CheckoutContainer
                formData={data.formData}
                onComplete={handleComplete}
                onCancel={handleCancel}
            />
        </main>
    </div>
</div>

<style>
    .payment-booking {
        min-height: 100vh;
        background-color: #f8fafc;
        padding: 2rem 1rem;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    header {
        text-align: center;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 2rem;
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 0.5rem;
    }

    p {
        color: #64748b;
        font-size: 1.125rem;
    }

    main {
        margin: 0 auto;
    }

    @media (max-width: 640px) {
        .payment-booking {
            padding: 1rem 0;
        }

        header {
            padding: 0 1rem;
        }

        h1 {
            font-size: 1.5rem;
        }

        p {
            font-size: 1rem;
        }
    }
</style>