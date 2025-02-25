<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<div class="container mx-auto p-8">
  <h1 class="mb-8 text-3xl font-bold">Button Examples</h1>
  
  <div class="space-y-8">
    <!-- Default Variants -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Default Variants</h2>
      <div class="flex flex-wrap gap-4">
        <Button>Default Button</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>

    <!-- Size Variants -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">Size Variants</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </Button>
      </div>
    </div>

    <!-- States -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">States</h2>
      <div class="flex flex-wrap gap-4">
        <Button disabled>Disabled</Button>
        <Button variant="destructive" disabled>Disabled Destructive</Button>
        <Button variant="outline" disabled>Disabled Outline</Button>
      </div>
    </div>

    <!-- With Icons -->
    <div class="space-y-4">
      <h2 class="text-xl font-semibold">With Icons</h2>
      <div class="flex flex-wrap gap-4">
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          Add New
        </Button>
        <Button variant="outline">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 h-4 w-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </Button>
      </div>
    </div>
  </div>
</div>