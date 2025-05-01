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

  <link rel="dns-prefetch" href="https://images.weserv.nl">
  <link rel="preconnect" href="https://images.weserv.nl" crossorigin="anonymous">
</svelte:head>

<Header/>

<main>
  <SvelteToast {options} />
  <slot />
</main>

<Footer/>