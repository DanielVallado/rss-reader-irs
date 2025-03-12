<script>
    import { Category } from "$lib";

    export let date;
    export let title;
    export let description;
    export let link;
    export let categories;
    export let imageUrl = "/assets/article_icon.svg";
</script>

<article class="card"> <!-- onclick="window.location.href='#';" -->
    <img src={imageUrl} alt={title}/>
    <div class="card-content">
        <p class="card-text date">{date}</p>
        <h2 class="card-title">{title}</h2>
        <p class="card-text link"><a href="{link}" target="_blank" rel="noopener noreferrer">Enlace al Artículo</a></p>
        <p class="card-text">{description}</p>

        {#if categories.length > 0}
            <div class="categories">
            {#each categories as category}
                <Category name={category}/>
            {/each}
        </div>
        {/if}
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
    .categories {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 1rem;
    }
    .card-content {
        padding: 1.5rem;
    }
    .card-title {
        font-size: 1.8rem;
        font-weight: bold;
        margin-bottom: 10px;
    }
    .card-text {
        font-size: 1.4rem;
        color: #B3B3B3;
    }
    .link::before {
        content: "➔";
        margin-right: 8px;
        font-size: inherit;
    }
    a {
        color: var(--white);
        text-decoration: none;
        font-weight: bold;
    }
</style>