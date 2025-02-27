<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  
  let {
    title = "Contact Us",
    subtitle = "We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.",
    submitButtonText = "Send Message",
    successMessage = "Thank you for your message. We'll get back to you shortly.",
    errorMessage = "There was an error submitting your message. Please try again."
  } = $props();
  
  let name = $state("");
  let email = $state("");
  let phone = $state("");
  let subject = $state("");
  let message = $state("");
  
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let isError = $state(false);
  let errorDetails = $state("");
  
  async function handleSubmit() {
    isSubmitting = true;
    isSuccess = false;
    isError = false;
    errorDetails = "";
    
    // Validate form
    if (!name || !email || !message) {
      isError = true;
      errorDetails = "Please fill out all required fields.";
      isSubmitting = false;
      return;
    }
    
    try {
      // Send form data to server
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          subject,
          message
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      // Reset form on success
      name = "";
      email = "";
      phone = "";
      subject = "";
      message = "";
      
      isSuccess = true;
    } catch (error) {
      isError = true;
      errorDetails = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Contact form submission error:", error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="contact-form-container bg-white rounded-lg shadow-sm p-6 md:p-8">
  {#if title}
    <h2 class="text-2xl font-bold mb-2">{title}</h2>
  {/if}
  
  {#if subtitle}
    <p class="text-muted-foreground mb-6">{subtitle}</p>
  {/if}
  
  {#if isSuccess}
    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6" role="alert">
      <p>{successMessage}</p>
    </div>
  {/if}
  
  {#if isError}
    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
      <p>{errorMessage}</p>
      {#if errorDetails}
        <p class="text-sm mt-1">{errorDetails}</p>
      {/if}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="name">Name <span class="text-red-500">*</span></Label>
        <Input 
          id="name" 
          type="text" 
          bind:value={name} 
          placeholder="Your name" 
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div class="space-y-2">
        <Label for="email">Email <span class="text-red-500">*</span></Label>
        <Input 
          id="email" 
          type="email" 
          bind:value={email} 
          placeholder="your.email@example.com" 
          required 
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="space-y-2">
        <Label for="phone">Phone Number</Label>
        <Input 
          id="phone" 
          type="tel" 
          bind:value={phone} 
          placeholder="(123) 456-7890" 
          disabled={isSubmitting}
        />
      </div>
      
      <div class="space-y-2">
        <Label for="subject">Subject</Label>
        <Input 
          id="subject" 
          type="text" 
          bind:value={subject} 
          placeholder="What is this regarding?" 
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <div class="space-y-2">
      <Label for="message">Message <span class="text-red-500">*</span></Label>
      <textarea
        id="message"
        bind:value={message}
        rows="5"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="How can we help you?"
        required
        disabled={isSubmitting}
      ></textarea>
    </div>
    
    <Button 
      type="submit" 
      class="w-full md:w-auto" 
      disabled={isSubmitting}
    >
      {#if isSubmitting}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sending...
      {:else}
        {submitButtonText}
      {/if}
    </Button>
  </form>
</div>