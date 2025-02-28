<script lang="ts">
  import { page } from '$app/stores';
  import FamilyDashboard from '$lib/components/dashboard/FamilyDashboard.svelte';
  
  // Get tribute ID and slug from URL params if available
  const tributeId = $page.url.searchParams.get('tributeId') || '';
  const slug = $page.url.searchParams.get('slug') || 'john-doe';
</script>

<svelte:head>
  <title>Family Dashboard | Tributestream</title>
  <meta name="description" content="Manage your loved one's memorial service and tribute page" />
</svelte:head>

<FamilyDashboard {tributeId} {slug} />