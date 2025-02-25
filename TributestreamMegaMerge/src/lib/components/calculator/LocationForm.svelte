<script lang="ts">
  import type { Location } from '$lib/types/user-metadata';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';

  let { location, dayIndex, locationIndex, onRemove, isRemovable = true } = $props<{
    location: Location;
    dayIndex: number;
    locationIndex: number;
    onRemove: (dayIndex: number, locationIndex: number) => void;
    isRemovable?: boolean;
  }>();
</script>

<Card class="mb-4">
  <CardHeader class="pb-2">
    <div class="flex items-center justify-between">
      <CardTitle class="text-lg">Location {locationIndex + 1}</CardTitle>
      {#if isRemovable}
        <Button 
          variant="destructive" 
          size="sm" 
          onclick={() => onRemove(dayIndex, locationIndex)}
        >
          Remove
        </Button>
      {/if}
    </div>
  </CardHeader>
  
  <CardContent class="space-y-4">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Label for="location-name-{dayIndex}-{locationIndex}">Location Name</Label>
        <Input 
          id="location-name-{dayIndex}-{locationIndex}"
          type="text"
          placeholder="Enter location name"
          bind:value={location.name}
        />
      </div>
      
      <div class="grid gap-2">
        <Label for="location-address-{dayIndex}-{locationIndex}">Address</Label>
        <Input 
          id="location-address-{dayIndex}-{locationIndex}"
          type="text"
          placeholder="Enter address"
          bind:value={location.address}
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="grid gap-2">
        <Label for="location-time-{dayIndex}-{locationIndex}">Start Time</Label>
        <Input 
          id="location-time-{dayIndex}-{locationIndex}"
          type="time"
          bind:value={location.startTime}
        />
      </div>

      <div class="grid gap-2">
        <Label for="location-duration-{dayIndex}-{locationIndex}">Duration (hours)</Label>
        <Input 
          id="location-duration-{dayIndex}-{locationIndex}"
          type="number"
          min="1"
          bind:value={location.duration}
        />
      </div>
    </div>

    <div class="grid gap-2">
      <Label for="location-notes-{dayIndex}-{locationIndex}">Notes</Label>
      <textarea
        id="location-notes-{dayIndex}-{locationIndex}"
        bind:value={location.notes}
        rows="2"
        class="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Add any special instructions or notes"
      ></textarea>
    </div>

    <div class="flex items-center space-x-2">
      <input 
        id="travel-exceeds-{dayIndex}-{locationIndex}"
        type="checkbox"
        bind:checked={location.travelExceedsHour}
        class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
      />
      <Label for="travel-exceeds-{dayIndex}-{locationIndex}" class="text-sm font-normal">
        Travel exceeds 1 hour
      </Label>
    </div>
  </CardContent>
</Card>