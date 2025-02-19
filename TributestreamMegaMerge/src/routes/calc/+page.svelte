<script lang="ts">
  import Calculator from '$lib/Calc.svelte';
  import type { PageData } from './$types';
  
  export let data: PageData;
</script>

<Calculator initialMemorialData={data.memorialData} />
