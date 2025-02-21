<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>


<script>
  import Card from '$lib/components/cards.svelte';

  let products = [
    { title: 'Laptop', description: 'Laptop gaming potente', image: '/laptop.jpg' },
    { title: 'Teléfono', description: 'Smartphone con gran batería', image: '/phone.jpg' },
  ];
</script>

<h1>Productos</h1>
<div class="grid">
  {#each products as product}
    <Card {title}={product.title} {description}={product.description} {image}={product.image} />
  {/each}
</div>

<style>
  .grid {
    display: flex;
    gap: 16px;
  }
</style>
