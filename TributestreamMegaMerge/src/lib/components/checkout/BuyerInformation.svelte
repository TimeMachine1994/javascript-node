<script lang="ts">
    import type { BuyerInformationProps } from '$lib/types/checkout';
    
    // Props using runes with type inference
    let props = $props();
    let initialData = props.initialData as BuyerInformationProps['initialData'];
    let onUpdate = props.onUpdate as BuyerInformationProps['onUpdate'];
    let errors = props.errors as BuyerInformationProps['errors'];

    // Local state
    let formData = $state({ ...initialData });

    // Handle input changes
    function handleChange() {
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
</script>

<div class="buyer-information">
    <h2>Personal Information</h2>
    <p class="subtitle">Please verify or update your contact information</p>

    <form class="form" on:submit|preventDefault={handleChange}>
        <div class="form-row">
            <div class="form-group">
                <label for="firstName" class="label">
                    First Name <span class="required">*</span>
                </label>
                <input
                    type="text"
                    id="firstName"
                    class="input"
                    class:error={hasError('firstName')}
                    bind:value={formData.firstName}
                    on:input={handleChange}
                    placeholder="Enter your first name"
                />
                {#if hasError('firstName')}
                    <span class="error-message">{getError('firstName')}</span>
                {/if}
            </div>

            <div class="form-group">
                <label for="lastName" class="label">
                    Last Name <span class="required">*</span>
                </label>
                <input
                    type="text"
                    id="lastName"
                    class="input"
                    class:error={hasError('lastName')}
                    bind:value={formData.lastName}
                    on:input={handleChange}
                    placeholder="Enter your last name"
                />
                {#if hasError('lastName')}
                    <span class="error-message">{getError('lastName')}</span>
                {/if}
            </div>
        </div>

        <div class="form-group">
            <label for="email" class="label">
                Email Address <span class="required">*</span>
            </label>
            <input
                type="email"
                id="email"
                class="input"
                class:error={hasError('email')}
                bind:value={formData.email}
                on:input={handleChange}
                placeholder="Enter your email address"
            />
            {#if hasError('email')}
                <span class="error-message">{getError('email')}</span>
            {/if}
        </div>

        <div class="form-group">
            <label for="phone" class="label">
                Phone Number <span class="required">*</span>
            </label>
            <input
                type="tel"
                id="phone"
                class="input"
                class:error={hasError('phone')}
                bind:value={formData.phone}
                on:input={handleChange}
                placeholder="Enter your phone number"
            />
            {#if hasError('phone')}
                <span class="error-message">{getError('phone')}</span>
            {/if}
            <span class="help-text">Format: +1 (555) 555-5555</span>
        </div>
    </form>
</div>

<style>
    .buyer-information {
        color: #1e293b;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #0f172a;
    }

    .subtitle {
        color: #64748b;
        margin-bottom: 2rem;
        font-size: 0.875rem;
    }

    .form {
        display: grid;
        gap: 1.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .form-group {
        display: grid;
        gap: 0.5rem;
    }

    .label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #334155;
    }

    .required {
        color: #ef4444;
    }

    .input {
        width: 100%;
        padding: 0.625rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        color: #1e293b;
        transition: all 0.2s;
    }

    .input:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 1px #4f46e5;
    }

    .input.error {
        border-color: #ef4444;
    }

    .input.error:focus {
        box-shadow: 0 0 0 1px #ef4444;
    }

    .error-message {
        font-size: 0.75rem;
        color: #ef4444;
    }

    .help-text {
        font-size: 0.75rem;
        color: #64748b;
    }

    @media (max-width: 640px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
</style>