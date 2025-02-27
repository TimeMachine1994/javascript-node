<script lang="ts">
  import { ArticleSection, TestimonialCard, VideoPlayer, PhotoGallery, FAQ } from "$lib/components/shared";
  
  // Sample testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Family Member",
      testimonial: "TributeStream made it possible for our entire family to be part of my father's memorial service, even those who couldn't travel. The quality was exceptional and the team was compassionate throughout the process.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Funeral Director",
      testimonial: "As a funeral director, I've seen how TributeStream transforms the memorial experience. Families appreciate the ability to share the service with loved ones across the globe.",
      rating: 5
    },
    {
      name: "Emily Chen",
      role: "Family Member",
      testimonial: "When my grandmother passed, relatives from overseas couldn't make it to the service. TributeStream allowed them to participate in real-time, which meant everything to our family.",
      rating: 5
    }
  ];
  
  // Sample FAQ data
  const faqItems = [
    {
      question: "What makes TributeStream different from other memorial streaming services?",
      answer: "TributeStream offers professional-grade production quality, multiple camera angles, personalized memorial pages, and dedicated technical support throughout the entire process. Our focus is on creating a dignified, meaningful experience that honors your loved one."
    },
    {
      question: "How many people can view a TributeStream service?",
      answer: "There is no limit to the number of viewers who can participate in your TributeStream service. Whether you have 10 or 10,000 people wanting to attend virtually, our platform can accommodate everyone."
    },
    {
      question: "Is the stream private and secure?",
      answer: "Yes, privacy and security are our top priorities. You control who receives access to your TributeStream service. We use secure streaming technology and provide private links that can be shared only with those you wish to invite."
    },
    {
      question: "Can we get a recording of the service afterward?",
      answer: "Absolutely. All TributeStream services include a professionally edited recording that is provided to the family. This recording can be shared with those who couldn't attend live or kept as a meaningful keepsake."
    },
    {
      question: "Do we need special technical equipment or knowledge?",
      answer: "No special equipment or technical knowledge is required on your part. Our professional team brings all necessary equipment and handles all technical aspects, allowing you to focus on what matters most during this difficult time."
    }
  ];
  
  // Sample photos for gallery
  const photos = [
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Memorial+Service",
      alt: "Memorial service with TributeStream setup",
      caption: "Professional streaming setup integrated seamlessly with the service"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Family+Viewing",
      alt: "Family members watching a memorial service remotely",
      caption: "Connecting family members across distances"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Technical+Team",
      alt: "TributeStream technical team",
      caption: "Our professional team ensures flawless streaming"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Memorial+Page",
      alt: "Custom memorial page",
      caption: "Personalized memorial pages for each service"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Global+Reach",
      alt: "Global map showing viewers",
      caption: "Connecting loved ones from around the world"
    },
    {
      url: "https://placehold.co/600x400/e9ecef/495057?text=Recording",
      alt: "Memorial recording being viewed",
      caption: "High-quality recordings preserve the memory"
    }
  ];
</script>

<svelte:head>
  <title>Why Choose TributeStream | Memorial Streaming Services</title>
  <meta name="description" content="Discover why families and funeral homes choose TributeStream for professional memorial streaming services that connect loved ones across distances." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <!-- Hero Section -->
  <section class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Why Choose TributeStream</h1>
    <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
      Bringing families together during life's most important moments, no matter the distance.
    </p>
  </section>
  
  <!-- Main Value Proposition -->
  <ArticleSection
    title="Connecting Families Across Distances"
    subtitle="Professional memorial streaming services with compassion and care"
    content="<p class='mb-4'>At TributeStream, we understand that not everyone can be physically present for a memorial service. Distance, health concerns, or other circumstances can prevent loved ones from attending in person.</p>
    <p class='mb-4'>Our professional memorial streaming service bridges this gap, allowing family and friends to participate in the service from anywhere in the world. With high-definition video, crystal-clear audio, and compassionate technical support, we ensure that everyone can be part of this important moment.</p>
    <p>We handle all technical aspects with discretion and respect, allowing you to focus on what matters most during this difficult time.</p>"
    imageUrl="https://placehold.co/800x600/e9ecef/495057?text=TributeStream+Service"
    imageAlt="TributeStream memorial service streaming"
    imagePosition="right"
  />
  
  <!-- Key Benefits Section -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-12">The TributeStream Difference</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Professional Quality</h3>
        <p class="text-muted-foreground">
          High-definition video, multiple camera angles, and professional audio ensure everyone experiences the service with clarity and dignity.
        </p>
      </div>
      
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Global Reach</h3>
        <p class="text-muted-foreground">
          Connect family and friends from around the world, allowing everyone to participate regardless of distance or circumstances.
        </p>
      </div>
      
      <div class="text-center p-6 bg-white rounded-lg shadow-sm">
        <div class="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Privacy & Security</h3>
        <p class="text-muted-foreground">
          Private streaming links, secure connections, and complete control over who can access your service.
        </p>
      </div>
    </div>
  </section>
  
  <!-- Video Section -->
  <section class="py-16 bg-gray-50 rounded-lg">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-center mb-8">See TributeStream in Action</h2>
      <VideoPlayer
        videoUrl="https://placehold.co/1280x720/e9ecef/495057?text=TributeStream+Video"
        posterUrl="https://placehold.co/1280x720/e9ecef/495057?text=TributeStream+Video"
        title="How TributeStream Works"
        controls={true}
      />
      <p class="text-center mt-4 text-muted-foreground">
        Watch how TributeStream helps families connect during memorial services.
      </p>
    </div>
  </section>
  
  <!-- Testimonials Section -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-12">What Families Are Saying</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each testimonials as testimonial}
        <TestimonialCard {...testimonial} />
      {/each}
    </div>
  </section>
  
  <!-- Photo Gallery -->
  <section class="py-16">
    <h2 class="text-3xl font-bold text-center mb-8">TributeStream Gallery</h2>
    <PhotoGallery photos={photos} columns={3} />
  </section>
  
  <!-- Statistics Section -->
  <section class="py-16 bg-primary text-white rounded-lg">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">TributeStream Impact</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
        <div>
          <div class="text-4xl font-bold mb-2">5,000+</div>
          <div class="text-lg">Services Streamed</div>
        </div>
        
        <div>
          <div class="text-4xl font-bold mb-2">98%</div>
          <div class="text-lg">Satisfaction Rate</div>
        </div>
        
        <div>
          <div class="text-4xl font-bold mb-2">250,000+</div>
          <div class="text-lg">Remote Attendees</div>
        </div>
        
        <div>
          <div class="text-4xl font-bold mb-2">100+</div>
          <div class="text-lg">Countries Reached</div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- FAQ Section -->
  <section class="py-16">
    <FAQ items={faqItems} title="Frequently Asked Questions" />
  </section>
  
  <!-- Call to Action -->
  <section class="py-16 text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to Learn More?</h2>
    <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
      Contact us today to discuss how TributeStream can help your family connect during this important time.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/schedule-now" class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
        Schedule a Consultation
      </a>
      <a href="/contact-us" class="bg-white border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
        Contact Us
      </a>
    </div>
  </section>
</div>