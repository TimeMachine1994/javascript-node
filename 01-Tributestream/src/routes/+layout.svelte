<script lang="ts">
import '../app.css';
const { children } = $props();
</script>

<div class="h-full">
{@render children()}
</div>
