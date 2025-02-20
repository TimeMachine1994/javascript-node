<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div class="text-center">
                <!-- Error Icon -->
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                            stroke-linecap="round" 
                            stroke-linejoin="round" 
                            stroke-width="2" 
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                    {#if $page.status === 401}
                        Please Sign In
                    {:else if $page.status === 403}
                        Access Denied
                    {:else}
                        Unable to Load Dashboard
                    {/if}
                </h2>
                
                <p class="mt-2 text-sm text-gray-600">
                    {$page.error?.message || 'We encountered an error while loading your orders.'}
                </p>

                <div class="mt-8 space-y-4">
                    {#if $page.status === 401}
                        <button
                            type="button"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            on:click={() => goto('/login')}
                        >
                            Sign In
                        </button>
                    {:else}
                        <button
                            type="button"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            on:click={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    {/if}
                    
                    <button
                        type="button"
                        class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => goto('/')}
                    >
                        Return to Home
                    </button>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-600">
                        Need help? Contact our support team at
                        <a 
                            href="mailto:support@tributestream.com" 
                            class="text-indigo-600 hover:text-indigo-500"
                        >
                            support@tributestream.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>