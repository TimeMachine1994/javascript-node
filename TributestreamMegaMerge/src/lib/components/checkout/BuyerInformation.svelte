<script lang="ts">
    import type { BuyerInformationProps } from '$lib/types/checkout';
    import { validationRules } from '$lib/types/checkout';
    
    // Props using runes with type inference
    let props = $props();
    let initialData = props.initialData as BuyerInformationProps['initialData'];
    let onUpdate = props.onUpdate as BuyerInformationProps['onUpdate'];
    let errors = props.errors as BuyerInformationProps['errors'];

    // Relationship options
    const relationshipOptions = [
        'Family Member',
        'Friend',
        'Funeral Director',
        'Other'
    ];

    // Local state
    let formData = $state({
        ...initialData,
        relationship: initialData.relationship || ''
    });

    let showOtherRelationship = $derived(formData.relationship === 'Other');

    // Handle input changes
    function handleChange() {
        // Reset relationship-specific fields when relationship changes
        if (formData.relationship !== 'Other') {
            formData.otherRelationship = '';
        }
        onUpdate(formData);
    }

    // Get error message for a field
    function getError(field: string): string {
        return errors[field] || '';
    }

    // Check if a field has an error
    function hasError(field: string): boolean {
        return !!errors[field];
    }

    // Format phone number as user types
    function formatPhoneNumber(value: string): string {
        // Remove all non-numeric characters
        const cleaned = value.replace(/\D/g, '');
        
        // Format the number
        if (cleaned.length === 0) return '';
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6) return `(${cleaned.slice(0,3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)}`;
    }

    function handlePhoneInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const formatted = formatPhoneNumber(input.value);
        formData.phone = formatted;
        handleChange();
    }
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-2xl font-semibold text-gray-900 mb-2">Personal Information</h2>
    <p class="text-gray-600 text-sm mb-6">Please verify or update your contact information</p>

    <form class="space-y-6" on:submit|preventDefault={handleChange}>
        <!-- Name Fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700">
                    First Name <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="firstName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('firstName') ? 'border-red-300' : ''}"
                    class:error={hasError('firstName')}
                    bind:value={formData.firstName}
                    on:input={handleChange}
                    placeholder="Enter your first name"
                />
                {#if hasError('firstName')}
                    <p class="mt-1 text-sm text-red-600">{getError('firstName')}</p>
                {/if}
            </div>

            <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700">
                    Last Name <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="lastName"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('lastName') ? 'border-red-300' : ''}"
                    class:error={hasError('lastName')}
                    bind:value={formData.lastName}
                    on:input={handleChange}
                    placeholder="Enter your last name"
                />
                {#if hasError('lastName')}
                    <p class="mt-1 text-sm text-red-600">{getError('lastName')}</p>
                {/if}
            </div>
        </div>

        <!-- Contact Fields -->
        <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
                Email Address <span class="text-red-500">*</span>
            </label>
            <input
                type="email"
                id="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('email') ? 'border-red-300' : ''}"
                class:error={hasError('email')}
                bind:value={formData.email}
                on:input={handleChange}
                placeholder="Enter your email address"
            />
            {#if hasError('email')}
                <p class="mt-1 text-sm text-red-600">{getError('email')}</p>
            {/if}
        </div>

        <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
                Phone Number <span class="text-red-500">*</span>
            </label>
            <input
                type="tel"
                id="phone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('phone') ? 'border-red-300' : ''}"
                class:error={hasError('phone')}
                bind:value={formData.phone}
                on:input={handlePhoneInput}
                placeholder="(555) 555-5555"
            />
            {#if hasError('phone')}
                <p class="mt-1 text-sm text-red-600">{getError('phone')}</p>
            {/if}
        </div>

        <!-- Relationship Fields -->
        <div>
            <label for="relationship" class="block text-sm font-medium text-gray-700">
                Relationship to Deceased <span class="text-red-500">*</span>
            </label>
            <select
                id="relationship"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('relationship') ? 'border-red-300' : ''}"
                bind:value={formData.relationship}
                on:change={handleChange}
            >
                <option value="">Select relationship</option>
                {#each relationshipOptions as option}
                    <option value={option}>{option}</option>
                {/each}
            </select>
            {#if hasError('relationship')}
                <p class="mt-1 text-sm text-red-600">{getError('relationship')}</p>
            {/if}
        </div>

        {#if showOtherRelationship}
            <div>
                <label for="otherRelationship" class="block text-sm font-medium text-gray-700">
                    Please Specify Relationship <span class="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="otherRelationship"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm {hasError('otherRelationship') ? 'border-red-300' : ''}"
                    bind:value={formData.otherRelationship}
                    on:input={handleChange}
                    placeholder="Please specify your relationship"
                />
                {#if hasError('otherRelationship')}
                    <p class="mt-1 text-sm text-red-600">{getError('otherRelationship')}</p>
                {/if}
            </div>
        {/if}
    </form>
</div>