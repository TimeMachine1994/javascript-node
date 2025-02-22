<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { useAuth } from '$lib/hooks/useAuth';

    const { isAuthenticated, isLoading } = useAuth();

    onMount(() => {
        const unsubscribe = isAuthenticated.subscribe(authenticated => {
            if (!isLoading && !authenticated) {
                // Redirect to login page if not authenticated
                goto('/login');
            }
        });

        return () => unsubscribe();
    });
</script>

{#if $isLoading}
    <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p class="mt-4 text-gray-600">Loading...</p>
        </div>
    </div>
{:else if $isAuthenticated}
    <slot />
{/if}