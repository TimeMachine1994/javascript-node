<script lang="ts">
  import PricingCard from './PricingCard.svelte';
  
  interface PricingFeature {
    name: string;
    included: boolean;
  }
  
  interface PricingPlan {
    id: string;
    name: string;
    price: number;
    description?: string;
    features: PricingFeature[];
    isPopular?: boolean;
    ctaText?: string;
  }

  let { 
    plans, 
    onSelectPlan,
    title = "Pricing Plans",
    subtitle = "Choose the plan that works best for you"
  } = $props<{
    plans: PricingPlan[];
    onSelectPlan?: (planId: string) => void;
    title?: string;
    subtitle?: string;
  }>();

  function handleSelectPlan(planId: string) {
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  }
</script>

<div class="pricing-table">
  <div class="text-center mb-8">
    <h2 class="text-3xl font-bold">{title}</h2>
    <p class="text-muted-foreground mt-2">{subtitle}</p>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each plans as plan}
      <PricingCard
        name={plan.name}
        price={plan.price}
        description={plan.description}
        features={plan.features}
        isPopular={plan.isPopular}
        ctaText={plan.ctaText}
        onSelect={() => handleSelectPlan(plan.id)}
      />
    {/each}
  </div>
</div>