<script lang="ts">
  export let text = "botón";
  export let variant = "primary";
  export let fontSize = "1.5rem";
  export let padding = "1rem 2rem";
  export let type: "button" | "reset" | "submit" = "button";
</script>

<button type={type} on:click class="btn {variant}" style="--btn-font-size: {fontSize}; --btn-padding: {padding};">
  {text}
</button>

<style>
  .btn {
    padding: var(--btn-padding);
    font-size: var(--btn-font-size);
    font-weight: bold;
    border: none;
    border-radius: var(--borderRadius);  
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .btn.primary {
    background-color: var(--gray);
    color: var(--white);
  }

  .btn.secondary {
    background-color: var(--blue);
    color: var(--white);
  }

  .btn:hover {
    opacity: 0.85;
  }
</style>
