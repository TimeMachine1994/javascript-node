<script lang="ts">
  import type {
    MemorialFormData,
    Package,
    Location,
    CartItem,
    ScheduleDay as ScheduleDayType,
    WPUserData,
    UserMetadata
  } from '$lib/types/user-metadata';
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '$lib/components/ui/card';
  
  import PackageSelector from './PackageSelector.svelte';
  import ScheduleDay from './ScheduleDay.svelte';
  import CartSummary from './CartSummary.svelte';

  interface OrderData {
    personalDetails: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    package: {
      name: string;
      scheduleDays: ScheduleDayType[];
    };
    orderDetails: {
      pricing: {
        items: CartItem[];
        subtotal: number;
        total: number;
      };
      package: {
        name: string;
        scheduleDays: ScheduleDayType[];
      };
    };
  }

  // Props
  let {
    data,
    initialPackage = "Solo",
    onSave,
    onCheckout
  } = $props<{
    data: {
      userData: UserMetadata[];
      wpUserData: WPUserData;
    };
    initialPackage?: string;
    onSave?: (data: OrderData) => void;
    onCheckout?: (data: OrderData) => void;
  }>();

  // Constants
  const PACKAGES: Package[] = [
    {
      id: "solo",
      name: "Tributestream Solo",
      description: "Basic memorial package",
      basePrice: 550,
      features: []
    },
    {
      id: "gold",
      name: "Tributestream Gold",
      description: "Enhanced memorial package",
      basePrice: 1100,
      features: []
    },
    {
      id: "legacy",
      name: "Tributestream Legacy",
      description: "Premium memorial package",
      basePrice: 2799,
      features: []
    }
  ];

  const DEFAULT_LOCATION: Location = {
    name: "",
    address: "",
    travelExceedsHour: false,
    startTime: "09:00",
    duration: 2,
    notes: ""
  };

  const DEFAULT_SCHEDULE_DAY: ScheduleDayType = {
    date: new Date().toISOString().split('T')[0],
    locations: [{ ...DEFAULT_LOCATION }]
  };

  // Helper functions
  function parseLocationName(location: string): string {
    return location?.split('-')[0]?.trim() ?? "";
  }

  function parseLocationAddress(location: string): string {
    return location?.split('-')[1]?.trim() ?? "";
  }

  function parseFullName(name: string | undefined): { firstName: string, lastName: string } {
    if (!name) return { firstName: "", lastName: "" };
    const parts = name.split(' ');
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(' ') || ""
    };
  }

  // Initialize state
  let memorialFormData = $state(data.userData[0]?.memorial_form_data);
  let selectedPackage = $state(data.userData[0]?.calculator_data?.selectedPackage || initialPackage);
  let personalDetails = $state({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  let scheduleDays = $state<ScheduleDayType[]>(
    data.userData[0]?.calculator_data?.scheduleDays?.length > 0
      ? data.userData[0].calculator_data.scheduleDays
      : [{ ...DEFAULT_SCHEDULE_DAY }]
  );
  let cartItems = $state<CartItem[]>([]);
  let cartTotal = $state(0);
  let userId = $state(data.wpUserData.metaResult.user_id);
  let isSaving = $state(false);
  let isCheckingOut = $state(false);

  // Effects
  $effect(() => {
    const name = parseFullName(memorialFormData?.familyMember?.name);
    personalDetails = {
      firstName: name.firstName,
      lastName: name.lastName,
      email: memorialFormData?.contact?.email ?? "",
      phone: memorialFormData?.contact?.phone ?? ""
    };
  });

  $effect(() => {
    const items: CartItem[] = [];
    let total = 0;

    // Add package price
    const packageItem = PACKAGES.find(p => p.name.includes(selectedPackage));
    if (packageItem) {
      items.push({
        name: packageItem.name,
        price: packageItem.basePrice
      });
      total += packageItem.basePrice;
    }

    // Calculate costs for all days and locations
    scheduleDays.forEach((day, dayIndex) => {
      // Additional locations beyond the first one cost extra
      day.locations.slice(1).forEach((location, locationIndex) => {
        items.push({
          name: `Additional Location (Day ${dayIndex + 1}, Location ${locationIndex + 2}) - ${location.name}`,
          price: 349
        });
        total += 349;
      });

      // Calculate extra hours for each location
      day.locations.forEach((location, locationIndex) => {
        const extraHours = Math.max(0, location.duration - 2);
        if (extraHours > 0) {
          items.push({
            name: `Extra Duration (Day ${dayIndex + 1}, Location ${locationIndex + 1}) - ${extraHours} additional hours at ${location.name}`,
            price: extraHours * 125
          });
          total += extraHours * 125;
        }
      });
    });

    cartItems = items;
    cartTotal = total;
  });

  // Event handlers
  function handlePackageSelect(packageName: string) {
    selectedPackage = packageName;
  }

  function addDay() {
    scheduleDays = [...scheduleDays, { ...DEFAULT_SCHEDULE_DAY }];
  }

  function removeDay(dayIndex: number) {
    scheduleDays = scheduleDays.filter((_, i) => i !== dayIndex);
  }

  function addLocation(dayIndex: number) {
    if (scheduleDays[dayIndex].locations.length < 3) {
      scheduleDays = scheduleDays.map((day, i) => 
        i === dayIndex 
          ? { ...day, locations: [...day.locations, { ...DEFAULT_LOCATION }] }
          : day
      );
    }
  }

  function removeLocation(dayIndex: number, locationIndex: number) {
    scheduleDays = scheduleDays.map((day, i) => 
      i === dayIndex 
        ? { ...day, locations: day.locations.filter((_, j) => j !== locationIndex) }
        : day
    );
  }

  async function saveCalculatorData() {
    try {
      isSaving = true;
      
      if (!userId) {
        throw new Error('User ID not available');
      }

      const calculatorData = {
        meta: {
          status: 'draft',
          lastUpdated: new Date().toISOString(),
          version: '2.0.0'
        },
        scheduleDays,
        selectedPackage,
        cart: {
          items: cartItems,
          subtotal: cartTotal,
          total: cartTotal,
          discounts: [],
          taxes: []
        },
        personalDetails
      };

      const response = await fetch('/api/user-meta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          meta_key: 'calculator_data',
          meta_value: JSON.stringify(calculatorData)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save calculator data');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving calculator data:', error);
      throw error;
    } finally {
      isSaving = false;
    }
  }

  async function transformToOrderData(): Promise<OrderData> {
    const orderData = {
      personalDetails,
      package: {
        name: selectedPackage,
        scheduleDays
      },
      orderDetails: {
        pricing: {
          items: cartItems,
          subtotal: cartTotal,
          total: cartTotal
        },
        package: {
          name: selectedPackage,
          scheduleDays
        }
      }
    };

    await goto('/checkout', {
      replaceState: true,
      state: { orderData }
    });

    return orderData;
  }

  async function handleSave() {
    try {
      await saveCalculatorData();
      const orderData = await transformToOrderData();
      await onSave?.(orderData);
    } catch (error) {
      console.error('Error during save:', error);
    }
  }

  async function handleCheckout() {
    try {
      isCheckingOut = true;
      await saveCalculatorData();
      const orderData = await transformToOrderData();
      await onCheckout?.(orderData);
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      isCheckingOut = false;
    }
  }
</script>

<div class="memorial-calculator space-y-8">
  <section>
    <h2 class="text-2xl font-semibold mb-4">Select Package</h2>
    <PackageSelector
      packages={PACKAGES}
      {selectedPackage}
      onSelect={handlePackageSelect}
    />
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-4">Schedule</h2>
    <div class="schedule-days space-y-4">
      {#each scheduleDays as day, dayIndex}
        <ScheduleDay
          {day}
          {dayIndex}
          onRemove={removeDay}
          onAddLocation={addLocation}
          onRemoveLocation={removeLocation}
        />
      {/each}

      <Button 
        variant="outline"
        onclick={addDay}
        class="w-full py-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add Another Day
      </Button>
    </div>
  </section>

  <section>
    <h2 class="text-2xl font-semibold mb-4">Order Summary</h2>
    <CartSummary items={cartItems} total={cartTotal} />
  </section>

  <section>
    <div class="flex gap-4">
      <Button
        variant="outline"
        class="flex-1"
        disabled={isSaving}
        onclick={handleSave}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      <Button
        variant="default"
        class="flex-1"
        disabled={isCheckingOut}
        onclick={handleCheckout}
      >
        {isCheckingOut ? 'Processing...' : 'Checkout'}
      </Button>
    </div>
  </section>
</div>