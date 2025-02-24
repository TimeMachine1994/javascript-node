<script lang="ts">
    import { goto } from '$app/navigation';
    import { enhance } from '$app/forms';

    // SvelteKit 5 "signal" or "$state" references (kept as requested)
    let searchQuery = $state('');
    let pageState = $state('home');
    let fullName = $state('');
    let phoneNumber = $state('');
    let emailAddress = $state('');
    let isSubmitting = $state(false);
    let isSearching = $state(false);

    let slugifiedText = $derived(
        searchQuery
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    );

    let customLink = $derived(
        `http://www.Tributestream.com/celebration-of-life-for-${slugifiedText}`
    );

    // Added type safety and error handling
    async function handleSearch(event: SubmitEvent) {
        event.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            isSearching = true;
            await goto(`/search?search=${encodeURIComponent(searchQuery)}`);
        } catch (error) {
            console.error('Search navigation failed:', error);
            // You might want to show an error message to the user here
        } finally {
            isSearching = false;
        }
    }

    // Added type safety to click handlers
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

    // Added form validation
    function isFormValid(): boolean {
        return !!(
            fullName.trim() &&
            phoneNumber.trim() &&
            emailAddress.trim() &&
            emailAddress.includes('@')
        );
    }
</script>

{#if pageState === 'home'}
<section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-6">Home Page</h1>

    <!-- Floating label input + search/create buttons -->
    <form on:submit={handleSearch} class="w-full max-w-sm space-y-4">
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
                on:click={showCreate}
                class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                       transition-all duration-200"
            >
                Create
            </button>
        </div>
    </form>
</section>

{:else if pageState === 'create'}
<section class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 class="text-2xl font-bold mb-6">Create Page</h1>

    <div class="mb-6">
        <h2 class="text-xl font-semibold mb-2">Your Loved One's Custom Link</h2>
        <p class="text-gray-700 break-all">{customLink}</p>
    </div>
    
    <form
        method="POST"
        action="?/create"
        use:enhance={() => {
            isSubmitting = true;
            return async ({ result }) => {
                isSubmitting = false;
                if (result.type === 'success') {
                    backToHome();
                }
            };
        }}
        class="w-full max-w-sm space-y-4"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        <input type="hidden" name="customLink" value={customLink} />
        <input type="hidden" name="searchQuery" value={searchQuery} />

        <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            disabled={isSubmitting || !isFormValid()}
        >
            {isSubmitting ? 'Submitting...' : 'Create Memorial Page'}
        </button>
    </form>

    <button
        on:click={backToHome}
        class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
               transition-all duration-200"
    >
        Back to Home
    </button>
</section>
{/if}
