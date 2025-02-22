<script lang="ts">
    import type { UserMetadataPageData } from '$lib/types/user-metadata';

    const { data } = $props<{ data: UserMetadataPageData['pricing'] }>();

    // Format currency for display
    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
</script>

<div class="rounded-lg border bg-white p-6 shadow-sm">
    <h3 class="text-2xl font-semibold mb-4">Pricing Details</h3>
    
    <!-- Cart Items -->
    <div class="space-y-4 mb-6">
        <h4 class="text-lg font-medium">Items</h4>
        <div class="space-y-2">
            {#each data.items as item}
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-base">{item.name}</span>
                    <span class="text-base font-medium">{formatCurrency(item.price)}</span>
                </div>
            {/each}
        </div>
    </div>

    <!-- Total -->
    <div class="pt-4 border-t border-gray-200">
        <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">Total</span>
            <span class="text-lg font-bold">{formatCurrency(data.total)}</span>
        </div>
    </div>
</div>