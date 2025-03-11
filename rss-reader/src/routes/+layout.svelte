<script lang="ts">
  import { Header, Footer } from "$lib";
</script>

<svelte:head>
  <title>RSS Reader</title>
  <link rel="stylesheet" href="/src/global.css">
</svelte:head>

<Header/>

<main>
  <slot />
</main>

<Footer/>