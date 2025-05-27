<script lang="ts">
  import { Header, Footer } from "$lib";
  import { SvelteToast } from '@zerodevx/svelte-toast';
  export let data: { user?: any } = {};

   // Toast configuration
   const options = {
      duration: 3000,
      position: 'bottom-right'
    };
</script>

<div class="layout-root">
  <Header user={data.user ?? null}/>

  <main>
    <SvelteToast {options} />
    <slot />
  </main>

  <Footer/>
</div>

<style>
.layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>

<svelte:head>
  <title>RSS Reader</title>

  <link rel="dns-prefetch" href="https://images.weserv.nl">
  <link rel="preconnect" href="https://images.weserv.nl" crossorigin="anonymous">
</svelte:head>