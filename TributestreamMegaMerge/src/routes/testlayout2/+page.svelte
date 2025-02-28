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

<!-- Layout 2: Dark Theme with Sidebar -->
<div class="bg-gray-900 min-h-screen text-gray-100">
    <div class="flex flex-col md:flex-row">
        <!-- Sidebar Navigation -->
        <aside class="bg-gray-800 w-full md:w-64 md:min-h-screen p-5 space-y-6">
            <div class="border-b border-gray-700 pb-4">
                <h1 class="text-2xl font-bold text-blue-400">Family Dashboard</h1>
                <p class="text-gray-400 text-sm">Manage memorial services</p>
            </div>
            
            <!-- Quick Navigation -->
            <nav class="space-y-2">
                <button 
                    onclick={() => navigateTo('/family-dashboard/upload_media')}
                    class="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left"
                >
                    <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span>Upload Media</span>
                </button>
                
                <button 
                    onclick={() => navigateTo('/booking-calculator')}
                    class="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left"
                >
                    <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    <span>Edit Schedule</span>
                </button>
                
                <button 
                    onclick={() => navigateTo('/family-dashboard/poctransfer')}
                    class="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left"
                >
                    <svg class="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <span>Transfer POC</span>
                </button>
                
                <button 
                    onclick={() => navigateTo('/family-dashboard/media_invite')}
                    class="flex items-center space-x-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-left"
                >
                    <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                    </svg>
                    <span>Invite Contributors</span>
                </button>
            </nav>
            
            <!-- Payment Status -->
            <div class="bg-gray-700 p-3 rounded-lg mt-4">
                <div class="flex items-center space-x-2 text-green-400">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.285 2.998a1 1 0 0 1 .709 1.707l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414l4.293 4.293 10.293-10.293a1 1 0 0 1 1.414 0z"/>
                    </svg>
                    <span class="font-semibold">Payment Complete</span>
                </div>
            </div>
        </aside>
        
        <!-- Main Content Area -->
        <main class="flex-1 p-6">
            <!-- Memorial Header -->
            <div class="bg-gray-800 rounded-lg p-6 mb-6">
                <h2 class="text-2xl font-bold text-white mb-4">
                    Celebration of life for {memorialFormData?.deceased?.name || 'Memorial Service'}
                </h2>
                
                <div class="flex flex-col lg:flex-row gap-6">
                    <!-- Event Details -->
                    <div class="lg:w-1/2 space-y-4">
                        {#if calculatorData?.scheduleDays?.[0]?.locations?.[0]}
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <h3 class="text-blue-400 font-semibold mb-2">Starting Location</h3>
                                <p class="text-gray-200">{calculatorData.scheduleDays[0].locations[0].name}</p>
                                <p class="text-gray-400">{calculatorData.scheduleDays[0].locations[0].address}</p>
                            </div>
                            
                            <div class="bg-gray-700 p-4 rounded-lg">
                                <h3 class="text-blue-400 font-semibold mb-2">Start Time</h3>
                                <p class="text-gray-200">
                                    {calculatorData.scheduleDays[0].date} @ {calculatorData.scheduleDays[0].locations[0].startTime}
                                </p>
                            </div>
                        {/if}
                    </div>
                    
                    <!-- Media Preview -->
                    <div class="lg:w-1/2 bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                        <span class="text-gray-400">Media Preview Coming Soon</span>
                    </div>
                </div>
            </div>
            
            <!-- Schedule Section -->
            <div class="bg-gray-800 rounded-lg overflow-hidden mb-6">
                <div class="flex justify-between items-center p-4 bg-gray-700">
                    <h3 class="text-xl font-bold text-white">Current Livestream Schedule</h3>
                    <button
                        onclick={() => navigateTo('/calc')}
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold"
                    >
                        Edit
                    </button>
                </div>
                
                <div class="p-4">
                    {#if calculatorData?.scheduleDays}
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead class="text-gray-400 border-b border-gray-700">
                                    <tr>
                                        <th class="p-3">Date</th>
                                        <th class="p-3">Start Time</th>
                                        <th class="p-3">Location</th>
                                        <th class="p-3">Duration</th>
                                    </tr>
                                </thead>
                                <tbody class="text-gray-300">
                                    {#each calculatorData.scheduleDays as day}
                                        {#each day.locations as location}
                                            <tr class="border-b border-gray-700 hover:bg-gray-700">
                                                <td class="p-3">{day.date}</td>
                                                <td class="p-3">{location.startTime}</td>
                                                <td class="p-3">
                                                    <div class="font-medium">{location.name}</div>
                                                    <div class="text-sm text-gray-400">{location.address}</div>
                                                </td>
                                                <td class="p-3">{location.duration} hours</td>
                                            </tr>
                                        {/each}
                                    {/each}
                                </tbody>
                            </table>
                        </div>
                    {:else}
                        <p class="text-gray-400 text-center py-6">No schedule information available.</p>
                    {/if}
                </div>
            </div>
        </main>
    </div>
</div>