<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { SearchPageData } from './types';

    const { data } = $props<{ data: SearchPageData }>();
    
    const currentSearchParams = $derived($page.url.searchParams);
    let searchInput = $state(data.searchQuery || '');
    let isLoading = $state(false);

    // Debounced search function
    let searchTimeout: ReturnType<typeof setTimeout>;
    function handleSearch() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const params = new URLSearchParams(currentSearchParams);
            params.set('search', searchInput);
            params.set('page', '1'); // Reset to first page on new search
            isLoading = true;
            await goto(`?${params.toString()}`, { keepFocus: true });
            isLoading = false;
        }, 300);
    }

    // Pagination handler
    async function goToPage(page: number) {
        if (page < 1 || page > data.totalPages) return;
        const params = new URLSearchParams(currentSearchParams);
        params.set('page', page.toString());
        isLoading = true;
        await goto(`?${params.toString()}`);
        isLoading = false;
    }

    $effect(() => {
        // Update search input when URL changes
        searchInput = data.searchQuery;
    });
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Search Tributes</h1>

    <!-- Search input -->
    <div class="mb-8">
        <input
            type="search"
            bind:value={searchInput}
            on:input={handleSearch}
            placeholder="Search tributes..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p class="mt-2 text-sm text-gray-500">
            {#if data.totalItems > 0}
                Found {data.totalItems} tribute{data.totalItems === 1 ? '' : 's'}
                {data.searchQuery ? `for "${data.searchQuery}"` : ''}
            {/if}
        </p>
    </div>

    <!-- Loading state -->
    {#if isLoading}
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
    {:else if data.error}
        <!-- Error state -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {data.error}
        </div>
    {:else if data.tributes.length === 0}
        <!-- Empty state -->
        <div class="text-center py-8 text-gray-500">
            No tributes found{data.searchQuery ? ` for "${data.searchQuery}"` : ''}.
        </div>
    {:else}
        <!-- Results -->
        <div class="space-y-6">
            {#each data.tributes as tribute (tribute.id)}
                <div class="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h2 class="text-xl font-semibold mb-2">{tribute.loved_one_name}</h2>
                    {#if tribute.custom_html}
                        <div class="prose max-w-none mb-4">
                            {@html tribute.custom_html}
                        </div>
                    {/if}
                    <div class="text-sm text-gray-500">
                        Created: {new Date(tribute.created_at).toLocaleDateString()}
                    </div>
                </div>
            {/each}
        </div>

        <!-- Pagination -->
        {#if data.totalPages > 1}
            <div class="flex justify-center items-center space-x-2 mt-8">
                <button
                    class="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    disabled={data.currentPage === 1}
                    on:click={() => goToPage(data.currentPage - 1)}
                >
                    Previous
                </button>
                
                <span class="text-gray-600">
                    Page {data.currentPage} of {data.totalPages}
                </span>
                
                <button
                    class="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                    disabled={data.currentPage === data.totalPages}
                    on:click={() => goToPage(data.currentPage + 1)}
                >
                    Next
                </button>
            </div>
        {/if}
    {/if}
</div>