<script lang="ts">
  import { goto } from '$app/navigation';
  import { Button } from '$lib/components/ui/button';
  
  // Props
  let {
    tributeId = '',
    slug = ''
  } = $props<{
    tributeId?: string;
    slug?: string;
  }>();
  
  // Dashboard cards
  const dashboardCards = [
    {
      id: 'schedule',
      title: 'Change Schedule',
      description: 'Modify the date, time, or location of the service',
      icon: 'calendar',
      active: true,
      action: () => handleChangeSchedule()
    },
    {
      id: 'invite',
      title: 'Invite Contributors',
      description: 'Share access to family members to contribute to the memorial',
      icon: 'users',
      active: false,
      action: () => handleInviteContributors()
    },
    {
      id: 'upload',
      title: 'Upload Media',
      description: 'Add photos and videos to the memorial',
      icon: 'upload',
      active: false,
      action: () => handleUploadMedia()
    },
    {
      id: 'settings',
      title: 'Account Settings',
      description: 'Manage your account preferences and billing information',
      icon: 'settings',
      active: false,
      action: () => handleAccountSettings()
    }
  ];
  
  // Handle card actions
  function handleChangeSchedule() {
    goto(`/booking-calculator?tributeId=${tributeId}&slug=${slug}`);
  }
  
  function handleInviteContributors() {
    // This would be functional in a complete implementation
    // For now, we'll show a placeholder
    goto('/family-dashboard/media_invite');
  }
  
  function handleUploadMedia() {
    // This would be functional in a complete implementation
    // For now, we'll show a placeholder
    goto('/family-dashboard/upload_media');
  }
  
  function handleAccountSettings() {
    // This would be functional in a complete implementation
    // For now, we'll show a placeholder
    goto('/family-dashboard/account_settings');
  }
  
  // Icon components
  const CalendarIcon = () => `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `;
  
  const UsersIcon = () => `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  `;
  
  const UploadIcon = () => `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  `;
  
  const SettingsIcon = () => `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  `;
  
  // Get icon based on card type
  function getIcon(iconType: string) {
    switch (iconType) {
      case 'calendar':
        return CalendarIcon();
      case 'users':
        return UsersIcon();
      case 'upload':
        return UploadIcon();
      case 'settings':
        return SettingsIcon();
      default:
        return '';
    }
  }
</script>

<div class="family-dashboard">
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-3xl font-bold mb-2">Family Dashboard</h1>
      <p class="text-gray-600">
        Manage your loved one's memorial service and tribute page
      </p>
    </div>
    
    <!-- Dashboard Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each dashboardCards as card}
        <div 
          class={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow 
          ${card.active ? 'cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}
          on:click={card.active ? card.action : () => {}}
          on:keydown={(e) => e.key === 'Enter' && card.active && card.action()}
          tabindex={card.active ? 0 : -1}
        >
          <div class="p-6">
            <div class="flex items-start">
              <div class={`rounded-full p-3 ${card.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                {@html getIcon(card.icon)}
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-semibold mb-2">{card.title}</h2>
                <p class="text-gray-600">{card.description}</p>
                
                {#if !card.active}
                  <p class="text-sm text-amber-600 mt-2 italic">Coming soon</p>
                {/if}
                
                {#if card.active}
                  <Button 
                    variant="link"
                    class="mt-2 p-0 text-primary font-medium"
                    on:click={card.action}
                  >
                    {card.id === 'schedule' ? 'Change Schedule →' : 'Manage →'}
                  </Button>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Memorial Information Section -->
    <div class="mt-12 bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Memorial Information</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="text-lg font-medium mb-2">Service Details</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><span class="font-medium">Date:</span> March 15, 2025</p>
            <p class="mb-2"><span class="font-medium">Time:</span> 2:00 PM EST</p>
            <p><span class="font-medium">Location:</span> St. Mary's Chapel, 123 Main St, Anytown, CA</p>
          </div>
        </div>
        
        <div>
          <h3 class="text-lg font-medium mb-2">Tribute Page</h3>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><span class="font-medium">URL:</span> <a href={`/celebration-of-life-for-${slug}`} class="text-primary hover:underline break-all">/celebration-of-life-for-{slug}</a></p>
            <p class="mb-2"><span class="font-medium">Views:</span> 248</p>
            <p><span class="font-medium">Contributors:</span> 3</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>