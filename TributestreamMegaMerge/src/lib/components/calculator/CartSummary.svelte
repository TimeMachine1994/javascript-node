<script lang="ts">
  import type { CartItem } from '$lib/types/user-metadata';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';

  let { items, total } = $props<{
    items: CartItem[];
    total: number;
  }>();
</script>

<Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
  </CardHeader>
  
  <CardContent>
    <div class="space-y-2">
      {#each items as item}
        <div class="flex justify-between text-sm py-1">
          <div class="flex-1 pr-4">
            <span>{item.name}</span>
          </div>
          <span class="font-medium">${item.price.toFixed(2)}</span>
        </div>
      {/each}
    </div>
  </CardContent>
  
  <CardFooter>
    <div class="w-full pt-4 border-t flex justify-between font-semibold">
      <span>Total:</span>
      <span>${total.toFixed(2)}</span>
    </div>
  </CardFooter>
</Card>