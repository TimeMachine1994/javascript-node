<script lang="ts">
  import type { Package } from '$lib/types/user-metadata';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { cn } from '$lib/utils';

  let { packages, selectedPackage, onSelect } = $props<{
    packages: Package[];
    selectedPackage: string;
    onSelect: (packageName: string) => void;
  }>();
</script>

<div class="package-selection grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  {#each packages as pkg}
    <Card 
      class={cn(
        "cursor-pointer transition-all hover:shadow-md",
        selectedPackage === pkg.name ? "border-primary border-2" : "border"
      )}
      onclick={() => onSelect(pkg.name)}
    >
      <CardHeader class="pb-2">
        <CardTitle class="text-lg">{pkg.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground mb-2">{pkg.description}</p>
        <p class="text-xl font-bold">${pkg.basePrice}</p>
        {#if pkg.features && pkg.features.length > 0}
          <ul class="mt-2 text-sm space-y-1">
            {#each pkg.features as feature}
              <li class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                {feature}
              </li>
            {/each}
          </ul>
        {/if}
      </CardContent>
    </Card>
  {/each}
</div>