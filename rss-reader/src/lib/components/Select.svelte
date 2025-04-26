<script lang="ts">
  export let id = "";
  export let name = "";
  export let options: { value: string; label: string }[] = [];
  export let variant = "primary";
  export let fontSize = "1.5rem";
  export let padding = "1rem 2rem";
</script>

<select {id} {name} on:change class="select {variant}" style="--btn-font-size: {fontSize}; --btn-padding: {padding};">
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  .select {
    padding: var(--btn-padding);
    font-size: var(--btn-font-size);
    font-weight: bold;
    border: none;
    border-radius: var(--borderRadius);  
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    width: 100%;
    background-color: var(--gray);
    color: var(--white);
    text-align: center;
    line-height: 2rem;
  }

  .select.primary {
    background-color: var(--gray);
    color: var(--white);
  }

  .select:hover {
    opacity: 0.85;
  }
  .select::-ms-expand {
    display: none; /* Internet Explorer */
  }

  .select {
    -webkit-appearance: none; /* Safari */
    -moz-appearance: none; /* Firefox */
    appearance: none; /* Other browsers */
  }

  .select:focus {
    outline: none;
    border: 0.2rem solid var(--primary-color);
  }

  .select option {
    background-color: var(--gray);
    color: var(--white);
    padding: 0.5rem;
  }
</style>
