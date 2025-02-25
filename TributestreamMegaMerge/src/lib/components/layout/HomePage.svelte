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

        <input type="hidden" name="slug" value={slugifiedText} />
        <input type="hidden" name="lovedOneName" value={searchQuery} />

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


<section class="relative bg-gray-900 text-white">
    <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover z-0" class:blurred={isBlurred}>
          <source src="https://209.74.64.181:12091/down/FCymVumu4aQG.mp4" type="video/mp4" />
          Your browser does not support the video tag.
      </video>
      <div class="absolute inset-0 bg-black opacity-50 z-10"></div>  
    
      <div class="relative z-20 flex flex-col items-center justify-start h-screen min-w-screen pt-8 font-['Fanwood_Text']">
          <h1 class="text-4xl md:text-6xl text-center mb-4 ">
         We Make Hearts Full Again
          </h1> 
     
           <p class="text-center mb-8 text-lg md:text-xl">
              
              {#if !showSecondPage}
              
              Tributestream broadcasts high quality audio and video of your loved one's celebartion of life. <br> 
              Enter your loved ones name below to begin your journey with Tributestream. 
              <!--Tributestream brings together your families tesitmony of love into one neat package. <br> <i>
              Tributestream brings closure now.<br> A window to the past, to which we all avow. <br>
              Relearn powerful lessons time can't dim,<br>
              and embrace the love that flows from within.
            </i>-->
    
               
              {:else}
                  Your Loved One's Custom Link:
              {/if}
          </p>
    
          <form class="w-full max-w-md">
              {#if !showSecondPage}
                  <input
                      type="text"
                      placeholder="Loved One's Name Here"
                      class="w-full px-4 py-2 text-gray-900 rounded-md mb-4 text-center"
                      bind:value={lovedOneName}
                  />
                  <div class="flex space-x-4 justify-center">
                      <button    on:click={handleNextPage}
                      class="bg-[#D5BA7F] text-black font-bold py-2 px-4 border border-transparent rounded-lg hover:text-black  hover:shadow-[0_0_10px_4px_#D5BA7F] transition-all duration-300 ease-in-out">
                          Create Tribute
                        </button>
                    
    
                        <button
                                            on:click={() => {
                                              handleSearch();
                                              showSecondPage = true;
                                            }}
                                            class="bg-[#D5BA7F] text-black py-2 px-4 border border-transparent rounded-lg hover:text-black hover:shadow-[0_0_10px_4px_#D5BA7F] transition-all duration-300 ease-in-out">
                        Search Streams
                    </button> 
                  </div>
              {:else}
                  <div class="flex items-center justify-center mb-4">
                      <span class="text-white">http://www.tributestream.com/celebration-of-life-for-{#if isEditing}
                          <input
                              type="text"
                              class="px-2 py-1 text-gray-900 rounded-md"
                              bind:value={tempSlugifiedName}
                          />
                      {:else}
                          <span class="text-white">{slugifiedName}</span>
                      {/if}</span>
                      {#if isEditing}
                          <button class="ml-2 text-green-500" on:click={handleSaveNameChange}>
                              <i class="fas fa-check"></i>
                          </button>
                          <button class="ml-2 text-red-500" on:click={handleDiscardNameChange}>
                              <i class="fas fa-times"></i>
                          </button>
                      {:else}
                          <button class="ml-2 text-white" on:click={handleEditName}>
                              <i class="fas fa-pencil-alt"></i>
                          </button>
                      {/if}
                  </div>
                  <input
                      type="text"
                      placeholder="Your Name"
                      class="w-full px-4 py-2 text-gray-900 rounded-md mb-4"
                      bind:value={fullName}
                  />
                  <input
                      type="email"
                      placeholder="Email Address"
                      class="w-full px-4 py-2 text-gray-900 rounded-md mb-4"
                      bind:value={email}
                  />
                  <input
                      type="tel"
                      placeholder="Phone Number"
                      class="w-full px-4 py-2 text-gray-900 rounded-md mb-4"
                      bind:value={phone}
                  />
                  <div class="flex justify-between items-center">
                      <button type="button" on:click={handleGoBack} class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md">
                          <i class="fas fa-arrow-left"></i>
                      </button>
                      <button type="button" on:click={handleSubmit} class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md">
                          Create Tribute
                      </button>
                  </div>
              {/if}
          </form>
          </div>
          </section>