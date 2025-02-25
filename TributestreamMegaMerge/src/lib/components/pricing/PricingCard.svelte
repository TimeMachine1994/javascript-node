<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  interface PricingFeature {
    name: string;
    included: boolean;
  }

  let { 
    name, 
    price, 
    description, 
    features = [], 
    isPopular = false,
    onSelect,
    ctaText = "Select Plan"
  } = $props<{
    name: string;
    price: number;
    description?: string;
    features?: PricingFeature[];
    isPopular?: boolean;
    onSelect?: () => void;
    ctaText?: string;
  }>();
</script>

<Card class={cn(
  "flex flex-col h-full transition-all",
  isPopular ? "border-primary shadow-lg" : ""
)}>
  {#if isPopular}
    <div class="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
      <span class="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
        Popular
      </span>
    </div>
  {/if}
  
  <CardHeader>
    <CardTitle class="text-xl">{name}</CardTitle>
    {#if description}
      <p class="text-sm text-muted-foreground">{description}</p>
    {/if}
    <div class="mt-2">
      <span class="text-3xl font-bold">${price}</span>
    </div>
  </CardHeader>
  
  <CardContent class="flex-grow">
    {#if features.length > 0}
      <ul class="space-y-2">
        {#each features as feature}
          <li class="flex items-start">
            <span class="mr-2 mt-1">
              {#if feature.included}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              {/if}
            </span>
            <span class={feature.included ? "text-foreground" : "text-muted-foreground"}>
              {feature.name}
            </span>
          </li>
        {/each}
      </ul>
    {/if}
  </CardContent>
  
  <CardFooter>
    <Button 
      variant={isPopular ? "default" : "outline"} 
      class="w-full"
      onclick={onSelect}
    >
      {ctaText}
    </Button>
  </CardFooter>
</Card>