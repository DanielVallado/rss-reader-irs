<script>
    let items = [];
  
    // Obtener todos los registros
    async function fetchItems() {
      const response = await fetch('/api/items');
      items = await response.json();
    }
  
    // Crear un nuevo registro
    async function createItem() {
      const newItem = { name: 'Nuevo Item', description: 'Descripción del nuevo item' };
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        fetchItems(); 
      }
    }
  
    // Llamar a fetchItems al cargar la página
    fetchItems();
  </script>
  
  <main>
    <h1>Lista de Items</h1>
    <button on:click={createItem}>Crear Item</button>
    <ul>
      {#each items as item}
        <li>{item.name} - {item.description}</li>
      {/each}
    </ul>
  </main>