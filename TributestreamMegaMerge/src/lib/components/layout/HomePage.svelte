<script lang="ts">
    import { goto } from '$app/navigation';

    let searchQuery = $state('');
    let pageState = $state('home');
    let slugifiedText = $derived(
        searchQuery
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^-+|-+$/g, '')
    );

    async function handleSearch(event: Event) {
        event.preventDefault();
        if (searchQuery.trim()) {
            await goto(`/search?search=${encodeURIComponent(searchQuery)}`);
        }
    }

    function showCreate() {
        pageState = 'create';
    }

    function backToHome() {
        pageState = 'home';
        searchQuery = '';
    }
</script>

{#if pageState === 'home'}
    <section>
        <h1>Home Page</h1>

        <form on:submit={handleSearch} class="mb-4">
            <input 
                type="text" 
                bind:value={searchQuery}
                placeholder="Search..." 
                required
            />
            <button type="submit">Search</button>
        </form>

        {#if searchQuery.trim()}
            <button 
                on:click={showCreate}
                class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Show Slugified
            </button>
        {/if}
    </section>
{:else if pageState === 'create'}
    <section>
        <h1>Create Page</h1>
        <form>
          <input>
          
        </form>
        <div class="mt-4">
            <p>Original Text: <strong>{searchQuery}</strong></p>
            <p>Slugified Text: <strong>{slugifiedText}</strong></p>
        </div>

        <button 
            on:click={backToHome}
            class="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            Back to Home
        </button>
    </section>
{/if}