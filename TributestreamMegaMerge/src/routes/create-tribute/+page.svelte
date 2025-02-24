<!-- src/routes/create-tribute/+page.svelte -->
<script lang="ts">
    import { enhance } from '$app/forms';
    import { cn } from '$lib/utils';
    import type {
        TributeFormData,
        TributeFormErrors,
        RegisterRequest,
        TributeRequest,
        RegisterResponse,
        TributeResponse,
        ApiError
    } from '$lib/types/tribute-form';

    // Form state using Svelte 5 runes
    let currentStep = $state(1);
    let lovedOneName = $state('');
    let userName = $state('');
    let userEmail = $state('');
    let userPhone = $state('');
    let isSubmitting = $state(false);
    let error = $state<string | null>(null);

    // Form validation state
    let errors = $state<TributeFormErrors>({
        lovedOneName: '',
        userName: '',
        userEmail: '',
        userPhone: ''
    });

    // Validate first step
    function validateStep1() {
        errors.lovedOneName = '';
        
        if (!lovedOneName.trim()) {
            errors.lovedOneName = 'Please enter your loved one\'s name';
            return false;
        }
        
        return true;
    }

    // Validate second step
    function validateStep2() {
        errors.userName = '';
        errors.userEmail = '';
        errors.userPhone = '';
        
        let isValid = true;
        
        if (!userName.trim()) {
            errors.userName = 'Please enter your name';
            isValid = false;
        }
        
        if (!userEmail.trim()) {
            errors.userEmail = 'Please enter your email';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
            errors.userEmail = 'Please enter a valid email address';
            isValid = false;
        }
        
        if (!userPhone.trim()) {
            errors.userPhone = 'Please enter your phone number';
            isValid = false;
        } else if (!/^\+?[\d\s-]{10,}$/.test(userPhone)) {
            errors.userPhone = 'Please enter a valid phone number';
            isValid = false;
        }
        
        return isValid;
    }

    // Handle next step
    function handleNext() {
        if (validateStep1()) {
            currentStep = 2;
        }
    }

    // Handle form submission
    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        
        if (!validateStep2()) {
            return;
        }

        isSubmitting = true;
        error = null;

        try {
            // Prepare register request data
            const registerRequest: RegisterRequest = {
                username: userName.toLowerCase().replace(/\s+/g, '_'),
                email: userEmail,
                password: userPhone.replace(/\D/g, '') // Use phone number as initial password
            };

            // Register user
            const registerResponse = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerRequest)
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json() as ApiError;
                throw new Error(errorData.message || 'Failed to register user');
            }

            const registerData = await registerResponse.json() as RegisterResponse;

            // Prepare tribute request data
            const tributeRequest: TributeRequest = {
                loved_one_name: lovedOneName,
                phone_number: userPhone
            };

            // Create tribute
            const tributeResponse = await fetch('/api/tributes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${registerData.token}`
                },
                body: JSON.stringify(tributeRequest)
            });

            if (!tributeResponse.ok) {
                const errorData = await tributeResponse.json() as ApiError;
                throw new Error(errorData.message || 'Failed to create tribute');
            }

            const tributeData = await tributeResponse.json() as TributeResponse;
            
            // Redirect to success page or tribute page
            window.location.href = `/tributes/${tributeData.id}`;
        } catch (e) {
            error = e instanceof Error ? e.message : 'An unexpected error occurred';
            console.error('Form submission error:', e);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="max-w-md mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6 text-center">
        {currentStep === 1 ? 'Create a Tribute' : 'Your Information'}
    </h1>

    {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
        </div>
    {/if}

    <form on:submit={handleSubmit} class="space-y-6">
        {#if currentStep === 1}
            <!-- Step 1: Loved One's Name -->
            <div class="space-y-2">
                <label for="lovedOneName" class="block text-sm font-medium text-gray-700">
                    Your Loved One's Name
                </label>
                <input
                    type="text"
                    id="lovedOneName"
                    bind:value={lovedOneName}
                    class={cn(
                        "w-full px-3 py-2 border rounded-md",
                        errors.lovedOneName ? "border-red-500" : "border-gray-300"
                    )}
                    placeholder="Enter their name"
                />
                {#if errors.lovedOneName}
                    <p class="text-red-500 text-sm">{errors.lovedOneName}</p>
                {/if}
            </div>

            <button
                type="button"
                on:click={handleNext}
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
                Next
            </button>
        {:else}
            <!-- Step 2: User Information -->
            <div class="space-y-4">
                <div class="space-y-2">
                    <label for="userName" class="block text-sm font-medium text-gray-700">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="userName"
                        bind:value={userName}
                        class={cn(
                            "w-full px-3 py-2 border rounded-md",
                            errors.userName ? "border-red-500" : "border-gray-300"
                        )}
                        placeholder="Enter your name"
                    />
                    {#if errors.userName}
                        <p class="text-red-500 text-sm">{errors.userName}</p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="userEmail" class="block text-sm font-medium text-gray-700">
                        Your Email
                    </label>
                    <input
                        type="email"
                        id="userEmail"
                        bind:value={userEmail}
                        class={cn(
                            "w-full px-3 py-2 border rounded-md",
                            errors.userEmail ? "border-red-500" : "border-gray-300"
                        )}
                        placeholder="Enter your email"
                    />
                    {#if errors.userEmail}
                        <p class="text-red-500 text-sm">{errors.userEmail}</p>
                    {/if}
                </div>

                <div class="space-y-2">
                    <label for="userPhone" class="block text-sm font-medium text-gray-700">
                        Your Phone Number
                    </label>
                    <input
                        type="tel"
                        id="userPhone"
                        bind:value={userPhone}
                        class={cn(
                            "w-full px-3 py-2 border rounded-md",
                            errors.userPhone ? "border-red-500" : "border-gray-300"
                        )}
                        placeholder="Enter your phone number"
                    />
                    {#if errors.userPhone}
                        <p class="text-red-500 text-sm">{errors.userPhone}</p>
                    {/if}
                </div>
            </div>

            <div class="flex gap-4">
                <button
                    type="button"
                    on:click={() => currentStep = 1}
                    class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    class={cn(
                        "flex-1 bg-blue-600 text-white py-2 px-4 rounded-md transition-colors",
                        isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    )}
                >
                    {isSubmitting ? 'Creating...' : 'Create Tribute'}
                </button>
            </div>
        {/if}
    </form>
</div>