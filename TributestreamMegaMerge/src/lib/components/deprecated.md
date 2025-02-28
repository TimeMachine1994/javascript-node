# Calculator Component Refactoring

## Components Deprecated

The following calculator components have been deprecated in favor of using the consolidated `Calc.svelte` and `SelectableSquares.svelte` components directly from the root `/lib` directory:

- `src/lib/components/MemorialCalculator.svelte`
- `src/lib/components/calculator/Calculator.svelte`
- `src/lib/components/calculator/CartSummary.svelte`
- `src/lib/components/calculator/LocationForm.svelte`
- `src/lib/components/calculator/PackageSelector.svelte`
- `src/lib/components/calculator/ScheduleDay.svelte`

## Migration

If you're currently using any of these components, please update your imports to use the consolidated components:

```svelte
<!-- BEFORE -->
import MemorialCalculator from '$lib/components/MemorialCalculator.svelte';
<!-- or -->
import Calculator from '$lib/components/calculator/Calculator.svelte';

<!-- AFTER -->
import { Calc, SelectableSquares } from '$lib';
```

## Navigation Updates

The `Calc.svelte` component now includes conditional navigation logic that directs users to:

1. The checkout page when they choose to make an immediate payment
2. The family-dashboard page when they opt to defer payment

The navigation is implemented using form actions and server-side redirects based on the user's selection.

## Implementation Details

The updated calculator uses the master store for state management:

- The SelectableSquares component handles package selection
- The Calc component handles all form data and cart calculations
- Navigation choices are stored in the master store's orderData.navigationTarget property

## Example Usage

```svelte
<script>
  import { Calc, SelectableSquares } from '$lib';
  import { masterStore } from '$lib/stores/userStore';
</script>

<div class="calculator-container">
  <SelectableSquares />
  <Calc initialStartTime="14:00" />
</div>