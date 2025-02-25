<script lang="ts">
  import type { ScheduleDay, Location } from '$lib/types/user-metadata';
  import LocationForm from './LocationForm.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';

  const DEFAULT_LOCATION: Location = {
    name: "",
    address: "",
    travelExceedsHour: false,
    startTime: "09:00",
    duration: 2,
    notes: ""
  };

  let { day, dayIndex, onRemove, onAddLocation, onRemoveLocation } = $props<{
    day: ScheduleDay;
    dayIndex: number;
    onRemove: (dayIndex: number) => void;
    onAddLocation: (dayIndex: number) => void;
    onRemoveLocation: (dayIndex: number, locationIndex: number) => void;
  }>();
</script>

<Card class="mb-6">
  <CardHeader>
    <div class="flex items-center justify-between">
      <CardTitle>Day {dayIndex + 1}</CardTitle>
      {#if dayIndex > 0}
        <Button 
          variant="destructive" 
          size="sm" 
          onclick={() => onRemove(dayIndex)}
        >
          Remove Day
        </Button>
      {/if}
    </div>
  </CardHeader>
  
  <CardContent class="space-y-6">
    <div class="grid gap-2">
      <Label for="day-date-{dayIndex}">Date</Label>
      <Input 
        id="day-date-{dayIndex}"
        type="date"
        bind:value={day.date}
      />
    </div>

    <!-- Locations for this day -->
    <div class="locations space-y-4">
      <h3 class="text-base font-medium mb-2">Locations</h3>
      
      {#each day.locations as location, locationIndex}
        <LocationForm
          {location}
          {dayIndex}
          {locationIndex}
          onRemove={onRemoveLocation}
          isRemovable={locationIndex > 0}
        />
      {/each}

      {#if day.locations.length < 3}
        <Button 
          variant="outline" 
          size="sm"
          onclick={() => onAddLocation(dayIndex)}
          class="w-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Location ({day.locations.length}/3)
        </Button>
      {/if}
    </div>
  </CardContent>
</Card>