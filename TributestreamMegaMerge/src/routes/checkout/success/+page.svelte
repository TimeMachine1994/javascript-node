<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Tribute } from '$lib/types/api';

    export let data: PageData;
    const order = data.order as Tribute;

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div class="text-center">
                <!-- Success Icon -->
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <!-- Order Confirmation -->
                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                    Thank You!
                </h2>
                <p class="mt-2 text-sm text-gray-600">
                    Your memorial service has been booked successfully.
                </p>

                <!-- Order Details -->
                <div class="mt-8 border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900">Order Details</h3>
                    <dl class="mt-4 space-y-4">
                        <div class="flex justify-between">
                            <dt class="text-sm font-medium text-gray-600">Order Number</dt>
                            <dd class="text-sm text-gray-900">{order.id}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-sm font-medium text-gray-600">Package</dt>
                            <dd class="text-sm text-gray-900">{order.order_details.package.name}</dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-sm font-medium text-gray-600">Total Amount</dt>
                            <dd class="text-sm text-gray-900">
                                {formatCurrency(order.order_details.pricing.total)}
                            </dd>
                        </div>
                        <div class="flex justify-between">
                            <dt class="text-sm font-medium text-gray-600">Status</dt>
                            <dd class="text-sm text-green-600 capitalize">{order.status}</dd>
                        </div>
                    </dl>
                </div>

                <!-- Schedule Summary -->
                <div class="mt-8 border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900">Service Schedule</h3>
                    <div class="mt-4 space-y-6">
                        {#each order.order_details.package.scheduleDays as day}
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h4 class="font-medium text-gray-900">
                                    {formatDate(day.date)}
                                </h4>
                                <div class="mt-2 space-y-2">
                                    {#each day.locations as location}
                                        <div class="text-sm text-gray-600">
                                            <p class="font-medium">{location.name}</p>
                                            <p>{location.address}</p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Next Steps -->
                <div class="mt-8 border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-medium text-gray-900">What's Next?</h3>
                    <ul class="mt-4 text-sm text-gray-600 space-y-2">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• Our team will review your booking</li>
                        <li>• We'll contact you to confirm all details</li>
                    </ul>
                </div>

                <!-- Actions -->
                <div class="mt-8 space-y-4">
                    <button
                        type="button"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => goto('/dashboard')}
                    >
                        Go to Dashboard
                    </button>
                    <button
                        type="button"
                        class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => goto('/')}
                    >
                        Return to Home
                    </button>
                </div>

                <!-- Support -->
                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Need help? Contact our support team at
                        <a href="mailto:support@tributestream.com" class="text-indigo-600 hover:text-indigo-500">
                            support@tributestream.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>