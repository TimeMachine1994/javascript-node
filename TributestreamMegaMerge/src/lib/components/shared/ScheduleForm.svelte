<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Card, CardContent } from "$lib/components/ui/card";
  
  interface ServicePackage {
    id: string;
    name: string;
    description: string;
    price: number;
  }
  
  let {
    title = "Schedule Your TributeStream",
    subtitle = "Select a date, time, and package for your TributeStream service.",
    packages = [],
    submitButtonText = "Continue to Payment",
    successMessage = "Your appointment has been scheduled. We'll be in touch shortly.",
    errorMessage = "There was an error scheduling your appointment. Please try again."
  } = $props<{
    title?: string;
    subtitle?: string;
    packages?: ServicePackage[];
    submitButtonText?: string;
    successMessage?: string;
    errorMessage?: string;
  }>();
  
  // Form state
  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let phone = $state("");
  let selectedDate = $state("");
  let selectedTime = $state("");
  let selectedPackageId = $state("");
  let specialRequests = $state("");
  let lovedOneName = $state("");
  
  // UI state
  let currentStep = $state(1);
  let isSubmitting = $state(false);
  let isSuccess = $state(false);
  let isError = $state(false);
  let errorDetails = $state("");
  
  // Computed values
  let selectedPackage = $derived(packages.find((pkg: ServicePackage) => pkg.id === selectedPackageId));
  let isDateSelected = $derived(!!selectedDate);
  let isTimeSelected = $derived(!!selectedTime);
  let isPackageSelected = $derived(!!selectedPackageId);
  
  let isStep1Valid = $derived(isDateSelected && isTimeSelected && isPackageSelected);
  let isStep2Valid = $derived(firstName && lastName && email && phone && lovedOneName);
  
  function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function nextStep() {
    if (currentStep === 1 && isStep1Valid) {
      currentStep = 2;
    }
  }
  
  function prevStep() {
    if (currentStep === 2) {
      currentStep = 1;
    }
  }
  
  async function handleSubmit() {
    if (!isStep2Valid) return;
    
    isSubmitting = true;
    isSuccess = false;
    isError = false;
    errorDetails = "";
    
    try {
      // Send form data to server
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          date: selectedDate,
          time: selectedTime,
          packageId: selectedPackageId,
          specialRequests,
          lovedOneName
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      isSuccess = true;
    } catch (error) {
      isError = true;
      errorDetails = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Schedule form submission error:", error);
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="schedule-form-container bg-white rounded-lg shadow-sm p-6 md:p-8">
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
  {:else}
    <div class="mb-8">
      <div class="flex items-center">
        <div class="flex items-center justify-center w-10 h-10 rounded-full {currentStep >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}">
          1
        </div>
        <div class="flex-1 h-1 mx-2 {currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}"></div>
        <div class="flex items-center justify-center w-10 h-10 rounded-full {currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}">
          2
        </div>
      </div>
      <div class="flex justify-between mt-2">
        <span class="text-sm font-medium">Select Date & Package</span>
        <span class="text-sm font-medium">Your Information</span>
      </div>
    </div>
    
    {#if isError}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
        <p>{errorMessage}</p>
        {#if errorDetails}
          <p class="text-sm mt-1">{errorDetails}</p>
        {/if}
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      {#if currentStep === 1}
        <!-- Step 1: Select Date, Time, and Package -->
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-4">Select a Date</h3>
            <div class="space-y-2">
              <Label for="appointment-date">Date</Label>
              <Input
                id="appointment-date"
                type="date"
                bind:value={selectedDate}
                required
              />
              
              {#if selectedDate}
                <p class="mt-2 text-sm text-green-600">Selected: {formatDate(selectedDate)}</p>
              {/if}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-4">Select a Time</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {#each ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] as time}
                <button
                  type="button"
                  class="py-2 px-4 border rounded-md {selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-white hover:bg-gray-50 border-gray-300'}"
                  on:click={() => selectedTime = time}
                >
                  {time}
                </button>
              {/each}
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium mb-4">Select a Package</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each packages as pkg}
                <Card class="cursor-pointer {selectedPackageId === pkg.id ? 'ring-2 ring-primary' : ''}" on:click={() => selectedPackageId = pkg.id}>
                  <CardContent class="p-4">
                    <div class="flex justify-between items-start">
                      <div>
                        <h4 class="font-medium">{pkg.name}</h4>
                        <p class="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div class="text-lg font-semibold">${pkg.price}</div>
                    </div>
                  </CardContent>
                </Card>
              {/each}
            </div>
          </div>
          
          <div class="flex justify-end">
            <Button 
              type="button" 
              disabled={!isStep1Valid}
              on:click={nextStep}
            >
              Next Step
            </Button>
          </div>
        </div>
      {:else if currentStep === 2}
        <!-- Step 2: Contact Information -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name <span class="text-red-500">*</span></Label>
              <Input 
                id="firstName" 
                type="text" 
                bind:value={firstName} 
                placeholder="Your first name" 
                required 
                disabled={isSubmitting}
              />
            </div>
            
            <div class="space-y-2">
              <Label for="lastName">Last Name <span class="text-red-500">*</span></Label>
              <Input 
                id="lastName" 
                type="text" 
                bind:value={lastName} 
                placeholder="Your last name" 
                required 
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div class="space-y-2">
              <Label for="phone">Phone Number <span class="text-red-500">*</span></Label>
              <Input 
                id="phone" 
                type="tel" 
                bind:value={phone} 
                placeholder="(123) 456-7890" 
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div class="space-y-2">
            <Label for="lovedOneName">Loved One's Name <span class="text-red-500">*</span></Label>
            <Input 
              id="lovedOneName" 
              type="text" 
              bind:value={lovedOneName} 
              placeholder="Name of your loved one" 
              required 
              disabled={isSubmitting}
            />
          </div>
          
          <div class="space-y-2">
            <Label for="specialRequests">Special Requests or Notes</Label>
            <textarea
              id="specialRequests"
              bind:value={specialRequests}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Any special requests or additional information"
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div class="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              on:click={prevStep}
              disabled={isSubmitting}
            >
              Back
            </Button>
            
            <Button 
              type="submit" 
              disabled={!isStep2Valid || isSubmitting}
            >
              {#if isSubmitting}
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              {:else}
                {submitButtonText}
              {/if}
            </Button>
          </div>
        </div>
      {/if}
    </form>
  {/if}
</div>