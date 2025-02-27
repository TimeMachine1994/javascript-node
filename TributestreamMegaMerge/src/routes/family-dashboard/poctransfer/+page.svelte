<script lang="ts">
    import { masterStore } from '$lib/stores/userStore';
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { page } from '$app/stores';
    import type { PageData } from './types';
    
    // Subscribe to the store using derived
    const store = $derived($masterStore);
    const data = $derived($page.data as PageData);
    
    // Form state
    let newPocEmail = $state('');
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);
    let loading = $state(false);

    // Email validation
    function isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Handle POC transfer
    async function handleTransfer() {
        if (!newPocEmail) {
            error = "Please enter an email address";
            return;
        }

        if (!isValidEmail(newPocEmail)) {
            error = "Please enter a valid email address";
            return;
        }

        loading = true;
        error = null;
        success = null;

        try {
            const response = await fetch('/api/transfer-poc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({
                    newPocEmail,
                    currentUserId: data.user_id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to transfer POC');
            }

            success = "POC transfer request sent successfully. The new POC will receive an email with instructions.";
            newPocEmail = '';
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred while transferring POC';
        } finally {
            loading = false;
        }
    }
</script>

<div class="container mx-auto px-4 py-8">
    <Card class="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Transfer Point of Contact</CardTitle>
            <CardDescription>
                Transfer your Point of Contact (POC) responsibilities to another person.
                They will receive an email with instructions to accept the transfer.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <div class="space-y-4">
                {#if data.userData?.email}
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-600">Current POC</p>
                        <p class="font-medium">{data.userData.email}</p>
                    </div>
                {/if}

                <div class="space-y-2">
                    <Label for="newPocEmail">New POC Email Address</Label>
                    <Input
                        type="email"
                        id="newPocEmail"
                        placeholder="Enter email address"
                        bind:value={newPocEmail}
                    />
                </div>

                <!-- Error message -->
                {#if error}
                    <div class="p-4 bg-red-50 text-red-700 rounded-lg">
                        {error}
                    </div>
                {/if}

                <!-- Success message -->
                {#if success}
                    <div class="p-4 bg-green-50 text-green-700 rounded-lg">
                        {success}
                    </div>
                {/if}
            </div>
        </CardContent>

        <CardFooter class="flex justify-between">
            <a href="/family-dashboard" class="inline-block">
                <Button variant="outline">
                    Back
                </Button>
            </a>
            <Button
                on:click={handleTransfer}
                disabled={loading || !newPocEmail}
            >
                {loading ? 'Transferring...' : 'Transfer POC'}
            </Button>
        </CardFooter>
    </Card>
</div>