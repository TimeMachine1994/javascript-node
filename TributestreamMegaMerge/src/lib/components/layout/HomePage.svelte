
<script lang="ts">
    import { goto } from '$app/navigation';

    let searchQuery = $state('');

    async function handleSearch(event: Event) {
        event.preventDefault();
        if (searchQuery.trim()) {
            await goto(`/search?search=${encodeURIComponent(searchQuery)}`);
        }
    }
</script>

<section>
    <h1>Home Page</h1>

    <form on:submit={handleSearch}>
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search..."
            required
        />
        <button type="submit">Search</button>
    </form>
</section>
  