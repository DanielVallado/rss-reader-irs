<script>
    export let title = "Título";
    export let description;
    export let imageUrl = "/assets/article_icon.svg";
</script>

<article class="card"> <!-- onclick="window.location.href='#';" -->
    <img src={imageUrl} alt={title}/>
    <div class="card-content">
        <h2 class="card-title">{title}</h2>
        <p class="card-text">{description}</p>
    </div>
</article>

<style>
    article {
        background: var(--secondary);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
        cursor: pointer;
    }
    article:hover {
        transform: scale(1.05);
    }
    article img {
        width: 100%;
        height: 20rem;
        object-fit: cover;
    }
    div {
        padding: 1.5rem;
    }
    h2 {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 10px;
    }
    p {
        font-size: 1.4rem;
        color: #B3B3B3;
    }
</style>