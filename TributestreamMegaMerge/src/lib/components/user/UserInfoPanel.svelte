<script lang="ts">
    import type { UserMetadataPageData } from '$lib/types/user-metadata';

    const { data } = $props<{ data: UserMetadataPageData['personalInfo'] }>();
</script>

<div class="rounded-lg border bg-white p-6 shadow-sm">
    <h3 class="text-2xl font-semibold mb-4">Personal Information</h3>
    
    <div class="space-y-4">
        <div>
            <h4 class="text-sm font-medium text-gray-500">Name</h4>
            <p class="mt-1 text-base">{data.name}</p>
        </div>
        
        <div>
            <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
            <div class="mt-1 space-y-1">
                <p class="text-base">
                    <span class="font-medium">Email:</span> {data.contact.email}
                </p>
                <p class="text-base">
                    <span class="font-medium">Phone:</span> {data.contact.phone}
                </p>
            </div>
        </div>
    </div>
</div>