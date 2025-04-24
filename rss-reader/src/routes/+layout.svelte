<script lang="ts">
  import { Header, Footer } from "$lib";
  import { SvelteToast } from '@zerodevx/svelte-toast';

   // Toast configuration
   const options = {
      duration: 3000,
      position: 'bottom-right'
    };
</script>

<svelte:head>
  <title>RSS Reader</title>
  <link rel="stylesheet" href="/src/global.css">
</svelte:head>

<Header/>

<main>
  <SvelteToast {options} />
  <slot />
</main>

<Footer/>