<script lang="ts">
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import type { PageData } from '../schedule copy/$types';
    
    interface MetaEntry {
        meta_key: string;
        meta_value: string;
        user_id: string;
    }

    interface CartItem {
        name: string;
        price: number;
    }

    interface Location {
        name: string;
        address: string;
        travelExceedsHour: boolean;
    }

    interface MemorialData {
        director: {
            firstName: string;
            lastName: string;
        };
        familyMember: {
            firstName: string;
            lastName: string;
            dob: string;
        };
        deceased: {
            firstName: string;
            lastName: string;
            dob: string;
            dop: string;
        };
        contact: {
            email: string;
            phone: string;
        };
        memorial: {
            locationName: string;
            locationAddress: string;
            time: string;
            date: string;
        };
    }

    interface CalculatorEntry {
        cartItems: CartItem[];
        total: number;
        duration: number;
        livestreamDate: string;
        livestreamStartTime: string;
        locations: Location[];
        selectedPackage: string;
        funeralHomeName: string;
        funeralDirectorName: string;
        memorialData?: MemorialData;
    }
    
    let { data } = $props<{ data: PageData }>();
    let rawMetaData = $state<MetaEntry[]>([]);
    let fdFormData = data.userMeta?.memorial_form_data;
    
    // Parse and flatten the JSON string
    let flattenedFormData: any = {};
    if (fdFormData) {
        try {
            const parsedData = JSON.parse(fdFormData);

            // Flattening logic
            flattenedFormData = {
                directorFirstName: parsedData.director.firstName,
                directorLastName: parsedData.director.lastName,
                familyMemberFirstName: parsedData.familyMember.firstName,
                familyMemberLastName: parsedData.familyMember.lastName,
                familyMemberDob: parsedData.familyMember.dob,
                deceasedFirstName: parsedData.deceased.firstName,
                deceasedLastName: parsedData.deceased.lastName,
                deceasedDob: parsedData.deceased.dob,
                deceasedDop: parsedData.deceased.dop,
                contactEmail: parsedData.contact.email,
                contactPhone: parsedData.contact.phone,
                memorialLocationName: parsedData.memorial.locationName,
                memorialLocationAddress: parsedData.memorial.locationAddress,
                memorialTime: parsedData.memorial.time,
                memorialDate: parsedData.memorial.date
            };

            console.log('Flattened Form Data:', flattenedFormData);
        } catch (error) {
            console.error('Failed to parse and flatten JSON data:', error);
        }
    }
    
    $effect(() => {
        console.log('Server data received:', data.scheduleData);
        rawMetaData = data.scheduleData?.meta || [];
        console.log('Raw meta data updated:', rawMetaData);
    });

    let calculatorEntries = $derived(
        rawMetaData
            .filter((entry: MetaEntry) => entry.meta_key === 'calculator_data')
            .map((entry: MetaEntry) => {
                try {
                    const parsed = JSON.parse(entry.meta_value);
                    console.log('Parsed calculator entry:', parsed);
                    return parsed as CalculatorEntry;
                } catch (e) {
                    console.error('Failed to parse calculator data:', e);
                    return null;
                }
            })
            .filter((entry: CalculatorEntry | null): entry is CalculatorEntry => entry !== null)
    );

    $effect(() => {
        console.log('Final calculator entries:', calculatorEntries);
    });
</script>

<div class="max-w-4xl mx-auto space-y-6">
    {#each calculatorEntries as entry}
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
                <div class="md:flex-1 space-y-2 mb-4 md:mb-0">
                    <!-- Title of the Event -->
                    <h2 class="text-2xl font-bold text-gray-700">
                        Celebration of life for {entry.memorialData?.deceased.firstName} {entry.memorialData?.deceased.lastName}
                    </h2>

                    <!-- Starting Location -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-600">Starting Location</h3>
                        <p class="text-gray-800">{entry.locations[0]?.name || 'Location TBD'}</p>
                        <p class="text-gray-800">{entry.locations[0]?.address || ''}</p>
                    </div>

                    <!-- Start Time -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-600">Start Time</h3>
                        <p class="text-gray-800">{entry.livestreamDate} @ {entry.livestreamStartTime}</p>
                    </div>

                    <!-- Notes -->
                    <div>
                        <h3 class="text-sm font-semibold text-gray-600">Notes</h3>
                        <p class="text-gray-800">Duration: {entry.duration} hours</p>
                    </div>
                </div>
                
                <!-- Media Placeholder -->
                <div class="md:w-1/2 h-48 bg-black rounded flex items-center justify-center text-white">
                    <span class="text-sm">Media Placeholder</span>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <button
                class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/upload_media')}
            >
                Upload Media for Livestream
            </button>
            <button
                class="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/calc')}
            >
                Edit Livestream Schedule
            </button>
            <button
                class="flex-1 bg-pink-100 hover:bg-pink-200 text-pink-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/poctransfer')}
            >
                Transfer Family Point of Contact
            </button>
            <button
                class="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 py-2 px-4 rounded shadow text-center font-semibold transform hover:scale-105 transition-all duration-200"
                on:click={() => goto('/schedule/media_invite')}
            >
                Invite Others to Share Media
            </button>
        </div>

        <!-- Current Livestream Schedule Section -->
        <div class="bg-white rounded-lg shadow p-6">
            <!-- Header with "Current Livestream Schedule" and "Edit" button -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-gray-700">Current Livestream Schedule</h3>
                <button
                    class="bg-red-100 text-red-800 py-1 px-3 rounded shadow font-semibold"
                    on:click={() => goto('/calc')}
                >
                    Edit
                </button>
            </div>
            
            <!-- Table Headers -->
            <div class="hidden md:grid grid-cols-4 text-gray-600 font-semibold text-sm border-b border-gray-200 pb-2">
                <span>Start Time</span>
                <span>Stream Type</span>
                <span>Est. Duration</span>
                <span>Location</span>
            </div>
            
            <!-- Schedule Entries -->
            {#each entry.locations as location, index}
                <div class="grid grid-cols-1 md:grid-cols-4 items-center text-gray-800 py-3 border-b border-gray-100">
                    <span class="font-semibold">
                        {#if index === 0}
                            {entry.livestreamStartTime}
                        {:else}
                            <!-- Add 1 hour for each subsequent location -->
                            {new Date(new Date(`2000/01/01 ${entry.livestreamStartTime}`).getTime() + (index * 60 * 60 * 1000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        {/if}
                    </span>
                    <span>{location.travelExceedsHour ? 'Travel & Service' : 'Service'}</span>
                    <span>{Math.ceil(entry.duration / entry.locations.length)} Hour</span>
                    <span>{location.name}, {location.address}</span>
                </div>
            {/each}
        </div>
    {:else}
        <p class="text-gray-600">No scheduled livestreams found.</p>
    {/each}
</div>