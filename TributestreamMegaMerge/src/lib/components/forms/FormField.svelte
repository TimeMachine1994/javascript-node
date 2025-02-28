<script lang="ts">
  import { cn } from '$lib/utils/cn';
  
  // Define props using $props in Svelte 5
  let {
    name,
    label,
    type = 'text',
    value = '',
    error = null,
    required = false,
    disabled = false,
    placeholder = '',
    class: className = ''
  } = $props<{
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'time' | 'url' | 'search';
    value?: string | number;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
  }>();
  
  // Generate a unique ID for the input
  const id = `field-${name}-${Math.random().toString(36).substring(2, 9)}`;
  
  // Custom class for the input field
  const inputClass = $derived(cn(
    "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary", 
    error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
    className
  ));
</script>

<div class="form-field mb-4">
  <label for={id} class="block text-sm font-medium text-gray-700 mb-1">
    {label}{required ? ' *' : ''}
  </label>
  
  <input
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    {disabled}
    class={inputClass}
    value={value}
    on:input
    on:blur
    on:focus
  />
  
  {#if error}
    <p class="mt-1 text-sm text-red-600">{error}</p>
  {/if}
  
  <slot />
</div>