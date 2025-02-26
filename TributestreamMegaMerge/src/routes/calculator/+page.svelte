<script lang="ts">
    import Calc from '$lib/Calc.svelte';
    import type { CalculatorData } from '$lib/types/api';
    import { enhance } from '$app/forms';

    // Define the PageData interface
    interface PageData {
        calculatorData: CalculatorData | null;
        funeralHomeData: {
            name?: string;
            address?: string;
            directorName?: string;
        } | null;
        error: string | null;
    }
    
    export let data: PageData;

    // Handle any errors from server load
    $: if (data.error) {
        console.error('Error loading calculator data:', data.error);
    }

    // Initialize calculator with preloaded data if available
    let initialData = {
        packageType: data.calculatorData?.package || 'Solo',
        livestreamDate: data.calculatorData?.livestreamDate || '',
        allowOverrun: data.calculatorData?.allowOverrun || false,
        funeralHomeName: data.funeralHomeData?.name || '',
        funeralDirectorName: data.funeralHomeData?.directorName || '',
        locations: data.calculatorData?.locations || [{ 
            name: data.funeralHomeData?.name || '', 
            address: data.funeralHomeData?.address || '',
            travelExceedsHour: false 
        }],
        duration: data.calculatorData?.duration || 2
    };
</script>

<div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-6 text-foreground">Livestream Calculator</h1>
        
        {#if data.error}
            <div class="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-6" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline"> {data.error}</span>
            </div>
        {/if}

        <form method="POST" action="?/save" use:enhance>
            <Calc 
                packageType={initialData.packageType}
                livestreamDate={initialData.livestreamDate}
                allowOverrun={initialData.allowOverrun}
                funeralHomeName={initialData.funeralHomeName}
                funeralDirectorName={initialData.funeralDirectorName}
                locations={initialData.locations}
                duration={initialData.duration}
                on:save={(event) => {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'calculatorData';
                    hiddenInput.value = JSON.stringify(event.detail);
                    document.querySelector('form')?.appendChild(hiddenInput);
                }}
                on:checkout={(event) => {
                    console.log('Proceeding to checkout with total:', event.detail.total);
                    // Handle checkout - e.g., redirect to payment page
                }}
            />
        </form>
    </div>
</div>