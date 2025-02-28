<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import FormField from './FormField.svelte';
  import { slugify } from '$lib/utils/slugify';
  import { validateObject, validateRequired, validateEmail, validatePhone } from '$lib/utils/validators';
  
  // Props
  let {
    lovedOneName,
    onCancel = () => {},
    onSubmitSuccess = (link: string) => {}
  } = $props<{
    lovedOneName: string;
    onCancel?: () => void;
    onSubmitSuccess?: (link: string) => void;
  }>();
  
  // Form state
  let fullName = $state('');
  let phoneNumber = $state('');
  let emailAddress = $state('');
  let isSubmitting = $state(false);
  let isEditing = $state(false);
  let tempSlugifiedName = $state('');
  let formError = $state<string | null>(null);
  
  // Derived values
  let slugifiedName = $derived(slugify(lovedOneName));
  let customLink = $derived(`http://www.tributestream.com/celebration-of-life-for-${slugifiedName}`);
  
  // Initialize temp slugified name when editing starts
  $effect(() => {
    if (isEditing) {
      tempSlugifiedName = slugifiedName;
    }
  });
  
  // Form validation
  let isFormValid = $derived(
    !!fullName.trim() && 
    !!phoneNumber.trim() && 
    !!emailAddress.trim() && 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)
  );
  
  // Handle form submission
  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    // Validate form
    const validators = {
      lovedOneName: (value: string) => validateRequired(value, "Loved one's name"),
      fullName: (value: string) => validateRequired(value, "Your name"),
      phoneNumber: validatePhone,
      emailAddress: validateEmail
    };
    
    const validation = validateObject(
      { lovedOneName, fullName, phoneNumber, emailAddress },
      validators
    );
    
    if (!validation.valid) {
      formError = Object.values(validation.errors)[0] || 'Please fill out all required fields correctly';
      return;
    }
    
    isSubmitting = true;
    formError = null;
    
    // Prepare form data
    const formData = {
      lovedOneName,
      fullName,
      phoneNumber,
      emailAddress,
      slug: slugifiedName
    };
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate a successful submission
      console.log('Form submitted:', formData);
      
      // Wait a moment to simulate server processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the new tribute page or trigger success callback
      onSubmitSuccess();
      // Define the custom link from the slugified name
      const customLink = `http://www.tributestream.com/celebration-of-life-for-${slugifiedName}`;
      
      // Call success callback with the custom link
      onSubmitSuccess(customLink);
      
      // Optionally navigate to the new tribute page
      // await goto(`/celebration-of-life-for-${slugifiedName}`);
      // await goto(`/celebration-of-life-for-${slugifiedName}`);
    } catch (error) {
      console.error('Form submission error:', error);
      formError = 'An error occurred while creating the tribute. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
  
  // Handle editing the slugified name
  function handleEditName() {
    isEditing = true;
  }
  
  // Handle saving the edited slugified name
  function handleSaveNameChange() {
    // Validate the edited name
    if (!tempSlugifiedName.trim()) {
      formError = 'Custom link cannot be empty';
      return;
    }
    
    // Update the loved one's name based on the edited slug
    // This is a simplified approach that assumes the slug is directly related to the name
    lovedOneName = tempSlugifiedName
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
      
    isEditing = false;
  }
  
  // Handle discarding the edited slugified name
  function handleDiscardNameChange() {
    tempSlugifiedName = slugifiedName;
    isEditing = false;
  }
</script>

<div class="create-tribute-form">
  {#if formError}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span class="block sm:inline">{formError}</span>
    </div>
  {/if}
  
  <p class="text-center mb-8 text-lg md:text-xl">
    Your Loved One's Custom Link:
  </p>
  
  <form on:submit={handleSubmit} class="w-full">
    <!-- Custom link editor -->
    <div class="flex items-center justify-center mb-6 flex-wrap">
      <span class="text-white">http://www.tributestream.com/celebration-of-life-for-</span>
      {#if isEditing}
        <div class="flex items-center">
          <input
            type="text"
            class="px-2 py-1 text-gray-900 rounded-md"
            bind:value={tempSlugifiedName}
          />
          <button 
            type="button"
            class="ml-2 text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500" 
            on:click={handleSaveNameChange}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <button 
            type="button"
            class="ml-2 text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500" 
            on:click={handleDiscardNameChange}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      {:else}
        <div class="flex items-center">
          <span class="text-white">{slugifiedName}</span>
          <button 
            type="button"
            class="ml-2 text-white focus:outline-none focus:ring-2 focus:ring-white" 
            on:click={handleEditName}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
      {/if}
    </div>
    
    <!-- Contact information fields -->
    <div class="space-y-4">
      <FormField
        name="fullName"
        label="Your Name"
        type="text"
        value={fullName}
        required={true}
        on:input={(e) => fullName = (e.currentTarget as HTMLInputElement)?.value || ''}
      />
      
      <FormField
        name="emailAddress"
        label="Email Address"
        type="email"
        value={emailAddress}
        required={true}
        on:input={(e) => emailAddress = (e.currentTarget as HTMLInputElement)?.value || ''}
      />
      
      <FormField
        name="phoneNumber"
        label="Phone Number"
        type="tel"
        value={phoneNumber}
        required={true}
        on:input={(e) => phoneNumber = (e.currentTarget as HTMLInputElement)?.value || ''}
      />
    </div>
    
    <!-- Hidden fields for form submission -->
    <input type="hidden" name="slug" value={slugifiedName} />
    <input type="hidden" name="lovedOneName" value={lovedOneName} />
    
    <!-- Form action buttons -->
    <div class="flex justify-between items-center mt-6">
      <Button 
        type="button"
        variant="outline"
        on:click={onCancel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </Button>
      
      <Button 
        type="submit"
        variant="gold"
        disabled={isSubmitting || !isFormValid}
      >
        {isSubmitting ? 'Creating...' : 'Create Tribute'}
      </Button>
    </div>
  </form>
</div>