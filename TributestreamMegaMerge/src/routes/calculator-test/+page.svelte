<script lang="ts">
  import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
  import type { OrderData } from '$lib/types/memorial-calculator';

  function handleSave(data: OrderData) {
    console.log('Saving schedule:', data);
    console.log('Total days:', data.package.scheduleDays.length);
    console.log('Total locations:', data.package.scheduleDays.reduce((acc, day) => acc + day.locations.length, 0));
    
    // Here you would typically save to your backend
    // Example of data structure:
    data.package.scheduleDays.forEach((day, dayIndex) => {
      console.log(`Day ${dayIndex + 1} (${day.date}):`);
      day.locations.forEach((loc, locIndex) => {
        console.log(`  Location ${locIndex + 1}: ${loc.name}`);
        console.log(`    Start time: ${loc.startTime}`);
        console.log(`    Duration: ${loc.duration} hours`);
        console.log(`    Address: ${loc.address}`);
        console.log(`    Notes: ${loc.notes}`);
      });
    });
  }

  function handleCheckout(data: OrderData) {
    console.log('Proceeding to checkout:', data);
    console.log('Total amount:', data.orderDetails.pricing.total);
    
    // Here you would typically:
    // 1. Validate the schedule (no overlapping times, etc.)
    // 2. Check location availability
    // 3. Redirect to payment processing
    // 4. Handle any booking conflicts
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Memorial Service Scheduler</h1>
  
  <div class="max-w-4xl mx-auto">
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">
            Scheduling Information
          </h3>
          <div class="mt-2 text-sm text-yellow-700">
            <ul class="list-disc pl-5 space-y-1">
              <li>You can schedule up to 3 locations per day</li>
              <li>Additional locations beyond the first one cost $349 each</li>
              <li>Each location includes 2 hours of service</li>
              <li>Additional hours cost $125 per hour</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <MemorialCalculator
      initialPackage="Solo"
      onSave={handleSave}
      onCheckout={handleCheckout}
    />
  </div>
</div>

<style>
  /* Additional styles if needed */
</style>