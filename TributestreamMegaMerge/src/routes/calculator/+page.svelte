  <script lang="ts">
import Calculator from '$lib/Calculator.svelte';
</script>

<div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Calculator Demo</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Light Theme Calculator -->
        <div class="p-6 bg-white rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4">Light Theme</h2>
            <div class="flex justify-center">
                <Calculator theme="light" maxDigits={12} />
            </div>
        </div>

        <!-- Dark Theme Calculator -->
        <div class="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 class="text-xl font-bold mb-4 text-white">Dark Theme</h2>
            <div class="flex justify-center">
                <Calculator theme="dark" maxDigits={12} />
            </div>
        </div>
    </div>

    <div class="mt-12">
        <h2 class="text-2xl font-bold mb-4">Features</h2>
        <ul class="list-disc list-inside space-y-2">
            <li>Basic arithmetic operations (addition, subtraction, multiplication, division)</li>
            <li>Memory functions (MC, MR, M+, M-, MS)</li>
            <li>Keyboard support for numbers and operations</li>
            <li>Error handling for invalid operations</li>
            <li>Responsive design with light/dark themes</li>
            <li>Number formatting with thousands separators</li>
            <li>Support for decimal numbers</li>
            <li>Clear (C) and Clear Entry (CE) functions</li>
        </ul>
    </div>

    <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h3 class="text-lg font-semibold mb-2">Numbers and Basic Operations</h3>
                <ul class="list-disc list-inside space-y-1">
                    <li>0-9: Number input</li>
                    <li>.: Decimal point</li>
                    <li>+: Addition</li>
                    <li>-: Subtraction</li>
                    <li>*: Multiplication</li>
                    <li>/: Division</li>
                </ul>
            </div>
            <div>
                <h3 class="text-lg font-semibold mb-2">Special Keys</h3>
                <ul class="list-disc list-inside space-y-1">
                    <li>Enter/=: Calculate result</li>
                    <li>Escape: Clear all (C)</li>
                    <li>Backspace: Clear entry (CE)</li>
                </ul>
            </div>
        </div>
    </div>
</div>