<script lang="ts">
  import { ContactForm, FAQ } from "$lib/components/shared";
  
  // Sample FAQ data
  const faqItems = [
    {
      question: "What's the best way to reach your team quickly?",
      answer: "For immediate assistance, we recommend calling our support line at (555) 123-4567. For less urgent matters, you can use this contact form or email us at support@tributestream.com, and we'll respond within 24 hours."
    },
    {
      question: "Do you offer consultations before booking?",
      answer: "Yes, we offer free consultations to discuss your needs and answer any questions you may have about our services. You can request a consultation through this contact form or by calling our office directly."
    },
    {
      question: "How quickly do you respond to inquiries?",
      answer: "We typically respond to all inquiries within 24 hours during business days. For urgent matters related to upcoming services, we prioritize those communications and often respond much more quickly."
    }
  ];
</script>

<svelte:head>
  <title>Contact TributeStream | Memorial Streaming Services</title>
  <meta name="description" content="Contact TributeStream for professional memorial streaming services. Our team is ready to answer your questions and help you honor your loved one." />
</svelte:head>

<div class="container mx-auto px-4 py-12">
  <!-- Hero Section -->
  <section class="text-center mb-16">
    <h1 class="text-4xl md:text-5xl font-bold mb-6">Contact TributeStream</h1>
    <p class="text-xl text-muted-foreground max-w-3xl mx-auto">
      We're here to answer your questions and help you honor your loved one.
    </p>
  </section>
  
  <!-- Main Content Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
    <!-- Contact Form -->
    <div>
      <ContactForm 
        title="Get in Touch"
        subtitle="Fill out the form below and we'll get back to you as soon as possible."
      />
    </div>
    
    <!-- Contact Information -->
    <div class="bg-white rounded-lg shadow-sm p-6 md:p-8 h-fit">
      <h2 class="text-2xl font-bold mb-6">Our Information</h2>
      
      <div class="space-y-6">
        <div class="flex items-start">
          <div class="bg-primary/10 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-1">Phone</h3>
            <p class="text-muted-foreground">(555) 123-4567</p>
            <p class="text-sm text-muted-foreground mt-1">Available 7 days a week, 8am-8pm EST</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <div class="bg-primary/10 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-1">Email</h3>
            <p class="text-muted-foreground">support@tributestream.com</p>
            <p class="text-sm text-muted-foreground mt-1">We respond within 24 hours</p>
          </div>
        </div>
        
        <div class="flex items-start">
          <div class="bg-primary/10 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium mb-1">Office Address</h3>
            <p class="text-muted-foreground">123 Memorial Lane</p>
            <p class="text-muted-foreground">Suite 456</p>
            <p class="text-muted-foreground">Tribute City, TS 78901</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- FAQ Section -->
  <section class="py-16">
    <FAQ items={faqItems} title="Contact FAQs" />
  </section>
  
  <!-- Call to Action -->
  <section class="py-16 text-center bg-gray-50 rounded-lg">
    <h2 class="text-3xl font-bold mb-4">Ready to Schedule Your TributeStream?</h2>
    <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
      Skip the contact form and go directly to our scheduling page to book your service.
    </p>
    <a href="/schedule-now" class="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
      Schedule Now
    </a>
  </section>
</div>