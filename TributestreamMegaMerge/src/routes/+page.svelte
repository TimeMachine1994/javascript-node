<script>
    import { goto } from '$app/navigation';

    async function handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Redirect to login page after successful logout
                await goto('/login');
            } else {
                console.error('Logout failed:', await response.json());
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
</script>

<div class="min-h-screen bg-background flex flex-col items-center justify-center p-4">
    <h1 class="text-4xl font-bold mb-8 text-foreground">Welcome to TributeStream</h1>
    
    <div class="flex flex-col items-center gap-4">
        <p class="text-muted-foreground">
            Manage your tributes and memories
        </p>
        
        <button
            on:click={handleLogout}
            class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
        >
            Logout
        </button>
    </div>
</div>
