<script lang="ts">
    import type { OrderSummaryProps } from '$lib/types/checkout';
    
    // Props
    export let pricing: OrderSummaryProps['pricing'];
    export let packageDetails: OrderSummaryProps['packageDetails'];

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

<div class="order-summary">
    <h2>Order Summary</h2>

    <!-- Package Details -->
    <div class="section">
        <h3>Package Details</h3>
        <div class="details">
            <div class="detail-row">
                <span>Package</span>
                <span>{packageDetails.name}</span>
            </div>
            <div class="detail-row">
                <span>Duration</span>
                <span>{packageDetails.duration} hours</span>
            </div>
            <div class="detail-row">
                <span>Date</span>
                <span>{formatDate(packageDetails.livestreamDate)}</span>
            </div>
            <div class="detail-row">
                <span>Time</span>
                <span>{formatTime(packageDetails.livestreamStartTime)}</span>
            </div>
        </div>
    </div>

    <!-- Service Locations -->
    <div class="section">
        <h3>Service Locations</h3>
        {#each packageDetails.locations as location}
            <div class="location">
                <h4>{location.name}</h4>
                <p>{location.address}</p>
            </div>
        {/each}
    </div>

    <!-- Pricing Details -->
    <div class="section">
        <h3>Price Breakdown</h3>
        <div class="pricing">
            {#each pricing.items as item}
                <div class="price-row">
                    <span class="item-name">{item.name}</span>
                    <span class="item-type">{item.type || 'service'}</span>
                    <span class="item-price">{formatCurrency(item.price)}</span>
                </div>
            {/each}
            
            <div class="subtotal price-row">
                <span>Subtotal</span>
                <span>{formatCurrency(pricing.subtotal)}</span>
            </div>
            
            {#if pricing.total !== pricing.subtotal}
                <div class="total price-row">
                    <span>Total</span>
                    <span>{formatCurrency(pricing.total)}</span>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .order-summary {
        color: #1e293b;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        color: #0f172a;
    }

    h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: #334155;
    }

    .section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }

    .details {
        display: grid;
        gap: 0.75rem;
    }

    .detail-row {
        display: flex;
        justify-content: space-between;
        color: #64748b;
    }

    .location {
        background-color: #f8fafc;
        padding: 1rem;
        border-radius: 0.375rem;
        margin-bottom: 0.75rem;
    }

    .location:last-child {
        margin-bottom: 0;
    }

    .location h4 {
        font-weight: 500;
        margin-bottom: 0.25rem;
        color: #334155;
    }

    .location p {
        color: #64748b;
        font-size: 0.875rem;
    }

    .pricing {
        display: grid;
        gap: 0.75rem;
    }

    .price-row {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 1rem;
        align-items: center;
    }

    .item-name {
        color: #64748b;
    }

    .item-type {
        color: #94a3b8;
        font-size: 0.875rem;
        text-transform: capitalize;
    }

    .item-price {
        color: #64748b;
        font-variant-numeric: tabular-nums;
    }

    .subtotal {
        padding-top: 0.75rem;
        margin-top: 0.75rem;
        border-top: 1px dashed #e2e8f0;
        font-weight: 500;
    }

    .total {
        padding-top: 0.75rem;
        margin-top: 0.75rem;
        border-top: 2px solid #e2e8f0;
        font-weight: 600;
        color: #0f172a;
    }

    @media (max-width: 640px) {
        .price-row {
            grid-template-columns: 1fr auto;
        }

        .item-type {
            display: none;
        }
    }
</style>
