<script lang="ts">
import { useAuth } from '$lib/hooks/useAuth';

const { isAuthenticated } = useAuth();
</script>

<div class="min-h-screen bg-background flex items-center justify-center">
  <div class="w-full max-w-2xl p-8 bg-card rounded-lg shadow-lg text-center">
    <h1 class="text-3xl font-bold text-foreground mb-6">Schedule a Memorial Service</h1>
    
    <p class="text-lg text-muted-foreground mb-8">
      Our scheduling system is being updated to serve you better. Please check back soon or contact us directly for immediate assistance.
    </p>

    <div class="space-y-4">
      {#if !$isAuthenticated}
        <a
          href="/login"
          class="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
        >
          Login to Schedule
        </a>
      {/if}

      <a
        href="/"
        class="block text-muted-foreground hover:text-primary transition"
      >
        Return to Home
      </a>
    </div>
  </div>
</div>