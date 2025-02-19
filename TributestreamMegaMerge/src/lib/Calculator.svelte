<script lang="ts">
// Types
interface CalculatorOperation {
    type: 'add' | 'subtract' | 'multiply' | 'divide';
    value: number;
}

interface CalculatorState {
    currentValue: number;
    previousValue: number | null;
    operation: CalculatorOperation | null;
    memory: number | null;
    error: string | null;
}

// Props
let { 
    initialValue = 0,
    maxDigits = 10,
    allowNegative = true,
    theme = 'light'
} = $props<{
    initialValue?: number;
    maxDigits?: number;
    allowNegative?: boolean;
    theme?: 'light' | 'dark';
}>();

// State
let state = $state<CalculatorState>({
    currentValue: initialValue,
    previousValue: null,
    operation: null,
    memory: null,
    error: null
});

// Derived values
let displayValue = $derived(formatNumber(state.currentValue));
let hasMemory = $derived(state.memory !== null);
let hasError = $derived(state.error !== null);

// Helper functions
function formatNumber(num: number): string {
    if (isNaN(num)) return 'Error';
    if (!isFinite(num)) return 'Error';
    
    const formatted = num.toLocaleString('en-US', {
        maximumFractionDigits: 8,
        useGrouping: true
    });
    
    return formatted.length > maxDigits ? 
        num.toExponential(maxDigits - 5) : formatted;
}

function validateNumber(num: number): boolean {
    return !isNaN(num) && isFinite(num) && 
           (allowNegative || num >= 0) &&
           formatNumber(num).length <= maxDigits;
}

// Calculator operations
function clear(): void {
    state.currentValue = 0;
    state.previousValue = null;
    state.operation = null;
    state.error = null;
}

function clearEntry(): void {
    state.currentValue = 0;
    state.error = null;
}

function addDigit(digit: number): void {
    if (state.error) clear();
    
    const newValue = Number(`${state.currentValue}${digit}`);
    if (validateNumber(newValue)) {
        state.currentValue = newValue;
    }
}

function addDecimal(): void {
    if (state.error) clear();
    if (!String(state.currentValue).includes('.')) {
        state.currentValue = Number(`${state.currentValue}.`);
    }
}

function setOperation(type: CalculatorOperation['type']): void {
    if (state.error) {
        clear();
        return;
    }
    
    if (state.previousValue !== null && state.operation) {
        calculate();
    }
    
    state.previousValue = state.currentValue;
    state.currentValue = 0;
    state.operation = { type, value: state.previousValue };
}

function calculate(): void {
    if (!state.operation || state.previousValue === null) return;
    
    let result: number;
    
    switch (state.operation.type) {
        case 'add':
            result = state.previousValue + state.currentValue;
            break;
        case 'subtract':
            result = state.previousValue - state.currentValue;
            break;
        case 'multiply':
            result = state.previousValue * state.currentValue;
            break;
        case 'divide':
            if (state.currentValue === 0) {
                state.error = 'Division by zero';
                return;
            }
            result = state.previousValue / state.currentValue;
            break;
        default:
            return;
    }
    
    if (!validateNumber(result)) {
        state.error = 'Result out of range';
        return;
    }
    
    state.currentValue = result;
    state.previousValue = null;
    state.operation = null;
}

// Memory operations
function memoryStore(): void {
    state.memory = state.currentValue;
}

function memoryRecall(): void {
    if (state.memory !== null) {
        state.currentValue = state.memory;
    }
}

function memoryClear(): void {
    state.memory = null;
}

function memoryAdd(): void {
    if (state.memory !== null) {
        const result = state.memory + state.currentValue;
        if (validateNumber(result)) {
            state.memory = result;
        }
    } else {
        memoryStore();
    }
}

function memorySubtract(): void {
    if (state.memory !== null) {
        const result = state.memory - state.currentValue;
        if (validateNumber(result)) {
            state.memory = result;
        }
    } else {
        state.memory = -state.currentValue;
    }
}

// Event handlers
function handleKeydown(event: KeyboardEvent): void {
    if (event.key.match(/[0-9]/)) {
        addDigit(Number(event.key));
    } else if (event.key === '.') {
        addDecimal();
    } else if (event.key === '+') {
        setOperation('add');
    } else if (event.key === '-') {
        setOperation('subtract');
    } else if (event.key === '*') {
        setOperation('multiply');
    } else if (event.key === '/') {
        setOperation('divide');
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape') {
        clear();
    } else if (event.key === 'Backspace') {
        clearEntry();
    }
}
</script>

<style>
.calculator {
    width: 300px;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.calculator.light {
    background-color: #f8f9fa;
    color: #212529;
}

.calculator.dark {
    background-color: #212529;
    color: #f8f9fa;
}

.display {
    background-color: white;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    text-align: right;
    font-family: monospace;
    font-size: 1.5rem;
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.display.error {
    color: #dc3545;
}

.display.dark {
    background-color: #343a40;
    color: #f8f9fa;
}

.memory-indicator {
    position: absolute;
    top: 0.25rem;
    left: 0.5rem;
    font-size: 0.75rem;
    color: #6c757d;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

button {
    padding: 0.75rem;
    border: none;
    border-radius: 0.25rem;
    font-size: 1.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.light button {
    background-color: #e9ecef;
    color: #212529;
}

.light button:hover {
    background-color: #dee2e6;
}

.dark button {
    background-color: #343a40;
    color: #f8f9fa;
}

.dark button:hover {
    background-color: #495057;
}

.operation {
    background-color: #0d6efd !important;
    color: white !important;
}

.operation:hover {
    background-color: #0b5ed7 !important;
}

.memory {
    font-size: 1rem;
    background-color: #6c757d !important;
    color: white !important;
}

.memory:hover {
    background-color: #5c636a !important;
}

.clear {
    background-color: #dc3545 !important;
    color: white !important;
}

.clear:hover {
    background-color: #bb2d3b !important;
}

.equals {
    background-color: #198754 !important;
    color: white !important;
}

.equals:hover {
    background-color: #157347 !important;
}
</style>

<div 
    class="calculator {theme}"
    on:keydown={handleKeydown}
    tabindex="0"
>
    <div class="display {theme} {hasError ? 'error' : ''}">
        {#if hasMemory}
            <span class="memory-indicator">M</span>
        {/if}
        {hasError ? state.error : displayValue}
    </div>
    
    <div class="buttons">
        <!-- Memory Operations -->
        <button class="memory" on:click={memoryClear}>MC</button>
        <button class="memory" on:click={memoryRecall}>MR</button>
        <button class="memory" on:click={memoryAdd}>M+</button>
        <button class="memory" on:click={memorySubtract}>M-</button>
        
        <!-- Clear Operations -->
        <button class="clear" on:click={clear}>C</button>
        <button class="clear" on:click={clearEntry}>CE</button>
        <button class="operation" on:click={() => setOperation('divide')}>÷</button>
        <button class="operation" on:click={() => setOperation('multiply')}>×</button>
        
        <!-- Digits and Operations -->
        <button on:click={() => addDigit(7)}>7</button>
        <button on:click={() => addDigit(8)}>8</button>
        <button on:click={() => addDigit(9)}>9</button>
        <button class="operation" on:click={() => setOperation('subtract')}>-</button>
        
        <button on:click={() => addDigit(4)}>4</button>
        <button on:click={() => addDigit(5)}>5</button>
        <button on:click={() => addDigit(6)}>6</button>
        <button class="operation" on:click={() => setOperation('add')}>+</button>
        
        <button on:click={() => addDigit(1)}>1</button>
        <button on:click={() => addDigit(2)}>2</button>
        <button on:click={() => addDigit(3)}>3</button>
        <button class="equals" on:click={calculate}>=</button>
        
        <button on:click={() => addDigit(0)}>0</button>
        <button on:click={addDecimal}>.</button>
        <button on:click={memoryStore}>MS</button>
        <button class="memory" on:click={() => state.currentValue = -state.currentValue}>±</button>
    </div>
</div>