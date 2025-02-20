<script lang="ts">
    import type { BillingDetailsProps, Address } from '$lib/types/checkout';
    
    // Props using runes with type inference
    let props = $props();
    let initialData = props.initialData as BillingDetailsProps['initialData'];
    let useShippingAddress = props.useShippingAddress as BillingDetailsProps['useShippingAddress'];
    let onUpdate = props.onUpdate as BillingDetailsProps['onUpdate'];
    let errors = props.errors as BillingDetailsProps['errors'];

    // Local state
    let formData = $state({
        billing: { ...initialData.billing },
        shipping: initialData.shipping ? { ...initialData.shipping } : { ...initialData.billing },
        useShippingAddress
    });

    // Handle form changes
    function handleChange() {
        onUpdate({
            billing: formData.billing,
            shipping: formData.useShippingAddress ? formData.shipping : undefined,
            useShippingAddress: formData.useShippingAddress
        });
    }

    // Toggle shipping address
    function toggleShippingAddress(event: Event) {
        const checkbox = event.target as HTMLInputElement;
        formData.useShippingAddress = checkbox.checked;
        if (!checkbox.checked) {
            formData.shipping = { ...formData.billing };
        }
        handleChange();
    }

    // Get error message for a field
    function getError(field: string, type: 'billing' | 'shipping' = 'billing'): string {
        const prefix = type === 'shipping' ? 'shipping_' : '';
        return errors[prefix + field] || '';
    }

    // Check if a field has an error
    function hasError(field: string, type: 'billing' | 'shipping' = 'billing'): boolean {
        return !!getError(field, type);
    }

    // Address form component to avoid duplication
    function AddressForm(props: { 
        type: 'billing' | 'shipping';
        data: Address;
        onChange: () => void;
    }) {
        const { type, data, onChange } = props;
        const title = type === 'billing' ? 'Billing' : 'Shipping';
        
        return `
            <div class="address-form">
                <h3>${title} Address</h3>
                
                <div class="form-group">
                    <label for="${type}_street" class="label">
                        Street Address <span class="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="${type}_street"
                        class="input"
                        class:error={hasError('street', type)}
                        bind:value={data.street}
                        on:input={onChange}
                        placeholder="Enter street address"
                    />
                    {#if hasError('street', type)}
                        <span class="error-message">{getError('street', type)}</span>
                    {/if}
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="${type}_city" class="label">
                            City <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="${type}_city"
                            class="input"
                            class:error={hasError('city', type)}
                            bind:value={data.city}
                            on:input={onChange}
                            placeholder="Enter city"
                        />
                        {#if hasError('city', type)}
                            <span class="error-message">{getError('city', type)}</span>
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="${type}_state" class="label">
                            State <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="${type}_state"
                            class="input"
                            class:error={hasError('state', type)}
                            bind:value={data.state}
                            on:input={onChange}
                            placeholder="Enter state"
                        />
                        {#if hasError('state', type)}
                            <span class="error-message">{getError('state', type)}</span>
                        {/if}
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="${type}_zip" class="label">
                            ZIP Code <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="${type}_zip"
                            class="input"
                            class:error={hasError('zip', type)}
                            bind:value={data.zip}
                            on:input={onChange}
                            placeholder="Enter ZIP code"
                        />
                        {#if hasError('zip', type)}
                            <span class="error-message">{getError('zip', type)}</span>
                        {/if}
                    </div>

                    <div class="form-group">
                        <label for="${type}_country" class="label">
                            Country <span class="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="${type}_country"
                            class="input"
                            class:error={hasError('country', type)}
                            bind:value={data.country}
                            on:input={onChange}
                            placeholder="Enter country"
                        />
                        {#if hasError('country', type)}
                            <span class="error-message">{getError('country', type)}</span>
                        {/if}
                    </div>
                </div>
            </div>
        `;
    }
</script>

<div class="billing-details">
    <h2>Billing Details</h2>
    <p class="subtitle">Please provide your billing information</p>

    <form class="form" on:submit|preventDefault={handleChange}>
        <!-- Billing Address -->
        {@html AddressForm({
            type: 'billing',
            data: formData.billing,
            onChange: handleChange
        })}

        <!-- Shipping Address Toggle -->
        <div class="shipping-toggle">
            <label class="checkbox-label">
                <input
                    type="checkbox"
                    bind:checked={formData.useShippingAddress}
                    on:change={toggleShippingAddress}
                />
                <span>Ship to a different address?</span>
            </label>
        </div>

        <!-- Shipping Address -->
        {#if formData.useShippingAddress}
            {@html AddressForm({
                type: 'shipping',
                data: formData.shipping,
                onChange: handleChange
            })}
        {/if}
    </form>
</div>

<style>
    .billing-details {
        color: #1e293b;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #0f172a;
    }

    h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 1rem;
        color: #334155;
    }

    .subtitle {
        color: #64748b;
        margin-bottom: 2rem;
        font-size: 0.875rem;
    }

    .form {
        display: grid;
        gap: 2rem;
    }

    .address-form {
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

    .shipping-toggle {
        padding: 1rem 0;
        border-top: 1px solid #e2e8f0;
        border-bottom: 1px solid #e2e8f0;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: #334155;
        font-size: 0.875rem;
    }

    @media (max-width: 640px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }
</style>