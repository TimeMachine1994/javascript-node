<script lang="ts">
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
  
  let {
    name,
    role = "",
    testimonial,
    imageUrl = "",
    rating = 5
  } = $props();
</script>

<Card class="h-full">
  <CardHeader>
    <div class="flex items-center gap-4">
      {#if imageUrl}
        <div class="h-12 w-12 rounded-full overflow-hidden">
          <img src={imageUrl} alt={name} class="h-full w-full object-cover" />
        </div>
      {:else}
        <div class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <span class="text-lg font-semibold">{name.charAt(0)}</span>
        </div>
      {/if}
      <div>
        <CardTitle class="text-lg">{name}</CardTitle>
        {#if role}
          <CardDescription>{role}</CardDescription>
        {/if}
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div class="flex mb-2">
      {#each Array(5) as _, i}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={i < rating ? "currentColor" : "none"} 
          stroke="currentColor"
          class="w-5 h-5 {i < rating ? 'text-yellow-500' : 'text-gray-300'}"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      {/each}
    </div>
    <p class="text-muted-foreground italic">"{testimonial}"</p>
  </CardContent>
  <CardFooter class="text-sm text-muted-foreground">
    <slot name="footer" />
  </CardFooter>
</Card>