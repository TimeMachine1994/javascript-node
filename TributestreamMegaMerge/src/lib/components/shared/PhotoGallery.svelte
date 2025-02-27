<script lang="ts">
  interface Photo {
    url: string;
    alt: string;
    caption?: string;
  }
  
  let {
    photos = [],
    title = "",
    columns = 3
  } = $props<{
    photos: Photo[];
    title?: string;
    columns?: number;
  }>();
  
  let selectedPhoto = $state<Photo | null>(null);
  let isModalOpen = $state(false);
  
  function openModal(photo: Photo) {
    selectedPhoto = photo;
    isModalOpen = true;
  }
  
  function closeModal() {
    isModalOpen = false;
    setTimeout(() => {
      selectedPhoto = null;
    }, 300); // Wait for animation to complete
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (isModalOpen && event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="photo-gallery">
  {#if title}
    <h3 class="text-2xl font-semibold mb-4">{title}</h3>
  {/if}
  
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-{columns} gap-4">
    {#each photos as photo, i}
      <div 
        class="relative overflow-hidden rounded-lg aspect-square cursor-pointer hover:opacity-90 transition-opacity"
        on:click={() => openModal(photo)}
        on:keydown={(e) => e.key === 'Enter' && openModal(photo)}
        tabindex="0"
        role="button"
        aria-label={`View ${photo.alt}`}
      >
        <img 
          src={photo.url} 
          alt={photo.alt} 
          class="w-full h-full object-cover"
          loading="lazy"
        />
        {#if photo.caption}
          <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
            {photo.caption}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<!-- Modal for enlarged photo view -->
{#if isModalOpen}
  <div 
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 transition-opacity duration-300 {isModalOpen ? 'opacity-100' : 'opacity-0'}"
    on:click={closeModal}
  >
    <div 
      class="max-w-4xl max-h-[90vh] relative"
      on:click|stopPropagation={() => {}}
    >
      {#if selectedPhoto}
        <img 
          src={selectedPhoto.url} 
          alt={selectedPhoto.alt} 
          class="max-w-full max-h-[80vh] object-contain"
        />
        {#if selectedPhoto.caption}
          <div class="bg-black/60 text-white p-3 text-center mt-2 rounded">
            {selectedPhoto.caption}
          </div>
        {/if}
      {/if}
      
      <button 
        class="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-colors"
        on:click={closeModal}
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
{/if}