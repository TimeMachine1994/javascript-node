<script lang="ts">
    import type { PaymentBookingFormData } from '$lib/types/payment-booking';
    
    export let data: { formData: PaymentBookingFormData };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
</script>

<div class="checkout-display">
    <h1>Checkout Summary</h1>

    <!-- Package Details -->
    <section class="section">
        <h2>Package Details</h2>
        <div class="card">
            <h3>{data.formData.package.name} Package</h3>
            <div class="details">
                <p>Duration: {data.formData.package.duration} hours</p>
                <p>Date: {formatDate(data.formData.package.livestreamDate)}</p>
                <p>Time: {formatTime(data.formData.package.livestreamStartTime)}</p>
            </div>
        </div>
    </section>

    <!-- Service Locations -->
    <section class="section">
        <h2>Service Locations</h2>
        <div class="card">
            {#each data.formData.package.locations as location}
                <div class="location">
                    <h3>{location.name}</h3>
                    <p>{location.address}</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- Order Summary -->
    <section class="section">
        <h2>Order Summary</h2>
        <div class="card">
            <div class="order-items">
                {#each data.formData.orderDetails.pricing.items as item}
                    <div class="order-item">
                        <span class="item-name">{item.name}</span>
                        <span class="item-price">{formatCurrency(item.price)}</span>
                    </div>
                {/each}
            </div>
            <div class="total">
                <span>Total</span>
                <span>{formatCurrency(data.formData.orderDetails.pricing.total)}</span>
            </div>
        </div>
    </section>

    <!-- Contact Information -->
    <section class="section">
        <h2>Contact Information</h2>
        <div class="card">
            <div class="contact-info">
                <p class="name">{data.formData.personalDetails.firstName} {data.formData.personalDetails.lastName}</p>
                <p class="email">{data.formData.personalDetails.email}</p>
                <p class="phone">{data.formData.personalDetails.phone}</p>
            </div>
        </div>
    </section>
</div>

<style>
    .checkout-display {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: #333;
    }

    .section {
        margin-bottom: 2rem;
    }

    h2 {
        font-size: 1.5rem;
        color: #555;
        margin-bottom: 1rem;
    }

    .card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .details p {
        margin: 0.5rem 0;
        color: #666;
    }

    .location {
        padding: 1rem 0;
        border-bottom: 1px solid #eee;
    }

    .location:last-child {
        border-bottom: none;
    }

    .location h3 {
        color: #333;
        margin-bottom: 0.5rem;
    }

    .order-items {
        margin-bottom: 1rem;
    }

    .order-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        color: #666;
    }

    .total {
        display: flex;
        justify-content: space-between;
        padding-top: 1rem;
        border-top: 2px solid #eee;
        font-weight: bold;
        color: #333;
    }

    .contact-info {
        color: #666;
    }

    .contact-info p {
        margin: 0.5rem 0;
    }

    .name {
        font-weight: bold;
        color: #333;
    }

    @media (max-width: 600px) {
        .checkout-display {
            padding: 1rem;
        }

        .card {
            padding: 1rem;
        }
    }
</style>