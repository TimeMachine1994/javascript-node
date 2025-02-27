<script lang="ts">
    import { masterStore } from '$lib/stores/userStore';
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import type { PageData, Contributor } from './types';
    import type { WPUserData } from '$lib/types/user-metadata';
    
    // Subscribe to the store using derived
    const store = $derived($masterStore);
    const data = $derived($page.data as PageData);
    
    // Form state
    let emails = $state('');
    let customMessage = $state('');
    let selectedRole = $state<Contributor['role']>('contributor');
    let error = $state<string | null>(null);
    let success = $state<string | null>(null);
    let loading = $state(false);
    let contributors = $state<Contributor[]>([]);

    // Get memorial ID from user metadata
    const memorialId = $derived(() => {
        const metaData = (data.userData as WPUserData).metaResult;
        return metaData?.meta_value || '';
    });

    // Email validation
    function isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Parse and validate emails
    function parseEmails(input: string): string[] {
        return input
            .split(',')
            .map((email: string) => email.trim())
            .filter(email => email && isValidEmail(email));
    }

    // Handle invitation submission
    async function handleInvite() {
        const emailList = parseEmails(emails);
        
        if (emailList.length === 0) {
            error = "Please enter at least one valid email address";
            return;
        }

        if (!memorialId) {
            error = "Memorial ID not found";
            return;
        }

        loading = true;
        error = null;
        success = null;

        try {
            const response = await fetch('/api/invite-contributors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.token}`
                },
                body: JSON.stringify({
                    emails: emailList,
                    role: selectedRole,
                    message: customMessage || undefined,
                    memorialId,
                    senderId: data.user_id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send invitations');
            }

            const result = await response.json();
            success = `Successfully sent ${result.invitations.filter((i: { status: string }) => i.status === 'sent').length} invitations`;
            
            // Clear form
            emails = '';
            customMessage = '';
            
            // Refresh contributor list
            await loadContributors();
        } catch (err) {
            error = err instanceof Error ? err.message : 'An error occurred while sending invitations';
        } finally {
            loading = false;
        }
    }

    // Load current contributors
    async function loadContributors() {
        if (!memorialId) return;

        try {
            const response = await fetch(`/api/contributors?memorial_id=${memorialId}`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load contributors');
            }

            const result = await response.json();
            contributors = result.contributors;
        } catch (err) {
            console.error('Failed to load contributors:', err);
        }
    }

    // Load contributors on mount
    $effect(() => {
        loadContributors();
    });
</script>

<div class="container mx-auto px-4 py-8">
    <Card>
        <CardHeader>
            <CardTitle>Invite Contributors</CardTitle>
            <CardDescription>
                Invite people to contribute media and memories to the memorial service.
                Enter multiple email addresses separated by commas.
            </CardDescription>
        </CardHeader>

        <CardContent>
            <div class="space-y-6">
                <div class="space-y-2">
                    <Label for="emails">Email Addresses</Label>
                    <Input
                        type="text"
                        id="emails"
                        placeholder="Enter email addresses (comma-separated)"
                        bind:value={emails}
                    />
                    <p class="text-sm text-gray-500">
                        Example: john@example.com, jane@example.com
                    </p>
                </div>

                <div class="space-y-2">
                    <Label for="role">Role</Label>
                    <select
                        id="role"
                        class="w-full p-2 border rounded-md"
                        bind:value={selectedRole}
                    >
                        <option value="contributor">Contributor</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <Label for="message">Custom Message (Optional)</Label>
                    <textarea
                        id="message"
                        class="w-full p-2 border rounded-md min-h-[100px]"
                        placeholder="Add a personal message to the invitation"
                        bind:value={customMessage}
                    ></textarea>
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

                <!-- Current contributors -->
                {#if contributors.length > 0}
                    <div class="mt-6">
                        <h3 class="text-lg font-semibold mb-2">Current Contributors</h3>
                        <div class="bg-gray-50 rounded-lg p-4">
                            <ul class="space-y-2">
                                {#each contributors as contributor}
                                    <li class="flex justify-between items-center">
                                        <span>{contributor.email}</span>
                                        <span class="text-sm px-2 py-1 rounded-full {
                                            contributor.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            contributor.status === 'declined' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }">
                                            {contributor.status}
                                        </span>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/if}
            </div>
        </CardContent>

        <CardFooter class="flex justify-between">
            <Button
                variant="outline"
                on:click={() => goto('/booking-calculator')}
            >
                Back
            </Button>
            <Button
                on:click={handleInvite}
                disabled={loading || !emails.trim()}
            >
                {loading ? 'Sending Invitations...' : 'Send Invitations'}
            </Button>
        </CardFooter>
    </Card>
</div>