<script lang="ts">
    import type { OrderSummaryProps } from '$lib/types/checkout';
    import type { ScheduleDay } from '$lib/types/memorial-calculator';
    
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
        return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Calculate duration display
    const getDurationDisplay = (duration: number) => {
        if (duration === 1) return '1 hour';
        return `${duration} hours`;
    };

    // Group items by type for display
    const groupedItems = pricing.items.reduce((acc, item) => {
        const type = item.description || 'Base Package';
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
    }, {} as Record<string, typeof pricing.items>);
</script>

<div class="order-summary bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>

    <!-- Package Details -->
    <div class="mb-8 pb-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Package Details</h3>
        <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid gap-3">
                <div class="flex justify-between">
                    <span class="text-gray-600">Selected Package</span>
                    <span class="font-medium text-gray-900">{packageDetails.name}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Schedule Details -->
    <div class="mb-8 pb-6 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Service Schedule</h3>
        {#each packageDetails.scheduleDays as day}
            <div class="mb-4 last:mb-0">
                <div class="font-medium text-gray-900 mb-2">
                    {formatDate(day.date)}
                </div>
                <div class="space-y-3">
                    {#each day.locations as location}
                        <div class="bg-gray-50 rounded-lg p-4">
                            <div class="grid gap-2">
                                <div class="font-medium text-gray-900">{location.name}</div>
                                <div class="text-sm text-gray-600">{location.address}</div>
                                <div class="flex justify-between text-sm text-gray-600">
                                    <span>Start Time: {formatTime(location.startTime)}</span>
                                    <span>Duration: {getDurationDisplay(location.duration)}</span>
                                </div>
                                {#if location.travelExceedsHour}
                                    <div class="mt-2 text-amber-600 text-sm">
                                        Note: Travel time exceeds 1 hour
                                    </div>
                                {/if}
                                {#if location.notes}
                                    <div class="mt-2 text-gray-600 text-sm">
                                        Notes: {location.notes}
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <!-- Price Breakdown -->
    <div>
        <h3 class="text-lg font-medium text-gray-900 mb-4">Price Breakdown</h3>
        <div class="space-y-4">
            {#each Object.entries(groupedItems) as [type, items]}
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="font-medium text-gray-900 mb-2">{type}</div>
                    {#each items as item}
                        <div class="flex justify-between text-sm text-gray-600">
                            <span>{item.name}</span>
                            <span class="font-medium">{formatCurrency(item.price)}</span>
                        </div>
                    {/each}
                </div>
            {/each}

            <!-- Subtotal -->
            <div class="pt-4 border-t border-gray-200">
                <div class="flex justify-between">
                    <span class="font-medium text-gray-900">Subtotal</span>
                    <span class="font-medium text-gray-900">{formatCurrency(pricing.subtotal)}</span>
                </div>
            </div>

            <!-- Total -->
            <div class="pt-4 border-t-2 border-gray-200">
                <div class="flex justify-between">
                    <span class="text-lg font-semibold text-gray-900">Total</span>
                    <span class="text-lg font-semibold text-gray-900">{formatCurrency(pricing.total)}</span>
                </div>
            </div>
        </div>
    </div>
</div>
