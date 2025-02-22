<script lang="ts">
import { useAuth } from '$lib/hooks/useAuth';

const { login } = useAuth();
let username = $state('');
let password = $state('');
let error = $state('');

async function handleSubmit() {
  error = '';
  const success = await login(username, password);
  if (success) {
    // Redirect to home page after successful login
    window.location.href = '/';
  }
}
</script>

<div class="min-h-screen bg-background flex items-center justify-center">
  <div class="w-full max-w-md p-8 bg-card rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-center mb-6">Login to TributeStream</h1>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-foreground mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-foreground mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {#if error}
        <div class="text-destructive text-sm">{error}</div>
      {/if}

      <button
        type="submit"
        class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
      >
        Login
      </button>
    </form>

    <div class="mt-4 text-center">
      <a href="/register" class="text-sm text-muted-foreground hover:text-primary">
        Don't have an account? Sign up
      </a>
    </div>
  </div>
</div>