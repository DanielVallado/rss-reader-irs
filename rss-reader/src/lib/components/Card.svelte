<script lang="ts">
    import { Category, optimizeImage, truncateText } from "$lib";

    export let date;
    export let title;
    export let description;
    export let link;
    export let categories;
    export let imageUrl = "/assets/article_icon.svg";

    const width = 400;
    const height = 200;

</script>

<article class="card">
    <picture>
        <source type="image/webp" 
                srcset="{optimizeImage(imageUrl, width, height, "webp", 1)} 1x, 
                        {optimizeImage(imageUrl, width, height, "webp", 2)} 2x" />

        <img src="{optimizeImage(imageUrl, width, height, "jpeg")}" 
            srcset="{optimizeImage(imageUrl, width, height, "jpeg", 1)} 1x, 
                    {optimizeImage(imageUrl, width, height, "jpeg", 2)} 2x" 
            width={width} height={height} 
            alt={title} 
            loading="lazy" 
            decoding="async" 
            fetchpriority="low"/>
    </picture>

    <div class="card-content">
        <p class="card-text date">{date}</p>
        <h2 class="card-title">{title}</h2>
        <p class="card-text link"><a href="{link}" target="_blank" rel="noopener noreferrer">Enlace al Artículo</a></p>
        <p class="card-text ">{truncateText(description, 120)}</p>

        {#if categories?.length > 0}
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
    }
    article:hover {
        transform: scale(1.03);
    }
    article img {
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