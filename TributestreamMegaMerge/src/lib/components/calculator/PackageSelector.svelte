<script lang="ts">
  import { calculatorStore, PackageType, PACKAGE_INFO } from '$lib/stores/calculator';
  import { Button } from '$lib/components/ui/button';
  import { cn } from '$lib/utils/cn';
  
  // Convert the PackageInfo object to an array for easier rendering
  const packages = Object.values(PACKAGE_INFO);
  
  // Get the current calculator state
  let selectedPackage = $state<PackageType | null>(null);
  
  // Subscribe to calculator store to get the selected package
  calculatorStore.subscribe(state => {
    selectedPackage = state.selectedPackage;
  });
  
  // Handle package selection
  function selectPackage(packageType: PackageType) {
    calculatorStore.selectPackage(packageType);
  }
</script>

<div class="package-selector">
  <h2 class="text-2xl font-semibold mb-6">Select a Service Package</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    {#each packages as pkg}
      <div 
        class={cn(
          "border rounded-lg overflow-hidden transition-all transform hover:scale-[1.02] cursor-pointer",
          selectedPackage === pkg.id
            ? "border-primary border-2 shadow-md"
            : "border-gray-200 hover:border-gray-300 hover:shadow"
        )}
        on:click={() => selectPackage(pkg.id as PackageType)}
        on:keydown={(e) => e.key === 'Enter' && selectPackage(pkg.id as PackageType)}
        tabindex="0"
      >
        <!-- Package header -->
        <div 
          class={cn(
            "p-4 text-center border-b",
            pkg.isPopular
              ? "bg-primary text-primary-foreground"
              : "bg-gray-50"
          )}
        >
          {#if pkg.isPopular}
            <span class="inline-block px-2 py-1 text-xs bg-white text-primary rounded-full mb-2">
              MOST POPULAR
            </span>
          {/if}
          <h3 class="text-lg font-bold">{pkg.name}</h3>
          <p class="text-3xl font-bold mt-2">
            ${pkg.price}
            <span class="text-sm font-normal opacity-80">/service</span>
          </p>
        </div>
        
        <!-- Package details -->
        <div class="p-6">
          <p class="text-gray-600 mb-4">{pkg.description}</p>
          
          <ul class="space-y-3 mb-6">
            {#each pkg.features as feature}
              <li class="flex items-start">
                <svg class="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span class="text-gray-700">{feature}</span>
              </li>
            {/each}
          </ul>
          
          <Button 
            variant={selectedPackage === pkg.id ? "default" : "outline"}
            class="w-full" 
          >
            {selectedPackage === pkg.id ? "Selected" : "Select Package"}
          </Button>
        </div>
      </div>
    {/each}
  </div>
</div>