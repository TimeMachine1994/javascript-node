<script lang="ts">
// Types
export interface MemorialFormData {
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

interface Package {
    name: string;
    price: number;
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

interface OrderData {
    cartItems: CartItem[];
    total: number;
    duration: number;
    livestreamDate: string;
    livestreamStartTime: string;
    locations: Location[];
    selectedPackage: string;
    funeralHomeName: string;
    funeralDirectorName: string;
    memorialData?: MemorialFormData;
}

// Props definition using runes
let {
    initialStartTime = '',
    onSave,
    onCheckout,
    initialMemorialData
} = $props<{
    initialStartTime?: string,
    onSave?: (data: OrderData) => void,
    onCheckout?: (data: OrderData) => void,
    initialMemorialData?: MemorialFormData
}>();

// Mock packages data (replace with actual import when available)
const packages: Package[] = [
    { name: 'Tributestream Solo', price: 550 },
    { name: 'Tributestream Gold', price: 1100 },
    { name: 'Tributestream Legacy', price: 2799 }
];

// // State variables using runes
let memorialFormData = $state<MemorialFormData | undefined>(initialMemorialData);
// let selectedPackage = $state('Solo');
// let livestreamDate = $state(initialMemorialData?.memorial.date ?? '');
// let livestreamStartTime = $state(initialMemorialData?.memorial.time ?? initialStartTime);
// let duration = $state(2);
// let locations = $state<Location[]>(
//     initialMemorialData ? [{
//         name: initialMemorialData.memorial.locationName,
//         address: initialMemorialData.memorial.locationAddress,
//         travelExceedsHour: false
//     }] : [{ name: '', address: '', travelExceedsHour: false }]
// );
// let funeralHomeName = $state(initialMemorialData?.memorial.locationName ?? '');
// let funeralDirectorName = $state(
//     initialMemorialData
//         ? `${initialMemorialData.director.firstName} ${initialMemorialData.director.lastName}`
//         : ''
// );

// Update memorial data if it changes
$effect(() => {
    if (initialMemorialData && initialMemorialData !== memorialFormData) {
        memorialFormData = initialMemorialData;
        livestreamDate = initialMemorialData.memorial.date;
        livestreamStartTime = initialMemorialData.memorial.time;
        funeralDirectorName = `${initialMemorialData.director.firstName} ${initialMemorialData.director.lastName}`;
        funeralHomeName = initialMemorialData.memorial.locationName;
        livestreamDate = initialMemorialData.memorial.date;
        livestreamStartTime = initialMemorialData.memorial.time;
        locations = [{
            name: initialMemorialData.memorial.locationName,
            address: initialMemorialData.memorial.locationAddress,
            travelExceedsHour: false
        }];
    }
});

// Individual state variables using runes
let selectedPackage = $state('Solo');
let livestreamDate = $state('');
let livestreamStartTime = $state(initialStartTime);
let duration = $state(2);
let locations = $state<Location[]>([
    { name: '', address: '', travelExceedsHour: false }
]);
let funeralHomeName = $state('');
let funeralDirectorName = $state('');

// Derived values using runes
let locationNumDefault = $derived(
    selectedPackage === 'Solo' || selectedPackage === 'Legacy' ? 1 : 2
);

interface CartCalculation {
    items: CartItem[];
    total: number;
}

// Calculate cart items and total
let cartCalculation = $derived(() => {
    const items: CartItem[] = [];
    let total = 0;

    // Get package price from packages data
    const pkg = packages.find(p => p.name.includes(selectedPackage));
    if (pkg) {
        items.push({ name: pkg.name, price: pkg.price });
        total += pkg.price;
    }

    // Calculate extra hours cost
    const extraHours = duration > 2 ? duration - 2 : 0;
    if (extraHours) {
        items.push({ 
            name: `Extra Duration (${extraHours} hour(s))`, 
            price: extraHours * 125 
        });
        total += extraHours * 125;
    }

    // Calculate additional locations cost
    locations.forEach((_, index) => {
        if (index > 0) {
            items.push({ 
                name: `Additional Location #${index + 1}`, 
                price: 349 
            });
            total += 349;
        }
    });

    return { items, total };
});

// Location management functions
function addLocation(): void {
    locations = [
        ...locations, 
        { name: '', address: '', travelExceedsHour: false }
    ];
}

function removeLocation(index: number): void {
    locations = locations.filter((_, i) => i !== index);
}

// Save and checkout handlers
function handleSave(): void {
    const calc = cartCalculation();
    const orderData: OrderData = {
        cartItems: calc.items,
        total: calc.total,
        duration,
        livestreamDate,
        livestreamStartTime,
        locations,
        selectedPackage,
        funeralHomeName,
        funeralDirectorName,
        memorialData: memorialFormData
    };
    onSave?.(orderData);
}

function handleCheckout(): void {
    const calc = cartCalculation();
    const orderData: OrderData = {
        cartItems: calc.items,
        total: calc.total,
        duration,
        livestreamDate,
        livestreamStartTime,
        locations,
        selectedPackage,
        funeralHomeName,
        funeralDirectorName,
        memorialData: memorialFormData
    };
    onCheckout?.(orderData);
}
</script>

<style>
.calc-container {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease;
}

.calc-container.open {
    max-height: 2000px;
}

.calc-content {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.calc-container.open .calc-content {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}
</style>

<div class="calc-container open">
    <div class="calc-content grid grid-cols-4 gap-6 p-6 max-w-6xl mx-auto">
        <!-- Title Area -->
        <div class="col-span-4 p-4 bg-gray-100 shadow-lg rounded-lg text-center">
            <h1 class="text-2xl font-bold">Schedule and Calculate Your Livestream</h1>
        </div>

        <!-- Form Section -->
        <div class="col-span-3 p-4 bg-white shadow-lg rounded-lg">
            <form on:submit|preventDefault>
                <h2 class="text-lg font-bold mb-4">Schedule a Livestream</h2>

                <!-- Package, Date and Time -->
                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <label class="block mb-2">Package</label>
                        <select 
                            bind:value={selectedPackage} 
                            class="block w-full p-2 border rounded"
                        >
                            <option value="Solo">Solo ($550)</option>
                            <option value="Gold">Gold ($1,100)</option>
                            <option value="Legacy">Legacy ($2,799)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-2">Livestream Date</label>
                        <input 
                            type="date" 
                            bind:value={livestreamDate} 
                            class="block w-full p-2 border rounded" 
                        />
                    </div>
                    <div>
                        <label class="block mb-2">Start Time</label>
                        <input 
                            type="time" 
                            bind:value={livestreamStartTime} 
                            class="block w-full p-2 border rounded" 
                        />
                    </div>
                </div>

                <!-- Duration Slider -->
                <div class="mt-4">
                    <label class="block mb-2">Duration (hours)</label>
                    <input
                        type="range"
                        bind:value={duration}
                        min="2"
                        max="8"
                        step="1"
                        class="block w-full"
                    />
                    <p class="text-sm text-gray-600 mt-2">
                        Selected Duration: {duration} hours
                    </p>
                </div>

                <!-- Funeral Home and Director -->
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label class="block mb-2">Funeral Home Name</label>
                        <input 
                            type="text" 
                            bind:value={funeralHomeName} 
                            class="block w-full p-2 border rounded" 
                        />
                    </div>
                    <div>
                        <label class="block mb-2">Funeral Director Name</label>
                        <input 
                            type="text" 
                            bind:value={funeralDirectorName} 
                            class="block w-full p-2 border rounded" 
                        />
                    </div>
                </div>

                <!-- Locations -->
                <div class="mt-4">
                    <h3 class="font-bold">Locations</h3>
                    {#each locations as loc, index}
                        <div class="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label class="block">Location Name</label>
                                <input
                                    type="text"
                                    bind:value={loc.name}
                                    placeholder={`Location #${index + 1} Name`}
                                    class="block w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label class="block">Location Address</label>
                                <input
                                    type="text"
                                    bind:value={loc.address}
                                    placeholder={`Location #${index + 1} Address`}
                                    class="block w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                        {#if index >= locationNumDefault}
                            <button
                                type="button"
                                on:click={() => removeLocation(index)}
                                class="mt-2 text-red-500"
                            >
                                Remove Location
                            </button>
                        {/if}
                    {/each}
                    <button 
                        type="button" 
                        on:click={addLocation} 
                        class="mt-4 text-blue-500"
                    >
                        Add Location
                    </button>
                </div>
            </form>
        </div>

        <!-- Cart Section -->
        <div class="col-span-1 p-4 bg-gray-100 shadow-lg rounded-lg">
            <h2 class="text-lg font-bold mb-4">Cart</h2>
            <ul>
                {#each cartCalculation().items as item}
                    <li class="flex justify-between border-b py-2">
                        <span>{item.name}</span>
                        <span>${item.price}</span>
                    </li>
                {/each}
            </ul>
            <div class="flex justify-between font-bold mt-4">
                <span>Total</span>
                <span>${cartCalculation().total}</span>
            </div>

            <!-- Save and Pay Buttons -->
            <div class="mt-6 flex flex-col gap-4">
                <button
                    type="button"
                    class="w-full bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                    on:click={handleSave}
                >
                    Save and Pay Later
                </button>
                <button
                    type="button"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    on:click={handleCheckout}
                >
                    Save and Checkout Now
                </button>
            </div>
        </div>
    </div>

    <!-- Memorial Data Display -->
    {#if memorialFormData}
        <div class="mt-8 p-6 bg-gray-100 rounded-lg max-w-6xl mx-auto">
            <h2 class="text-xl font-bold mb-4">Memorial Information</h2>
            <div class="grid grid-cols-2 gap-6">
                <!-- Director Information -->
                <div>
                    <h3 class="font-bold mb-2">Funeral Director</h3>
                    <p>Name: {memorialFormData.director.firstName} {memorialFormData.director.lastName}</p>
                </div>

                <!-- Family Member Information -->
                <div>
                    <h3 class="font-bold mb-2">Family Member</h3>
                    <p>Name: {memorialFormData.familyMember.firstName} {memorialFormData.familyMember.lastName}</p>
                    <p>Date of Birth: {memorialFormData.familyMember.dob}</p>
                </div>

                <!-- Deceased Information -->
                <div>
                    <h3 class="font-bold mb-2">Deceased</h3>
                    <p>Name: {memorialFormData.deceased.firstName} {memorialFormData.deceased.lastName}</p>
                    <p>Date of Birth: {memorialFormData.deceased.dob}</p>
                    <p>Date of Passing: {memorialFormData.deceased.dop}</p>
                </div>

                <!-- Contact Information -->
                <div>
                    <h3 class="font-bold mb-2">Contact Information</h3>
                    <p>Email: {memorialFormData.contact.email}</p>
                    <p>Phone: {memorialFormData.contact.phone}</p>
                </div>

                <!-- Memorial Information -->
                <div class="col-span-2">
                    <h3 class="font-bold mb-2">Memorial Details</h3>
                    <p>Location: {memorialFormData.memorial.locationName}</p>
                    <p>Address: {memorialFormData.memorial.locationAddress}</p>
                    <p>Date: {memorialFormData.memorial.date}</p>
                    <p>Time: {memorialFormData.memorial.time}</p>
                </div>
            </div>
        </div>
    {/if}
</div>
