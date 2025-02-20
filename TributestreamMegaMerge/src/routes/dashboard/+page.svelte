<script lang="ts">
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { Tribute } from '$lib/types/api';
    import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';

    export let data: PageData;

    function formatDate(dateStr: string): string {
        return new Date(dateStr).toLocaleDateString('en-US', {
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

    function handlePageChange(page: number) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', page.toString());
        goto(url.toString());
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">My Orders</h1>
        <p class="mt-2 text-sm text-gray-600">
            View and manage your memorial service orders
        </p>
    </div>

    <!-- Orders List -->
    {#if data.orders.length > 0}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <ul class="divide-y divide-gray-200">
                {#each data.orders as order}
                    <li>
                        <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div class="flex items-center justify-between">
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between">
                                        <p class="text-sm font-medium text-indigo-600 truncate">
                                            Order #{order.id}
                                        </p>
                                        <div class="ml-2 flex-shrink-0">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusColor(order.meta.payment_status)}">
                                                {order.meta.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="mt-2">
                                        <div class="flex items-center text-sm text-gray-500">
                                            <p>{order.order_details.package.name}</p>
                                            <span class="mx-2">•</span>
                                            <p>{formatCurrency(order.order_details.pricing.total)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <div class="text-right text-sm text-gray-500">
                                        {formatDate(order.created_at)}
                                    </div>
                                    <button
                                        type="button"
                                        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        on:click={() => goto(`/orders/${order.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>

            <!-- Pagination -->
            {#if data.pagination.totalPages > 1}
                <nav class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div class="hidden sm:block">
                        <p class="text-sm text-gray-700">
                            Showing
                            <span class="font-medium">{(data.pagination.currentPage - 1) * data.pagination.itemsPerPage + 1}</span>
                            to
                            <span class="font-medium">
                                {Math.min(data.pagination.currentPage * data.pagination.itemsPerPage, data.pagination.totalItems)}
                            </span>
                            of
                            <span class="font-medium">{data.pagination.totalItems}</span>
                            results
                        </p>
                    </div>
                    <div class="flex-1 flex justify-between sm:justify-end">
                        {#if data.pagination.currentPage > 1}
                            <button
                                type="button"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                on:click={() => handlePageChange(data.pagination.currentPage - 1)}
                            >
                                Previous
                            </button>
                        {/if}
                        {#if data.pagination.currentPage < data.pagination.totalPages}
                            <button
                                type="button"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                on:click={() => handlePageChange(data.pagination.currentPage + 1)}
                            >
                                Next
                            </button>
                        {/if}
                    </div>
                </nav>
            {/if}
        </div>
    {:else}
        <div class="text-center py-12 bg-white shadow rounded-lg">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No orders</h3>
            <p class="mt-1 text-sm text-gray-500">Get started by creating a new memorial service.</p>
            <div class="mt-6">
                <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    on:click={() => goto('/calc')}
                >
                    Create New Service
                </button>
            </div>
        </div>
    {/if}
</div>