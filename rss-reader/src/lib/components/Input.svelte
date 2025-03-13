<script>
  export let id = "";
  export let name = "";
  export let type = "text";
  export let placeholder = "Introduce el texto";
  export let value = "";
</script>

<input bind:value id="{id}" name="{name}" type="{type}" placeholder="{placeholder}" />

<style>
  input {
        width: 100%;
        background-color: var(--gray);
        border-radius: var(--borderRadius);
        padding: 1.5rem 2rem;
        transition: all 0.3s ease;
        color: var(--white);
        font-size: 1.6rem;
        border: none;
        outline: none;
    }
</style>
