<script lang="ts">
  let { title, subtitle, imageUrl } = $props<{
    title: string;
    subtitle?: string;
    imageUrl?: string;
  }>();
</script>

<div class="memorial-header relative">
  {#if imageUrl}
    <div class="memorial-header-image h-64 md:h-80 lg:h-96 w-full overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{title}</h1>
      {#if subtitle}
        <p class="text-lg md:text-xl lg:text-2xl">{subtitle}</p>
      {/if}
    </div>
  {:else}
    <div class="py-12 bg-gray-100">
      <div class="text-center">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-gray-900">{title}</h1>
        {#if subtitle}
          <p class="text-lg md:text-xl lg:text-2xl text-gray-700">{subtitle}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>