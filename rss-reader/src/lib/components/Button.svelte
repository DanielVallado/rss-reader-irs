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
    transition: background-color 0.3s, box-shadow 0.2s, transform 0.15s cubic-bezier(0.4,0,0.2,1);
    white-space: nowrap;
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
  .btn:active {
    transform: scale(0.99) translateY(2px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }
</style>
