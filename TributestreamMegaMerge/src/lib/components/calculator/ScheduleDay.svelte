<script lang="ts">
  import { calculatorStore } from '$lib/stores/calculator';
  import { formatDate } from '$lib/utils/format';
  import FormField from '$lib/components/forms/FormField.svelte';
  
  // Schedule state
  let date = $state('');
  let time = $state('');
  let duration = $state(2); // Default 2 hours
  
  // Time zones
  const TIME_ZONES = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' }
  ];
  
  let timeZone = $state(TIME_ZONES[0].value);
  
  // Load existing schedule data if available
  calculatorStore.subscribe(calcState => {
    const scheduleDetails = calcState.scheduleDetails;
    date = scheduleDetails.date || '';
    time = scheduleDetails.time || '';
    duration = scheduleDetails.duration || 2;
    timeZone = scheduleDetails.timeZone || TIME_ZONES[0].value;
  });
  
  // Save schedule when form values change
  $effect(() => {
    calculatorStore.updateSchedule({
      date,
      time,
      duration,
      timeZone
    });
  });
  
  // Validation
  let dateError = $state<string | null>(null);
  let timeError = $state<string | null>(null);
  
  function validateDate() {
    if (!date) {
      dateError = 'Please select a date';
      return false;
    }
    
    // Check if date is in the future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      dateError = 'Please select a future date';
      return false;
    }
    
    dateError = null;
    return true;
  }
  
  function validateTime() {
    if (!time) {
      timeError = 'Please select a time';
      return false;
    }
    
    timeError = null;
    return true;
  }
  
  function validate() {
    const isDateValid = validateDate();
    const isTimeValid = validateTime();
    return isDateValid && isTimeValid;
  }
</script>

<div class="schedule-day space-y-4">
  <h3 class="text-xl font-semibold">Service Date & Time</h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Date selection -->
    <div>
      <FormField
        name="serviceDate"
        label="Service Date"
        type="date"
        value={date}
        error={dateError}
        required={true}
        on:input={(e) => {
          date = (e.currentTarget as HTMLInputElement)?.value || '';
          validateDate();
        }}
        on:blur={validateDate}
      />
    </div>
    
    <!-- Time selection -->
    <div>
      <FormField
        name="serviceTime"
        label="Service Time"
        type="time"
        value={time}
        error={timeError}
        required={true}
        on:input={(e) => {
          time = (e.currentTarget as HTMLInputElement)?.value || '';
          validateTime();
        }}
        on:blur={validateTime}
      />
    </div>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Duration selection -->
    <div>
      <label for="serviceDuration" class="block text-sm font-medium text-gray-700 mb-1">
        Service Duration
      </label>
      <select 
        id="serviceDuration" 
        name="serviceDuration"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        bind:value={duration}
      >
        <option value={1}>1 Hour</option>
        <option value={2}>2 Hours</option>
        <option value={3}>3 Hours</option>
        <option value={4}>4 Hours</option>
        <option value={5}>5 Hours</option>
      </select>
    </div>
    
    <!-- Time zone selection -->
    <div>
      <label for="timeZone" class="block text-sm font-medium text-gray-700 mb-1">
        Time Zone
      </label>
      <select 
        id="timeZone" 
        name="timeZone"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        bind:value={timeZone}
      >
        {#each TIME_ZONES as tz}
          <option value={tz.value}>{tz.label}</option>
        {/each}
      </select>
    </div>
  </div>
  
  <!-- Selected date and time summary -->
  {#if date && time}
    <div class="bg-gray-50 p-4 rounded-lg mt-4">
      <h4 class="font-medium text-gray-700">Service Details</h4>
      <p class="text-gray-800">
        {formatDate(date, { format: 'full' })} at {time} 
        ({TIME_ZONES.find(tz => tz.value === timeZone)?.label}) 
        for {duration} hour{duration > 1 ? 's' : ''}
      </p>
    </div>
  {/if}
</div>