<script lang="ts">
  import { page } from '$app/stores';
  import BookingCalculator from '$lib/components/calculator/BookingCalculator.svelte';
  
  // Get parameters from URL
  const tributeId = $page.url.searchParams.get('tributeId') || '';
  const slug = $page.url.searchParams.get('slug') || '';
  const source = $page.url.searchParams.get('source') || '';
</script>

<svelte:head>
  <title>Memorial Service Booking | Tributestream</title>
  <meta name="description" content="Schedule and select options for your memorial service" />
</svelte:head>

<BookingCalculator {tributeId} {slug} {source} />
