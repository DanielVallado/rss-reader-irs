<script lang="ts">
  export let options: { value: string; label: string }[] = [];
  export let variant = "primary";
  export let fontSize = "1.5rem";
  export let padding = "0.5rem 1rem";
</script>

<select class="select {variant}" style="--btn-font-size: {fontSize}; --btn-padding: {padding};">
  {#each options as option}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>

<style>
  .select {
    padding: var(--btn-padding);
    font-size: var(50); /* Asegura que el tamaño de la fuente sea más grande */
    font-weight: bold;
    border: none;
    border-radius: var(--borderRadius);  
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    width: 100%; /* Asegura que ocupe el máximo espacio disponible */
    background-color: var(--gray); /* Color de fondo */
    color: var(--white); /* Color de texto */
    text-align: center; /* Centra el texto horizontalmente */
    line-height: 2rem; /* Ajusta el alto de la línea para centrar verticalmente */
  }

  /* Variante primaria */
  .select.primary {
    background-color: var(--gray);
    color: var(--white);
  }

  .select:hover {
    opacity: 0.85;
  }

  .select:active {
    transform: scale(0.95);
  }

  /* Eliminar la flecha nativa del select */
  .select::-ms-expand {
    display: none; /* Para Internet Explorer */
  }

  .select {
    -webkit-appearance: none; /* Safari */
    -moz-appearance: none; /* Firefox */
    appearance: none; /* Otros navegadores */
  }

  .select:focus {
    outline: none; /* Eliminar el borde de enfoque predeterminado */
    border: 2px solid var(--primary-color); /* Borde cuando está enfocado */
  }

  .select option {
    background-color: var(--gray);
    color: var(--white);
    padding: 5px;
  }
</style>