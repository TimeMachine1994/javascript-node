<script lang="ts">
    import { goto } from '$app/navigation';

    const mockUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567'
    };
  
    const mockAddresses = {
      billing: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      },
      shipping: {
        firstName: 'Jane',
        lastName: 'Doe',
        street: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      }
    };
  
    let sameAsBilling = true;
    let formData = {
      ...mockUser,
      billingAddress: { ...mockAddresses.billing },
      shippingAddress: { ...mockAddresses.shipping },
      cardDetails: {
        number: '4111 1111 1111 1111',
        expiry: '12/25',
        cvv: '123'
      }
    };
  
    function handleSubmit(e: SubmitEvent) {
      e.preventDefault();
      console.log('Payment processing...', formData);
    }
  
    function resetToMockData() {
      formData = {
        ...mockUser,
        billingAddress: { ...mockAddresses.billing },
        shippingAddress: { ...mockAddresses.shipping },
        cardDetails: {
          number: '4111 1111 1111 1111',
          expiry: '12/25',
          cvv: '123'
        }
      };
    }

    function handleCancel() {
      goto('/schedule');
    }
</script>

<div class="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-[sans-serif]">
  <div class="max-w-7xl mx-auto">
    <div class="bg-white rounded-lg shadow-xl overflow-hidden">
      <div class="flex max-sm:flex-col gap-8 max-lg:gap-4">
        <div class="bg-gray-50 lg:w-[370px] sm:w-[300px]">
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-32 h-28 max-lg:w-24 max-lg:h-24 flex p-3 shrink-0 bg-gray-200 rounded-md">
                  <img src='https://readymadeui.com/images/product10.webp' class="w-full object-contain" alt="Product" />
                </div>
                <div class="w-full">
                  <h3 class="text-sm lg:text-base text-gray-800">Split Sneakers</h3>
                  <ul class="text-xs text-gray-800 space-y-1 mt-3">
                    <li class="flex flex-wrap gap-4">Size <span class="ml-auto">37</span></li>
                    <li class="flex flex-wrap gap-4">Quantity <span class="ml-auto">2</span></li>
                    <li class="flex flex-wrap gap-4">Total Price <span class="ml-auto">$40</span></li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-200">
              <h4 class="flex flex-wrap gap-4 text-sm lg:text-base text-gray-800 font-semibold">Total <span class="ml-auto">$84.00</span></h4>
            </div>
          </div>
        </div>

        <div class="flex-1 p-6 lg:p-8">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800">Complete your order</h2>
            <button type="button" on:click={resetToMockData} 
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Load Test Data
            </button>
          </div>

          <form on:submit={handleSubmit} class="space-y-8">
            <div>
              <h3 class="text-sm lg:text-base text-gray-800 font-medium mb-4">Personal Details</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <input type="text" bind:value={formData.firstName} placeholder="First Name" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.lastName} placeholder="Last Name" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="email" bind:value={formData.email} placeholder="Email" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="tel" bind:value={formData.phone} placeholder="Phone" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm lg:text-base text-gray-800 font-medium mb-4">Billing Address</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <input type="text" bind:value={formData.billingAddress.street} placeholder="Street Address" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.billingAddress.city} placeholder="City" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.billingAddress.state} placeholder="State" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.billingAddress.zip} placeholder="ZIP Code" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.billingAddress.country} placeholder="Country" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <div class="flex items-center gap-2 mb-4">
                <h3 class="text-sm lg:text-base text-gray-800 font-medium">Shipping Address</h3>
                <label class="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" bind:checked={sameAsBilling} 
                    class="w-4 h-4 text-blue-600 bg-gray-50 border-gray-300 rounded focus:ring-blue-500" />
                  Same as billing address
                </label>
              </div>

              {#if !sameAsBilling}
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.firstName} placeholder="First Name" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.lastName} placeholder="Last Name" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div class="md:col-span-2">
                    <input type="text" bind:value={formData.shippingAddress.street} placeholder="Street Address" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.city} placeholder="City" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.state} placeholder="State" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.zip} placeholder="ZIP Code" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                  <div>
                    <input type="text" bind:value={formData.shippingAddress.country} placeholder="Country" required
                      class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                  </div>
                </div>
              {/if}
            </div>

            <div>
              <h3 class="text-sm lg:text-base text-gray-800 font-medium mb-4">Payment Details</h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <input type="text" bind:value={formData.cardDetails.number} placeholder="Card Number" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.cardDetails.expiry} placeholder="MM/YY" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
                <div>
                  <input type="text" bind:value={formData.cardDetails.cvv} placeholder="CVV" required
                    class="px-4 py-3 bg-gray-50 focus:bg-white text-gray-800 w-full text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors" />
                </div>
              </div>
            </div>

            <div class="flex gap-4 max-md:flex-col">
              <button type="button" on:click={handleCancel}
                class="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 transition-colors">
                Cancel
              </button>
              <button type="submit" 
                class="rounded-md px-4 py-2.5 w-full text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                Complete Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>