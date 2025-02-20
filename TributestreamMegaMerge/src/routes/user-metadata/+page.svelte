<script lang="ts">
    import type { PageData } from './$types';
    import type { UserMetadataPageData } from '$lib/types/user-metadata';
    import UserInfoPanel from '$lib/components/user/UserInfoPanel.svelte';
    import MemorialDetailsPanel from '$lib/components/memorial/MemorialDetailsPanel.svelte';
    import PricingPanel from '$lib/components/pricing/PricingPanel.svelte';

    const { data } = $props<{ data: PageData }>();

    console.log('Raw incoming data:', data);
    console.log('Memorial form data:', data.userData.memorial_form_data);
    console.log('Calculator data:', data.userData.calculator_data);

    // Transform raw metadata into structured format for components
    let pageData = $state<UserMetadataPageData>({
        personalInfo: {
            name: `${data.userData.memorial_form_data.director.firstName} ${data.userData.memorial_form_data.director.lastName}`,
            contact: data.userData.memorial_form_data.contact
        },
        memorialDetails: {
            deceased: data.userData.memorial_form_data.deceased,
            schedule: data.userData.calculator_data.scheduleDays,
            package: data.userData.calculator_data.selectedPackage
        },
        pricing: {
            items: data.userData.calculator_data.cartItems,
            total: data.userData.calculator_data.cartTotal
        }
    });

    console.log('Transformed personal info:', pageData.personalInfo);
    console.log('Transformed memorial details:', pageData.memorialDetails);
    console.log('Transformed pricing data:', pageData.pricing);

    $effect(() => {
        console.log('Page data updated:', pageData);
    });
</script>

<div class="container mx-auto px-4 py-8">
    {#if import.meta.env.DEV}
        <pre class="debug-info hidden">
            {JSON.stringify(pageData, null, 2)}
        </pre>
    {/if}

    <h1 class="text-3xl font-bold mb-8">Memorial Service Details</h1>
   
    <div class="grid gap-8 md:grid-cols-2">
        <!-- Left Column -->
        <div class="space-y-8">
            {@const userInfoStart = performance.now()}
            <UserInfoPanel data={pageData.personalInfo} />
            {console.log('UserInfoPanel render time:', performance.now() - userInfoStart)}

            {@const pricingStart = performance.now()}
            <PricingPanel data={pageData.pricing} />
            {console.log('PricingPanel render time:', performance.now() - pricingStart)}
        </div>
       
        <!-- Right Column -->
        <div>
            {@const memorialStart = performance.now()}
            <MemorialDetailsPanel data={pageData.memorialDetails} />
            {console.log('MemorialDetailsPanel render time:', performance.now() - memorialStart)}
        </div>
    </div>
</div>

<style>
    .debug-info {
        background: #f5f5f5;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        white-space: pre-wrap;
    }
    
    @media (min-width: 768px) {
        .debug-info.hidden {
            display: none;
        }
    }
</style>
