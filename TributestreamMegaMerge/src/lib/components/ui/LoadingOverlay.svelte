<script lang="ts">
    import LoadingSpinner from './LoadingSpinner.svelte';
    
    export let message = 'Loading...';
    export let isTransparent = false;
</script>

<div
    class="fixed inset-0 flex items-center justify-center z-50"
    class:bg-white={!isTransparent}
    class:bg-white/80={isTransparent}
>
    <div class="text-center">
        <LoadingSpinner size="lg" />
        {#if message}
            <p class="mt-4 text-lg font-medium text-gray-900">{message}</p>
        {/if}
    </div>
</div>

<style>
    /* Ensure the overlay covers the entire viewport */
    div {
        min-height: 100vh;
        min-width: 100vw;
    }
</style>