<script lang="ts">
    import type { SearchFormProps } from '$lib/types/home-page';

    let { 
        searchQuery = $bindable(),
        onSearch,
        onCreateClick,
        isSearching 
    } = $props();
</script>

<form on:submit={onSearch} class="w-full max-w-sm space-y-4">
    <div class="relative">
        <input
            id="searchQuery"
            type="text"
            bind:value={searchQuery}
            placeholder=" "
            required
            class="peer w-full border-b-2 border-gray-300 bg-transparent py-2 text-gray-900 placeholder-transparent
                   focus:border-blue-500 focus:outline-none"
        />
        <label
            for="searchQuery"
            class="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all
                   peer-placeholder-shown:top-2
                   peer-placeholder-shown:text-base
                   peer-placeholder-shown:text-gray-400
                   peer-focus:-top-3.5
                   peer-focus:text-blue-500
                   peer-focus:text-sm"
        >
            Enter loved ones name here
        </label>
    </div>

    <div class="flex justify-between">
        <button
            type="submit"
            disabled={isSearching}
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-all duration-200"
        >
            {isSearching ? 'Searching...' : 'Search'}
        </button>
        <button
            type="button"
            on:click={onCreateClick}
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                   transition-all duration-200"
        >
            Create
        </button>
    </div>
</form>