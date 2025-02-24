<script lang="ts">
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    let searchQuery = $state('');
    let pageState = $state('home');
    let fullName = $state('');
    let phoneNumber = $state('');
    let emailAddress = $state('');
    let isSubmitting = $state(false);
    
    let slugifiedText = $derived(
        fullName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    );

    let customLink = $derived(
        `http://www.Tributestream.com/celebration-of-life-for-${slugifiedText}`
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
        fullName = '';
        phoneNumber = '';
        emailAddress = '';
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
        <div class="mb-6">
            <h2 class="text-xl font-semibold mb-2">Your Loved One's Custom Link</h2>
            <p class="text-gray-700 break-all">{customLink}</p>
        </div>
        
        <form
            method="POST"
            action="/create-memorial?/default"
            use:enhance={() => {
                isSubmitting = true;
                return async ({ result }) => {
                    isSubmitting = false;
                    if (result.type === 'success') {
                        backToHome();
                    }
                };
            }}
            class="space-y-4"
        >
            <div>
                <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    bind:value={fullName}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    bind:value={phoneNumber}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label for="emailAddress" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                </label>
                <input
                    id="emailAddress"
                    name="emailAddress"
                    type="email"
                    bind:value={emailAddress}
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <input type="hidden" name="customLink" value={customLink} />

            <button
                type="submit"
                class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Create Memorial Page'}
            </button>
        </form>

        <button
            on:click={backToHome}
            class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            Back to Home
        </button>
    </section>
{/if}