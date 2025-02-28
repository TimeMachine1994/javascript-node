<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import SearchForm from '$lib/components/forms/SearchForm.svelte';
  import CreateTributeForm from '$lib/components/forms/CreateTributeForm.svelte';
  
  // Form state
  let formState = $state('initial'); // initial, editing, submitting, success
  let lovedOneName = $state('');
  let customLink = $state('');
  let isBlurred = $state(false);
  let searchQuery = $state('');
  
  // Set blur state based on form state
  $effect(() => {
    isBlurred = formState !== 'initial';
  });
  
  // Handle transition to create tribute form
  function handleCreateTribute() {
    formState = 'editing';
  }
  
  // Handle going back to initial state
  function handleGoBack() {
    formState = 'initial';
  }
  
  // Handle successful form submission
  function handleSubmitSuccess() {
    formState = 'success';
  }
  
  // Reset the form and go back to initial state
  function resetForm() {
    lovedOneName = '';
    customLink = '';
    formState = 'initial';
  }
</script>

<!-- HomePage component with video background -->
<section class="relative bg-gray-900 text-white min-h-screen">
  <!-- Video background with conditional blur effect -->
  <video 
    autoplay 
    muted 
    loop 
    playsinline 
    class="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-300" 
    class:blur-sm={isBlurred}
  >
    <source src="https://209.74.64.181:12091/down/FCymVumu4aQG.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  
  <!-- Overlay for better text readability -->
  <div class="absolute inset-0 bg-black opacity-50 z-10"></div>
  
  <!-- Main content container -->
  <div class="relative z-20 flex flex-col items-center justify-start min-h-screen pt-8 px-4 font-['Fanwood_Text']">
    <!-- Header section -->
    <h1 class="text-4xl md:text-6xl text-center mb-4">
      We Make Hearts Full Again
    </h1>
    
    <!-- Form section with conditional rendering based on form state -->
    <div class="w-full max-w-md">
      {#if formState === 'initial'}
        <!-- Initial state - Search Form -->
        <SearchForm 
          onCreateClick={() => {
            lovedOneName = searchQuery;
            handleCreateTribute();
          }}
        />
        
      {:else if formState === 'editing'}
        <!-- Editing state - Create Tribute Form -->
        <CreateTributeForm
          {lovedOneName}
          onCancel={handleGoBack}
          onSubmitSuccess={(link: string) => {
            customLink = link;
            handleSubmitSuccess();
          }}
        />
        
      {:else if formState === 'success'}
        <!-- Success state - Confirmation message -->
        <div class="text-center py-12 space-y-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h2 class="text-2xl font-bold">Tribute Created Successfully!</h2>
          <p class="text-lg">Your tribute page for {lovedOneName} has been created.</p>
          <p class="text-md break-all">{customLink}</p>
          
          <div class="flex justify-center space-x-4 mt-8">
            <Button 
              variant="default"
              class="bg-blue-600 hover:bg-blue-700"
              on:click={() => goto(customLink)}
            >
              View Tribute
            </Button>
            <Button 
              variant="secondary"
              class="bg-gray-600 hover:bg-gray-700"
              on:click={resetForm}
            >
              Create Another
            </Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>