<script lang="ts">
    import type { UserMetadataPageData } from '$lib/types/user-metadata';

    const { data } = $props<{ data: UserMetadataPageData['memorialDetails'] }>();

    // Format date for display
    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Format time for display
    function formatTime(time: string): string {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }
</script>

<div class="rounded-lg border bg-white p-6 shadow-sm">
    <h3 class="text-2xl font-semibold mb-4">Memorial Details</h3>
    
    <!-- Deceased Information -->
    <div class="mb-6">
        <h4 class="text-lg font-medium mb-3">Deceased Information</h4>
        <div class="space-y-2">
            <p class="text-base">
                <span class="font-medium">Name:</span> {data.deceased.name}
            </p>
            <p class="text-base">
                <span class="font-medium">Date of Birth:</span> {formatDate(data.deceased.dob)}
            </p>
            <p class="text-base">
                <span class="font-medium">Date of Passing:</span> {formatDate(data.deceased.dateOfPassing)}
            </p>
        </div>
    </div>

    <!-- Schedule Information -->
    <div class="mb-6">
        <h4 class="text-lg font-medium mb-3">Schedule</h4>
        <div class="space-y-4">
            {#each data.schedule as day, index}
                <div class="border-l-4 border-gray-200 pl-4">
                    <h5 class="font-medium">Day {index + 1} - {formatDate(day.date)}</h5>
                    <div class="mt-2 space-y-3">
                        {#each day.locations as location, locIndex}
                            <div class="bg-gray-50 p-3 rounded">
                                <p class="font-medium">{location.name}</p>
                                <p class="text-sm text-gray-600">{location.address}</p>
                                <p class="text-sm">
                                    Time: {formatTime(location.startTime)} 
                                    ({location.duration} {location.duration === 1 ? 'hour' : 'hours'})
                                </p>
                                {#if location.notes}
                                    <p class="text-sm text-gray-600 mt-1">Notes: {location.notes}</p>
                                {/if}
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Package Information -->
    <div>
        <h4 class="text-lg font-medium mb-2">Selected Package</h4>
        <p class="text-base">{data.package}</p>
    </div>
</div>