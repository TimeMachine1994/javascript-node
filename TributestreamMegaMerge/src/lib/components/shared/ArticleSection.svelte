<script lang="ts">
  let {
    title = "",
    subtitle = "",
    content = "",
    imageUrl = "",
    imageAlt = "",
    imagePosition = "right", // "right", "left", "top", "bottom", "none"
    imageBorderRadius = "lg", // "none", "sm", "md", "lg", "full"
    maxWidth = "4xl", // "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "none"
    textAlign = "left", // "left", "center", "right", "justify"
    theme = "light" // "light", "dark"
  } = $props();
  
  // Computed classes
  $effect(() => {
    // These are computed once and then cached
    const borderRadiusClasses: Record<string, string> = {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full"
    };
    
    const maxWidthClasses: Record<string, string> = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
      "5xl": "max-w-5xl",
      "6xl": "max-w-6xl",
      "7xl": "max-w-7xl",
      none: ""
    };
    
    const textAlignClasses: Record<string, string> = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify"
    };
    
    const themeClasses: Record<string, string> = {
      light: "bg-white text-gray-800",
      dark: "bg-gray-900 text-white"
    };
    
    borderRadiusClass = borderRadiusClasses[imageBorderRadius as keyof typeof borderRadiusClasses] || "rounded-lg";
    maxWidthClass = maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || "max-w-4xl";
    textAlignClass = textAlignClasses[textAlign as keyof typeof textAlignClasses] || "text-left";
    themeClass = themeClasses[theme as keyof typeof themeClasses] || "bg-white text-gray-800";
  });
  
  let borderRadiusClass = $state("rounded-lg");
  let maxWidthClass = $state("max-w-4xl");
  let textAlignClass = $state("text-left");
  let themeClass = $state("bg-white text-gray-800");
  
  // Determine layout based on image position
  let hasImage = $derived(!!imageUrl);
  let isImageHorizontal = $derived(imagePosition === "left" || imagePosition === "right");
  let isImageVertical = $derived(imagePosition === "top" || imagePosition === "bottom");
</script>

<section class="py-8 {themeClass}">
  <div class="container mx-auto px-4 {maxWidthClass}">
    <div class="{textAlignClass}">
      {#if hasImage && imagePosition === "top"}
        <div class="mb-6">
          <img src={imageUrl} alt={imageAlt} class="w-full object-cover {borderRadiusClass}" />
        </div>
      {/if}
      
      {#if title}
        <h2 class="text-3xl font-bold mb-3">{title}</h2>
      {/if}
      
      {#if subtitle}
        <h3 class="text-xl text-muted-foreground mb-6">{subtitle}</h3>
      {/if}
      
      <div class={isImageHorizontal ? "flex flex-col md:flex-row gap-8 items-start" : ""}>
        {#if hasImage && imagePosition === "left"}
          <div class="md:w-1/3 mb-4 md:mb-0 flex-shrink-0">
            <img src={imageUrl} alt={imageAlt} class="w-full {borderRadiusClass}" />
          </div>
        {/if}
        
        <div class={isImageHorizontal ? (imagePosition === "left" ? "md:w-2/3" : "md:w-2/3 order-first md:order-none") : ""}>
          {#if content}
            <div class="prose max-w-none">
              {@html content}
            </div>
          {:else}
            <slot />
          {/if}
        </div>
        
        {#if hasImage && imagePosition === "right"}
          <div class="md:w-1/3 mt-4 md:mt-0 flex-shrink-0">
            <img src={imageUrl} alt={imageAlt} class="w-full {borderRadiusClass}" />
          </div>
        {/if}
      </div>
      
      {#if hasImage && imagePosition === "bottom"}
        <div class="mt-6">
          <img src={imageUrl} alt={imageAlt} class="w-full object-cover {borderRadiusClass}" />
        </div>
      {/if}
    </div>
  </div>
</section>