<script lang="ts">
  interface FAQItem {
    question: string;
    answer: string;
    isOpen?: boolean;
  }
  
  let {
    items = [],
    title = "Frequently Asked Questions",
    allowMultiple = false
  } = $props<{
    items: FAQItem[];
    title?: string;
    allowMultiple?: boolean;
  }>();
  
  // Initialize open state for each item
  let openStates = $state<boolean[]>(items.map((item: FAQItem) => !!item.isOpen));
  
  function toggleItem(index: number) {
    if (allowMultiple) {
      openStates[index] = !openStates[index];
    } else {
      // Close all other items when opening a new one
      openStates = openStates.map((_, i) => i === index ? !openStates[index] : false);
    }
  }
</script>

<div class="faq-container py-8">
  <div class="container mx-auto px-4 max-w-4xl">
    {#if title}
      <h2 class="text-3xl font-bold mb-8 text-center">{title}</h2>
    {/if}
    
    <div class="space-y-4">
      {#each items as item, index}
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <button
            class="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
            on:click={() => toggleItem(index)}
            aria-expanded={openStates[index]}
            aria-controls={`faq-content-${index}`}
          >
            <span class="font-medium text-lg">{item.question}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 transition-transform duration-200 {openStates[index] ? 'rotate-180' : ''}" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div 
            id={`faq-content-${index}`}
            class="overflow-hidden transition-all duration-300 max-h-0 {openStates[index] ? 'max-h-96' : ''}"
            aria-hidden={!openStates[index]}
          >
            <div class="p-4 bg-gray-50 prose max-w-none">
              {@html item.answer}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Ensure smooth animation for accordion */
  .max-h-0 {
    max-height: 0;
  }
  
  .max-h-96 {
    max-height: 24rem;
  }
</style>