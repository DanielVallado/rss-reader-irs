<script>
  export let title;
  export let description;
  export let image;
</script>

<div class="card">
  <img src={image} alt={title} />
  <div class="card-content">
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
</div>

<style>
  .card {
    width: 300px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    background: white;
  }
  .card img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  .card-content {
    padding: 16px;
  }
</style>
