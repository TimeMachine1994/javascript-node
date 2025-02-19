<script lang="ts">
    import type { PageData } from './$types';
    
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

<div class="p-8">
    <h1 class="text-3xl font-bold mb-8">Scheduled Livestreams</h1>

    {#if calculatorEntries.length === 0}
        <p class="text-gray-600">No scheduled livestreams found.</p>
    {:else}
        <div class="grid gap-6">
            {#each calculatorEntries as entry}
                <div class="bg-white shadow-lg rounded-lg p-6">
                    <div class="grid grid-cols-2 gap-6">
                        <!-- Package and Cost -->
                        <div>
                            <h2 class="text-xl font-bold mb-4">{entry.selectedPackage} Package</h2>
                            <p class="text-lg text-gray-700">Total Cost: ${entry.total}</p>
                            <p class="text-gray-600">Duration: {entry.duration} hours</p>
                        </div>

                        <!-- Date and Time -->
                        <div>
                            <h3 class="font-bold mb-2">Schedule</h3>
                            <p>Date: {entry.livestreamDate}</p>
                            <p>Time: {entry.livestreamStartTime}</p>
                        </div>

                        <!-- Locations -->
                        <div class="col-span-2">
                            <h3 class="font-bold mb-2">Locations</h3>
                            <div class="grid gap-4">
                                {#each entry.locations as location}
                                    <div class="bg-gray-50 p-4 rounded">
                                        <p class="font-semibold">{location.name}</p>
                                        <p class="text-gray-600">{location.address}</p>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <!-- Memorial Information -->
                        {#if entry.memorialData}
                            <div class="col-span-2 mt-4">
                                <h3 class="font-bold mb-2">Memorial Information</h3>
                                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                                    <!-- Deceased Information -->
                                    <div>
                                        <p class="font-semibold">Deceased</p>
                                        <p>{entry.memorialData.deceased.firstName} {entry.memorialData.deceased.lastName}</p>
                                        <p class="text-gray-600">DOB: {entry.memorialData.deceased.dob}</p>
                                        <p class="text-gray-600">Date of Passing: {entry.memorialData.deceased.dop}</p>
                                    </div>

                                    <!-- Contact Information -->
                                    <div>
                                        <p class="font-semibold">Contact</p>
                                        <p>{entry.memorialData.contact.email}</p>
                                        <p>{entry.memorialData.contact.phone}</p>
                                    </div>
                                </div>
                            </div>
                        {/if}

                        <!-- Cart Items -->
                        <div class="col-span-2 mt-4">
                            <h3 class="font-bold mb-2">Services</h3>
                            <div class="bg-gray-50 p-4 rounded">
                                {#each entry.cartItems as item}
                                    <div class="flex justify-between py-1">
                                        <span>{item.name}</span>
                                        <span>${item.price}</span>
                                    </div>
                                {/each}
                                <div class="flex justify-between font-bold pt-2 border-t mt-2">
                                    <span>Total</span>
                                    <span>${entry.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>