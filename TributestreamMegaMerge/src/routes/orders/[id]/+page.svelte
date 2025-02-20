<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Tribute } from '$lib/types/api';
    import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

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

    function formatTime(timeStr: string): string {
        return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function getStatusColor(status: string): string {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">
            Order #{order.id}
        </h1>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium {getStatusColor(order.meta.payment_status)}">
            {order.meta.payment_status}
        </span>
    </div>

    <!-- Order Summary -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <dt class="text-sm font-medium text-gray-500">Package</dt>
                <dd class="mt-1 text-sm text-gray-900">{order.order_details.package.name}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Order Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{formatDate(order.created_at)}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
                <dd class="mt-1 text-sm text-gray-900">{formatCurrency(order.order_details.pricing.total)}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Payment Status</dt>
                <dd class="mt-1 text-sm text-gray-900 capitalize">{order.meta.payment_status}</dd>
            </div>
        </dl>
    </div>

    <!-- Service Schedule -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Service Schedule</h2>
        <div class="space-y-6">
            {#each order.order_details.package.scheduleDays as day}
                <div class="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        {formatDate(day.date)}
                    </h3>
                    <div class="space-y-4">
                        {#each day.locations as location}
                            <div class="bg-gray-50 rounded-lg p-4">
                                <div class="grid gap-2">
                                    <div class="font-medium text-gray-900">{location.name}</div>
                                    <div class="text-sm text-gray-600">{location.address}</div>
                                    <div class="flex justify-between text-sm text-gray-600">
                                        <span>Start Time: {formatTime(location.startTime)}</span>
                                        <span>Duration: {location.duration} hours</span>
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
    </div>

    <!-- Contact Information -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
        <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="mt-1 text-sm text-gray-900">
                    {order.personal_details.firstName} {order.personal_details.lastName}
                </dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{order.personal_details.email}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Phone</dt>
                <dd class="mt-1 text-sm text-gray-900">{order.personal_details.phone}</dd>
            </div>
            <div>
                <dt class="text-sm font-medium text-gray-500">Relationship</dt>
                <dd class="mt-1 text-sm text-gray-900">{order.personal_details.relationship || 'Not specified'}</dd>
            </div>
        </dl>
    </div>

    <!-- Actions -->
    <div class="flex justify-between items-center">
        <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click={() => goto('/dashboard')}
        >
            Back to Dashboard
        </button>

        <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click={() => window.print()}
        >
            Print Order Details
        </button>
    </div>
</div>

<style>
    @media print {
        .max-w-7xl {
            max-width: none;
            margin: 0;
            padding: 0;
        }

        button {
            display: none !important;
        }
    }
</style>