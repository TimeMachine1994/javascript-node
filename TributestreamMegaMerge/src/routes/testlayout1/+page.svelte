<script lang="ts">
    import type { FamilyDashboardData } from '../family-dashboard/types';
    import type { CalculatorData, MemorialFormData, MetaEntry } from '$lib/types/user-metadata';
    import { goto } from '$app/navigation';
    
    let { data } = $props<{ data: FamilyDashboardData }>();
    
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

    // Navigation functions
    function navigateTo(path: string) {
        goto(path);
    }
</script>

<!-- Layout 1: Modern Card-based Design -->
<div class="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen p-6">
    <div class="max-w-5xl mx-auto space-y-8">
        <!-- Header Section -->
        <header class="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <h1 class="text-3xl font-bold text-blue-800">Family Dashboard</h1>
            <p class="text-blue-600 mt-1">Manage your memorial services and media</p>
        </header>

        <!-- Payment Status Banner -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 flex items-center">
                <svg class="w-6 h-6 fill-current mr-3" viewBox="0 0 24 24">
                    <path d="M20.285 2.998a1 1 0 0 1 .709 1.707l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414l4.293 4.293 10.293-10.293a1 1 0 0 1 1.414 0z"/>
                </svg>
                <span class="font-bold text-lg">Payment Status: Complete</span>
            </div>

            <!-- Memorial Information -->
            <div class="p-6">
                <div class="flex flex-col lg:flex-row gap-8">
                    <!-- Memorial Details -->
                    <div class="lg:w-1/2 space-y-5">
                        <h2 class="text-2xl font-bold text-gray-800 border-b border-blue-200 pb-2">
                            Celebration of life for {memorialFormData?.deceased?.name || 'Memorial Service'}
                        </h2>

                        {#if calculatorData?.scheduleDays?.[0]?.locations?.[0]}
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h3 class="font-semibold text-blue-700">Starting Location</h3>
                                <p class="text-gray-700 mt-1">{calculatorData.scheduleDays[0].locations[0].name}</p>
                                <p class="text-gray-600">{calculatorData.scheduleDays[0].locations[0].address}</p>
                            </div>

                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h3 class="font-semibold text-blue-700">Start Time</h3>
                                <p class="text-gray-700 mt-1">
                                    {calculatorData.scheduleDays[0].date} @ {calculatorData.scheduleDays[0].locations[0].startTime}
                                </p>
                            </div>
                        {/if}
                    </div>

                    <!-- Media Preview -->
                    <div class="lg:w-1/2 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg h-64 flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-16 h-16 text-blue-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <p class="mt-4 text-blue-500 font-medium">Media Preview Coming Soon</p>
                            <p class="text-blue-400 text-sm">Upload media to see it here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <button
                onclick={() => navigateTo('/family-dashboard/upload_media')}
                class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl shadow-lg font-bold flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                Upload Media
            </button>
            <button
                onclick={() => navigateTo('/booking-calculator')}
                class="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 px-6 rounded-xl shadow-lg font-bold flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Edit Schedule
            </button>
            <button
                onclick={() => navigateTo('/family-dashboard/poctransfer')}
                class="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white py-4 px-6 rounded-xl shadow-lg font-bold flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                Transfer POC
            </button>
            <button
                onclick={() => navigateTo('/family-dashboard/media_invite')}
                class="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl shadow-lg font-bold flex flex-col items-center justify-center transition-transform transform hover:scale-105"
            >
                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Invite Contributors
            </button>
        </div>

        <!-- Schedule Section -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="bg-gradient-to-r from-blue-600 to-teal-600 p-4 text-white flex justify-between items-center">
                <h3 class="text-xl font-bold">Current Livestream Schedule</h3>
                <button
                    onclick={() => navigateTo('/calc')}
                    class="bg-white text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg font-bold text-sm shadow-sm transition-colors"
                >
                    Edit
                </button>
            </div>
            
            <div class="p-4">
                {#if calculatorData?.scheduleDays}
                    <div class="overflow-x-auto">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr class="bg-blue-50">
                                    <th class="text-left p-3 text-blue-700 border-b-2 border-blue-200">Date</th>
                                    <th class="text-left p-3 text-blue-700 border-b-2 border-blue-200">Start Time</th>
                                    <th class="text-left p-3 text-blue-700 border-b-2 border-blue-200">Location</th>
                                    <th class="text-left p-3 text-blue-700 border-b-2 border-blue-200">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each calculatorData.scheduleDays as day}
                                    {#each day.locations as location}
                                        <tr class="hover:bg-blue-50 transition-colors">
                                            <td class="p-3 border-b border-blue-100">{day.date}</td>
                                            <td class="p-3 border-b border-blue-100">{location.startTime}</td>
                                            <td class="p-3 border-b border-blue-100">
                                                <div class="font-medium">{location.name}</div>
                                                <div class="text-sm text-gray-600">{location.address}</div>
                                            </td>
                                            <td class="p-3 border-b border-blue-100">{location.duration} hours</td>
                                        </tr>
                                    {/each}
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <div class="text-center py-8 text-gray-500">
                        <svg class="w-16 h-16 text-blue-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p>No schedule information available.</p>
                        <p class="text-sm mt-2">Click the 'Edit Schedule' button to add your schedule.</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>