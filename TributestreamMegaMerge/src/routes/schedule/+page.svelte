<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import type { CalculatorData, MemorialFormData, Location, CartItem, MetaEntry } from '$lib/types/user-metadata';
    
    let { data } = $props<{ data: PageData }>();
    
    // Initialize state
    let calculatorData = $state<CalculatorData | null>(null);
    let memorialFormData = $state<MemorialFormData | null>(null);
    
    // Parse the calculator data from meta entries
    $effect(() => {
        console.log('Server data received:', data);
        
        if (data.scheduleData?.meta) {
            // Find calculator data entry
            const calcEntry = data.scheduleData.meta.find((entry: MetaEntry) => entry.meta_key === 'calculator_data');
            if (calcEntry) {
                try {
                    calculatorData = JSON.parse(calcEntry.meta_value);
                    console.log('Parsed calculator data:', calculatorData);
                } catch (e) {
                    console.error('Failed to parse calculator data:', e);
                }
            }
        }

        // Get memorial form data
        if (data.userMeta?.memorial_form_data) {
            memorialFormData = data.userMeta.memorial_form_data;
            console.log('Memorial form data:', memorialFormData);
        }
    });
</script>

<div class="max-w-4xl mx-auto space-y-6 p-4">
    {#if calculatorData && memorialFormData}
        <!-- Card: Payment Status and Event Overview -->
        <div class="bg-white rounded-lg shadow p-6 space-y-4">
            <!-- Payment Status Bar -->
            <div class="flex items-center justify-between bg-green-50 border border-green-300 rounded p-3">
                <div class="flex items-center space-x-2 text-green-700">
                    <!-- Checkmark icon -->
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.285 2.998a1 1 0 0 1 .709 1.707l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414l4.293 4.293 10.293-10.293a1 1 0 0 1 1.414 0z"/>
                    </svg>
                    <span class="font-semibold">Payment Status: Complete</span>
                </div>
            </div>
            
            <!-- Main Event Details -->
            <div class="flex flex-col md:flex-row md:space-x-6">
                <!-- Text Details -->
                <div class="md:flex-1 space-y-4 mb-4 md:mb-0">
                    <!-- Title of the Event -->
                    <h2 class="text-2xl font-bold text-gray-700">
                        Celebration of life for {memorialFormData.deceased.name}
                    </h2>

                    <!-- Starting Location -->
                    {#if calculatorData.scheduleDays?.[0]?.locations?.[0]}
                        <div>
                            <h3 class="text-sm font-semibold text-gray-600">Starting Location</h3>
                            <p class="text-gray-800">{calculatorData.scheduleDays[0].locations[0].name}</p>
                            <p class="text-gray-800">{calculatorData.scheduleDays[0].locations[0].address}</p>
                        </div>

                        <!-- Start Time -->
                        <div>
                            <h3 class="text-sm font-semibold text-gray-600">Start Time</h3>
                            <p class="text-gray-800">
                                {calculatorData.scheduleDays[0].date} @ {calculatorData.scheduleDays[0].locations[0].startTime}
                            </p>
                        </div>
                    {/if}
                </div>
                
                <!-- Media Placeholder -->
                <div class="md:w-1/2 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                    <span class="text-sm">Media Preview Coming Soon</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
                class="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/upload_media')}
            >
                Upload Media
            </button>
            <button
                class="bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/calc')}
            >
                Edit Schedule
            </button>
            <button
                class="bg-pink-100 hover:bg-pink-200 text-pink-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/poctransfer')}
            >
                Transfer POC
            </button>
            <button
                class="bg-purple-100 hover:bg-purple-200 text-purple-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/media_invite')}
            >
                Invite Contributors
            </button>
        </div>

        <!-- Current Livestream Schedule Section -->
        <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-700">Current Livestream Schedule</h3>
                <button
                    class="bg-red-100 text-red-800 py-1 px-3 rounded shadow font-semibold"
                    on:click={() => goto('/calc')}
                >
                    Edit
                </button>
            </div>
            
            <!-- Schedule Table -->
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="text-left text-gray-600">
                        <tr class="border-b">
                            <th class="pb-2">Date</th>
                            <th class="pb-2">Start Time</th>
                            <th class="pb-2">Location</th>
                            <th class="pb-2">Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each calculatorData.scheduleDays as day}
                            {#each day.locations as location}
                                <tr class="border-b">
                                    <td class="py-2">{day.date}</td>
                                    <td>{location.startTime}</td>
                                    <td>{location.name}<br>{location.address}</td>
                                    <td>{location.duration} hours</td>
                                </tr>
                            {/each}
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    {:else}
        <div class="text-center py-8">
            <p class="text-gray-600">No schedule information found. Please complete the memorial calculator first.</p>
            <button
                class="mt-4 bg-primary text-white py-2 px-4 rounded shadow hover:bg-primary/90"
                on:click={() => goto('/calc')}
            >
                Go to Calculator
            </button>
        </div>
    {/if}
</div>