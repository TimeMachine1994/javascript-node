<script lang="ts">
    import type { PageData } from './$types';
    import type { UserMetadataPageData } from '$lib/types/user-metadata';
    import UserInfoPanel from '$lib/components/user/UserInfoPanel.svelte';
    import MemorialDetailsPanel from '$lib/components/memorial/MemorialDetailsPanel.svelte';
    import PricingPanel from '$lib/components/pricing/PricingPanel.svelte';

    const { data } = $props<{ data: PageData }>();

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
</script>

<div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Memorial Service Details</h1>
    
    <div class="grid gap-8 md:grid-cols-2">
        <!-- Left Column -->
        <div class="space-y-8">
            <UserInfoPanel data={pageData.personalInfo} />
            <PricingPanel data={pageData.pricing} />
        </div>
        
        <!-- Right Column -->
        <div>
            <MemorialDetailsPanel data={pageData.memorialDetails} />
        </div>
    </div>
</div>

<style>
    /* Add any component-specific styles here */
</style>