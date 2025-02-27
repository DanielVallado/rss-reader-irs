<script lang="ts">
  import { Header, Footer } from "$lib";
</script>

<Header/>

<main>
  <slot />
</main>

<Footer/>

<style>
  :global {
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #1a1a1a;
      color: white;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    main {
        flex-grow: 1;
    }
  }
</style>
