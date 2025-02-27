<script lang="ts">
  import { ScheduleForm, TestimonialCard, FAQ } from "$lib/components/shared";
  
  // Sample package data
  const packages = [
    {
      id: "basic",
      name: "Basic Stream",
      description: "Single camera, professional audio, up to 2 hours of streaming",
      price: 499
    },
    {
      id: "standard",
      name: "Standard Stream",
      description: "Two cameras, professional audio, up to 3 hours of streaming",
      price: 799
    },
    {
      id: "premium",
      name: "Premium Stream",
      description: "Three cameras, professional audio, up to 4 hours of streaming, edited recording",
      price: 1299
    }
  ];
  
  // Sample testimonials data
  const testimonials = [
    {
      name: "Jennifer Adams",
      role: "Family Member",
      testimonial: "The scheduling process was so simple. TributeStream made it easy to book our service and the team was incredibly responsive to our questions.",
      rating: 5
    },
    {
      name: "Thomas Wilson",
      role: "Funeral Director",
      testimonial: "As a funeral director, I appreciate how easy TributeStream makes it for families to schedule their streaming services. The process is straightforward and professional.",
      rating: 5
    }
  ];
  
  // Sample FAQ data
  const faqItems = [
    {
      question: "How far in advance should I schedule?",
      answer: "We recommend scheduling as soon as you have a date for the service. However, we understand that memorial planning often happens with limited notice. We can accommodate last-minute requests when possible, but 3-7 days advance notice is ideal."
    },
    {
      question: "What information do I need to provide when scheduling?",
      answer: "You'll need to provide the date and time of the service, location details, your contact information, and select a streaming package. You can also include any special requests or notes about the service."
    },
    {
      question: "Can I change my scheduled date or time?",
      answer: "Yes, you can modify your scheduled date or time up to 48 hours before the service, subject to availability. Please contact our support team as soon as possible if you need to make changes."
    },
    {
      question: "What happens after I schedule?",
      answer: "After scheduling, you'll receive a confirmation email with all the details. A TributeStream representative will contact you within 24 hours to confirm the details and answer any questions you may have."
    }
  ];
</script>

<svelte:head>
  <title>Schedule Your TributeStream | Memorial Streaming Services</title>
  <meta name="description" content="Schedule your TributeStream memorial streaming service. Connect family and friends from around the world to honor your loved one." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <!-- Hero Section -->
  <section class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Schedule Your TributeStream</h1>
    <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
      Connect family and friends from around the world to honor your loved one.
    </p>
  </section>
  
  <!-- Scheduling Form Section -->
  <section class="mb-16">
    <div class="max-w-4xl mx-auto">
      <ScheduleForm 
        packages={packages}
        title="Schedule Your Memorial Stream"
        subtitle="Select a date, time, and package that works for you. Our team will confirm all details within 24 hours."
      />
    </div>
  </section>
  
  <!-- Package Comparison Section -->
  <section class="py-16 bg-gray-50 rounded-lg mb-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Our Streaming Packages</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each packages as pkg}
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="p-6 border-b">
              <h3 class="text-xl font-bold mb-2">{pkg.name}</h3>
              <p class="text-3xl font-bold mb-4">${pkg.price}</p>
              <p class="text-muted-foreground">{pkg.description}</p>
            </div>
            <div class="p-6">
              <ul class="space-y-2">
                {#if pkg.id === 'basic'}
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Single camera setup
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Professional audio
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Up to 2 hours streaming
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Basic recording
                  </li>
                {/if}
                {#if pkg.id === 'standard'}
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Two camera setup
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Enhanced audio
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Up to 3 hours streaming
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Basic edited recording
                  </li>
                {/if}
                {#if pkg.id === 'premium'}
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Three camera setup
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Premium audio
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Up to 4 hours streaming
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Professionally edited recording
                  </li>
                  <li class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Custom memorial page
                  </li>
                {/if}
              </ul>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Testimonials Section -->
  <section class="mb-16">
    <h2 class="text-3xl font-bold text-center mb-12">What Families Say</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {#each testimonials as testimonial}
        <TestimonialCard {...testimonial} />
      {/each}
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="py-16">
    <FAQ items={faqItems} title="Scheduling FAQs" />
  </section>
  
  <!-- Need Help Section -->
  <section class="py-16 text-center bg-gray-50 rounded-lg">
    <h2 class="text-3xl font-bold mb-4">Need Help Scheduling?</h2>
    <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
      If you have questions or need assistance with scheduling, our team is here to help.
    </p>
    <a href="/contact-us" class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
      Contact Our Team
    </a>
  </section>
</div>