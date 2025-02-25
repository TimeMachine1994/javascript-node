<script lang="ts">
    import { enhance } from '$app/forms';
    import type { CreateFormProps } from '$lib/types/home-page';

    let {
        formData = $bindable(),
        onSubmit,
        onBack,
        customLink,
        slugifiedText,
        isValid
    } = $props();

    $effect(() => {
        if (formData.isSubmitting) {
            return () => {
                formData.isSubmitting = false;
            };
        }
    });
</script>

<div class="mb-6">
    <h2 class="text-xl font-semibold mb-2">Your Loved One's Custom Link</h2>
    <p class="text-gray-700 break-all">{customLink}</p>
</div>

<form
    method="POST"
    action="?/create"
    use:enhance={() => {
        formData.isSubmitting = true;
        return async ({ result }) => {
            formData.isSubmitting = false;
            if (result.type === 'success') {
                onBack();
            }
        };
    }}
    class="w-full max-w-sm space-y-4"
>
    <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
            Full Name
        </label>
        <input
            id="fullName"
            name="fullName"
            type="text"
            bind:value={formData.fullName}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <div>
        <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
        </label>
        <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            bind:value={formData.phoneNumber}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <div>
        <label for="emailAddress" class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
        </label>
        <input
            id="emailAddress"
            name="emailAddress"
            type="email"
            bind:value={formData.emailAddress}
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
        />
    </div>

    <input type="hidden" name="slug" value={slugifiedText} />
    <input type="hidden" name="lovedOneName" value={formData.searchQuery} />

    <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        disabled={formData.isSubmitting || !isValid}
    >
        {formData.isSubmitting ? 'Submitting...' : 'Create Memorial Page'}
    </button>
</form>

<button
    on:click={onBack}
    class="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 
           transition-all duration-200"
>
    Back to Home
</button>