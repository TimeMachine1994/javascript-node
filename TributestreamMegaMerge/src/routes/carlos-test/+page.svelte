<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Input } from "$lib/components/ui/input";
  import { cn } from "$lib/utils";

  // Using $state rune for reactive variables
  let num1 = $state(0);
  let num2 = $state(0);
  let result = $state<number | null>(null);
  let operation = $state<string>('');
  let history = $state<string[]>([]);

  // Derived state for displaying the current operation
  let currentOperation = $derived(
    operation ? `${num1} ${operation} ${num2} = ${result !== null ? result : '?'}` : 'Enter numbers and select an operation'
  );

  // Calculator operations
  function calculate(op: string) {
    operation = op;
    
    switch (op) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num2 !== 0 ? num1 / num2 : null;
        break;
      default:
        result = null;
    }

    // Add to history if we have a valid result
    if (result !== null) {
      history = [...history, `${num1} ${op} ${num2} = ${result}`];
    }
  }

  // Clear calculator
  function clearCalculator() {
    num1 = 0;
    num2 = 0;
    result = null;
    operation = '';
  }

  // Clear history
  function clearHistory() {
    history = [];
  }

  // Handle input changes
  function handleInput1(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value);
    num1 = isNaN(value) ? 0 : value;
  }

  function handleInput2(e: Event) {
    const value = parseFloat((e.target as HTMLInputElement).value);
    num2 = isNaN(value) ? 0 : value;
  }

  // Effect to log operations (for demonstration purposes)
  $effect(() => {
    if (operation && result !== null) {
      console.log(`Calculation performed: ${num1} ${operation} ${num2} = ${result}`);
    }
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6 text-center">Svelte 5 Calculator</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Calculator Card -->
    <Card>
      <CardHeader>
        <CardTitle>Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <!-- Display -->
          <div class="bg-gray-100 p-4 rounded-md text-xl font-mono text-right">
            {currentOperation}
          </div>
          
          <!-- Inputs -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="num1" class="block text-sm font-medium mb-1">First Number</label>
              <Input 
                id="num1" 
                type="number" 
                value={num1} 
                on:input={handleInput1} 
              />
            </div>
            <div>
              <label for="num2" class="block text-sm font-medium mb-1">Second Number</label>
              <Input 
                id="num2" 
                type="number" 
                value={num2} 
                on:input={handleInput2} 
              />
            </div>
          </div>
          
          <!-- Operation Buttons -->
          <div class="grid grid-cols-4 gap-2">
            <Button on:click={() => calculate('+')} variant="outline">+</Button>
            <Button on:click={() => calculate('-')} variant="outline">-</Button>
            <Button on:click={() => calculate('*')} variant="outline">×</Button>
            <Button on:click={() => calculate('/')} variant="outline">÷</Button>
          </div>
          
          <!-- Result -->
          <div class="mt-4">
            <div class="text-lg font-semibold">Result:</div>
            <div class="bg-gray-100 p-3 rounded-md text-xl font-mono">
              {result !== null ? result : 'No result yet'}
            </div>
          </div>
          
          <!-- Clear Button -->
          <Button on:click={clearCalculator} variant="destructive" class="w-full">
            Clear Calculator
          </Button>
        </div>
      </CardContent>
    </Card>
    
    <!-- History Card -->
    <Card>
      <CardHeader>
        <CardTitle>Calculation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#if history.length > 0}
            <ul class="space-y-2">
              {#each history as item, i}
                <li class={cn(
                  "p-2 rounded-md",
                  i % 2 === 0 ? "bg-gray-100" : "bg-gray-50"
                )}>
                  {item}
                </li>
              {/each}
            </ul>
            <Button on:click={clearHistory} variant="outline" class="w-full">
              Clear History
            </Button>
          {:else}
            <p class="text-gray-500 italic">No calculations yet</p>
          {/if}
        </div>
      </CardContent>
    </Card>
  </div>
  
  <!-- Svelte 5 Runes Info -->
  <div class="mt-8 p-4 bg-blue-50 rounded-lg">
    <h2 class="text-xl font-bold mb-2">About This Example</h2>
    <p class="mb-2">This calculator demonstrates Svelte 5's new reactivity system using runes:</p>
    <ul class="list-disc pl-5 space-y-1">
      <li><code class="bg-blue-100 px-1 rounded">$state</code> - For declaring reactive variables</li>
      <li><code class="bg-blue-100 px-1 rounded">$derived</code> - For computed values</li>
      <li><code class="bg-blue-100 px-1 rounded">$effect</code> - For side effects when state changes</li>
    </ul>
  </div>
</div>