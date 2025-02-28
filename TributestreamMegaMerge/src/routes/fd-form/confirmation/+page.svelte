<script lang="ts">
  import { page } from '$app/stores';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  // Get slug from URL params
  let slug = $page.url.searchParams.get('slug') || '';
  let tributeLink = `http://www.tributestream.com/celebration-of-life-for-${slug}`;
  
  // Create email content for copying
  let emailSubject = "Your Tributestream Memorial Page";
  let emailBody = `Dear Family,

We have created a Tributestream memorial page for your loved one, which will allow friends and family who cannot attend in person to participate in the service via live stream.

You can view and share the memorial page using this link:
${tributeLink}

The family will need to complete payment for this service. You can do this by clicking the "Family Dashboard" link on the memorial page and following the payment instructions.

If you have any questions, please don't hesitate to contact us.

Sincerely,
[Funeral Director Name]
[Funeral Home]`;

  // Generate mailto link
  let mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  
  // Copy link to clipboard
  function copyLinkToClipboard() {
    navigator.clipboard.writeText(tributeLink);
    alert('Link copied to clipboard!');
  }
  
  // Copy email to clipboard
  function copyEmailToClipboard() {
    navigator.clipboard.writeText(emailBody);
    alert('Email template copied to clipboard!');
  }
</script>

<svelte:head>
  <title>Tribute Created - Confirmation | Tributestream</title>
  <meta name="description" content="Confirmation page for funeral directors after creating a tribute." />
</svelte:head>

<div class="container mx-auto px-4 py-12 max-w-4xl">
  <div class="bg-white rounded-lg shadow-lg p-8">
    <div class="text-center mb-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h1 class="text-3xl font-bold text-gray-800">Tribute Created Successfully!</h1>
      <p class="text-gray-600 mt-2">
        The tribute has been created. The family will need to complete the payment process.
      </p>
    </div>
    
    <!-- Tribute Link Section -->
    <div class="mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 class="text-xl font-semibold mb-2">Tribute Link</h2>
      <div class="flex items-center">
        <input 
          type="text" 
          readonly 
          value={tributeLink} 
          class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white" 
        />
        <Button
          variant="outline"
          on:click={copyLinkToClipboard}
          class="ml-2 whitespace-nowrap"
        >
          Copy Link
        </Button>
      </div>
    </div>
    
    <!-- Email Template Section -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-semibold">Email Template for Family</h2>
        <div class="space-x-2">
          <Button 
            variant="outline"
            on:click={copyEmailToClipboard}
          >
            Copy Email
          </Button>
          
          <a href={mailtoLink} class="inline-block">
            <Button variant="secondary">
              Open in Email App
            </Button>
          </a>
        </div>
      </div>
      
      <div class="p-4 bg-gray-50 rounded-lg">
        <div class="border border-gray-300 rounded p-4 bg-white">
          <p class="font-semibold">Subject: {emailSubject}</p>
          <hr class="my-2" />
          <div class="whitespace-pre-wrap">{emailBody}</div>
        </div>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
      <Button 
        variant="gold"
        on:click={() => goto('/')}
      >
        Return to Home
      </Button>
      
      <Button 
        variant="outline"
        on:click={() => goto('/fd-form')}
      >
        Create Another Tribute
      </Button>
    </div>
  </div>
</div>
