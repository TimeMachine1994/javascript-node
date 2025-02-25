<script lang="ts">
    import { goto } from '$app/navigation';
    import SearchForm from './home/SearchForm.svelte';
    import CreateForm from './home/CreateForm.svelte';
    import { HomePageState } from './home/HomePageState';

    const state = new HomePageState();

    async function handleSearch(event: SubmitEvent) {
        event.preventDefault();
        if (!state.formData.searchQuery.trim()) return;

        try {
            state.startSearching();
            await goto(`/search?search=${encodeURIComponent(state.formData.searchQuery)}`);
        } catch (error) {
            console.error('Search navigation failed:', error);
            // You might want to show an error message to the user here
        } finally {
            state.stopSearching();
        }
    }

    function showCreate() {
        state.setPageState('create');
    }

    function backToHome() {
        state.setPageState('home');
    }
</script>

{#if state.pageState === 'home'}
<section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-6">Home Page</h1>

    <SearchForm
        searchQuery={state.formData.searchQuery}
        isSearching={state.formData.isSearching}
        onSearch={handleSearch}
        onCreateClick={showCreate}
    />
</section>

{:else if state.pageState === 'create'}
<section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-6">Create Page</h1>

    <CreateForm
        formData={state.formData}
        onSubmit={() => {}}
        onBack={backToHome}
        customLink={state.customLink}
        slugifiedText={state.slugifiedText}
        isValid={state.isFormValid()}
    />
</section>
{/if}
