<script lang="ts">
  import { ArticleSection, TestimonialCard, VideoPlayer, PhotoGallery, FAQ } from "$lib/components/shared";
  
  // Sample testimonials data
  const testimonials = [
    {
      name: "Robert Williams",
      role: "Family Member",
      testimonial: "The step-by-step process was so clear and easy to follow. TributeStream guided us through everything, making a difficult time much easier to navigate.",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Funeral Director",
      testimonial: "As a funeral director, I appreciate how seamlessly TributeStream integrates with our services. The process is professional and respectful from start to finish.",
      rating: 5
    },
    {
      name: "David Patel",
      role: "Family Member",
      testimonial: "I was worried about the technical aspects, but TributeStream handled everything. The process was simple, and the result was a beautiful tribute to my mother.",
      rating: 5
    }
  ];
  
  // Sample FAQ data
  const faqItems = [
    {
      question: "How far in advance should we book TributeStream services?",
      answer: "We recommend booking as soon as you have a date for the service. However, we understand that memorial planning often happens with limited notice. We can accommodate last-minute requests when possible, but 3-7 days advance notice is ideal to ensure availability and allow for proper planning."
    },
    {
      question: "What information do you need from us to get started?",
      answer: "To begin, we'll need basic information about the service (date, time, location), contact information for the primary family contact, and details about the deceased. Our scheduling form will guide you through all the necessary information we need to provide the best service."
    },
    {
      question: "How do we share the stream with family and friends?",
      answer: "After booking, you'll receive a private link to your TributeStream page. This link can be shared via email, social media, or included in the obituary. Only those with the link can access the stream, ensuring privacy while making it easy for loved ones to participate."
    },
    {
      question: "What happens if there are technical issues during the stream?",
      answer: "Our team includes technical specialists who monitor the stream throughout the service. We have backup systems in place and can quickly address any issues that arise. In the rare event of a significant disruption, we provide a recording of the service to all viewers."
    },
    {
      question: "How long does it take to receive the edited recording after the service?",
      answer: "The edited recording is typically available within 3-5 business days after the service. You'll receive an email notification when it's ready, along with instructions for viewing and sharing the recording with family and friends."
    }
  ];
  
  // Process steps
  const processSteps = [
    {
      title: "Initial Consultation",
      description: "Contact us to discuss your needs and schedule a consultation. We'll explain our services and answer any questions you may have.",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      title: "Booking & Planning",
      description: "Complete our simple booking form with service details. Our team will create a customized streaming plan for your specific needs.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    },
    {
      title: "Technical Setup",
      description: "Our professional team arrives early to set up equipment and test all systems, ensuring everything works perfectly.",
      icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
    },
    {
      title: "Live Streaming",
      description: "We discreetly capture and stream the service with professional equipment, allowing remote attendees to participate in real-time.",
      icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    },
    {
      title: "Post-Production",
      description: "After the service, we professionally edit the recording, enhancing audio and video quality for a lasting keepsake.",
      icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    },
    {
      title: "Delivery & Support",
      description: "We provide the edited recording and continue to offer support for accessing and sharing the memorial content.",
      icon: "M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
    }
  ];
  
  // Sample photos for gallery
  const photos = [
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Consultation",
      alt: "Initial consultation with TributeStream team",
      caption: "Our compassionate team discusses your needs"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Planning",
      alt: "Planning session for memorial streaming",
      caption: "Detailed planning ensures a smooth experience"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Setup",
      alt: "Technical setup at memorial venue",
      caption: "Professional equipment setup before the service"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Streaming",
      alt: "Live streaming of memorial service",
      caption: "Discreet streaming during the service"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Editing",
      alt: "Post-production editing",
      caption: "Professional editing enhances the final recording"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Delivery",
      alt: "Memorial recording delivery",
      caption: "The final recording becomes a lasting keepsake"
    }
  ];
  
  // Active tab state
  let activeTab = $state(0);
</script>

<svelte:head>
  <title>How TributeStream Works | Memorial Streaming Process</title>
  <meta name="description" content="Learn how TributeStream's memorial streaming service works, from initial consultation to final delivery, with our simple six-step process." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <!-- Hero Section -->
  <section class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">How TributeStream Works</h1>
    <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
      A simple, compassionate process designed to support you every step of the way.
    </p>
  </section>
  
  <!-- Overview Section -->
  <ArticleSection
    title="Our Simple Six-Step Process"
    subtitle="From planning to delivery, we're with you every step of the way"
    content="<p class='mb-4'>At TributeStream, we've designed a straightforward process that makes memorial streaming simple and stress-free. Our compassionate team handles all technical aspects, allowing you to focus on what matters most during this difficult time.</p>
    <p>Each step is guided by our experienced professionals who understand the sensitive nature of memorial services. We work discreetly and respectfully, ensuring that the streaming technology enhances rather than distracts from the memorial experience.</p>"
    imageUrl="https://placehold.co/800x600/e9ecef/495057?text=TributeStream+Process"
    imageAlt="TributeStream process overview"
    imagePosition="right"
  />
  
  <!-- Process Steps Timeline -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-12">The TributeStream Process</h2>
    
    <div class="relative">
      <!-- Timeline line -->
      <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
      
      <!-- Timeline items -->
      <div class="relative z-10">
        {#each processSteps as step, index}
          <div class="flex items-center mb-16 relative">
            <div class={`w-1/2 pr-8 text-right ${index % 2 === 1 ? 'order-2' : ''}`}>
              <h3 class="text-xl font-semibold mb-2">{step.title}</h3>
              <p class="text-muted-foreground">{step.description}</p>
            </div>
            
            <div class="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={step.icon} />
                </svg>
              </div>
            </div>
            
            <div class={`w-1/2 pl-8 ${index % 2 === 0 ? 'order-2' : ''}`}>
              {#if index % 2 === 1}
                <h3 class="text-xl font-semibold mb-2">{step.title}</h3>
                <p class="text-muted-foreground">{step.description}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Detailed Process Tabs -->
  <section class="py-16 bg-gray-50 rounded-lg">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">Detailed Process Breakdown</h2>
      
      <!-- Tabs -->
      <div class="flex flex-wrap border-b mb-6">
        {#each processSteps as step, index}
          <button 
            class={`px-4 py-2 font-medium ${activeTab === index ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
            on:click={() => activeTab = index}
          >
            {step.title}
          </button>
        {/each}
      </div>
      
      <!-- Tab content -->
      <div class="bg-white p-6 rounded-lg shadow-sm">
        {#if activeTab === 0}
          <h3 class="text-xl font-semibold mb-4">Initial Consultation</h3>
          <p class="mb-4">The process begins with a conversation about your needs and wishes. We'll discuss:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Basic information about the memorial service</li>
            <li>Your streaming needs and preferences</li>
            <li>Any special requests or considerations</li>
            <li>Questions you may have about the process</li>
          </ul>
          <p>This consultation can take place over the phone, via video call, or in person, depending on your preference and timing.</p>
        {:else if activeTab === 1}
          <h3 class="text-xl font-semibold mb-4">Booking & Planning</h3>
          <p class="mb-4">Once you decide to proceed, we'll guide you through the booking process:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Complete our simple booking form with service details</li>
            <li>Provide information about the venue and service format</li>
            <li>Discuss any specific filming requests or restrictions</li>
            <li>Receive a confirmation of your booking</li>
          </ul>
          <p>Our team will create a customized streaming plan based on your specific needs and venue requirements.</p>
        {:else if activeTab === 2}
          <h3 class="text-xl font-semibold mb-4">Technical Setup</h3>
          <p class="mb-4">On the day of the service, our technical team arrives early to prepare:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Setting up cameras in discreet, appropriate locations</li>
            <li>Testing audio equipment for optimal sound quality</li>
            <li>Establishing a secure internet connection</li>
            <li>Performing final checks of all systems</li>
          </ul>
          <p>Our setup is designed to be unobtrusive, respecting the solemnity of the occasion while ensuring quality streaming.</p>
        {:else if activeTab === 3}
          <h3 class="text-xl font-semibold mb-4">Live Streaming</h3>
          <p class="mb-4">During the service, our team works discreetly to provide a quality stream:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Professional camera operation with appropriate angles</li>
            <li>Real-time monitoring of audio and video quality</li>
            <li>Technical support for remote viewers</li>
            <li>Backup recording in case of any streaming issues</li>
          </ul>
          <p>Remote attendees can view the service in real-time through a private, secure link, allowing them to participate from anywhere in the world.</p>
        {:else if activeTab === 4}
          <h3 class="text-xl font-semibold mb-4">Post-Production</h3>
          <p class="mb-4">After the service, our editing team enhances the recording:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Professional editing for improved visual quality</li>
            <li>Audio enhancement for clear sound</li>
            <li>Addition of titles or captions if requested</li>
            <li>Creation of a final, polished memorial recording</li>
          </ul>
          <p>This process typically takes 3-5 business days, resulting in a high-quality keepsake of the service.</p>
        {:else if activeTab === 5}
          <h3 class="text-xl font-semibold mb-4">Delivery & Support</h3>
          <p class="mb-4">The final phase includes delivery and ongoing support:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Secure delivery of the edited recording</li>
            <li>Instructions for viewing and sharing the recording</li>
            <li>Options for additional copies or formats</li>
            <li>Ongoing technical support for accessing the content</li>
          </ul>
          <p>The recording remains available on your private memorial page, and we provide continued support for any questions or needs that arise.</p>
        {/if}
      </div>
    </div>
  </section>
  
  <!-- Video Section -->
  <section class="py-16">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">See Our Process in Action</h2>
      <VideoPlayer
        videoUrl="https://placehold.co/1280x720/e9ecef/495057?text=TributeStream+Process+Video"
        posterUrl="https://placehold.co/1280x720/e9ecef/495057?text=TributeStream+Process+Video"
        title="The TributeStream Process Explained"
        controls={true}
      />
      <p class="text-center mt-4 text-muted-foreground">
        Watch this short video to see how we work with families to create meaningful memorial streams.
      </p>
    </div>
  </section>
  
  <!-- Photo Gallery -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-8">Our Process in Pictures</h2>
    <PhotoGallery photos={photos} columns={3} />
  </section>
  
  <!-- Testimonials Section -->
  <section class="py-16 bg-gray-50 rounded-lg">
    <h2 class="text-3xl font-bold text-center mb-12">What Families Say About Our Process</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {#each testimonials as testimonial}
        <TestimonialCard {...testimonial} />
      {/each}
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="py-16">
    <FAQ items={faqItems} title="Frequently Asked Questions About Our Process" />
  </section>
  
  <!-- Call to Action -->
  <section class="py-16 text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
      Our team is ready to guide you through the process and answer any questions you may have.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/schedule-now" class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
        Schedule Your TributeStream
      </a>
      <a href="/contact-us" class="bg-white border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
        Contact Us With Questions
      </a>
    </div>
  </section>
</div>