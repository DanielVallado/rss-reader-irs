<script lang="ts">
    import { Category, optimizeImage, truncateText } from "$lib";
	import { onMount } from 'svelte';


    export let priority = false;

    export let date: string;
    export let title: string;
    export let description: string;
    export let link: string;
    export let categories: string[] = [];
    export let imageUrl = "/assets/article_icon.svg";

    const width = 400;
    const height = 200;
    const quality = 80;

	const webpSet = `
		${optimizeImage(imageUrl, 320, 160, 'webp', quality, 1)} 320w,
		${optimizeImage(imageUrl, 400, 200, 'webp', quality, 1)} 400w,
		${optimizeImage(imageUrl, 640, 320, 'webp', quality, 1)} 640w`;

	const jpgSet = `
		${optimizeImage(imageUrl, 320, 160, 'jpeg', quality, 1)} 320w,
		${optimizeImage(imageUrl, 400, 200, 'jpeg', quality, 1)} 400w,
		${optimizeImage(imageUrl, 640, 320, 'jpeg', quality, 1)} 640w`;

    const tinyWebp = optimizeImage(imageUrl, 20, 20, 'webp', 10, 1);
	const tinyJpeg = optimizeImage(imageUrl, 20, 20, 'jpeg', 10, 1);

    let imgEl!: HTMLImageElement;
    let sourceEl!: HTMLSourceElement;
    let isLoaded = false;  

    function onImgLoad() {
		if (imgEl.naturalWidth > 50) isLoaded = true;
	}

    onMount(() => {
		if (priority) return;

		const io = new IntersectionObserver(
			([entry], obs) => {
				if (!entry.isIntersecting) return;

				sourceEl.srcset = webpSet;
				imgEl.srcset    = jpgSet;
				imgEl.src       = optimizeImage(imageUrl, width, height, 'jpeg', quality, 1);

				obs.disconnect();
			},
			{ rootMargin: '200px' }
		);

		io.observe(imgEl);

        return () => io.disconnect(); 
	});
</script>

<article class="card">
    <picture>
        <source bind:this={sourceEl} type="image/webp" srcset={priority ? webpSet : tinyWebp} />

        <img
            bind:this={imgEl}
            class:placeholder={!priority}
	        class:loaded={isLoaded} 
            alt={title}
			src={priority ? optimizeImage(imageUrl, width, height, 'jpeg', quality, 1) : tinyJpeg}
			srcset={priority ? jpgSet : tinyJpeg}
			sizes="(max-width: 640px) 100vw,
		            (max-width: 1024px) 50vw,
		            400px"
			width={width}
			height={height}
			loading={priority ? "eager" : "lazy"}
			fetchpriority={priority ? "high" : "low"}
			decoding="async" 
            on:load={onImgLoad} />
    </picture>

    <div class="card-content">
        <p class="card-text date">{date}</p>
        <h2 class="card-title">{title}</h2>
        <p class="card-text link"><a href={link} target="_blank" rel="noopener noreferrer">Enlace al Artículo</a></p>
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
	img.placeholder {
		filter: blur(18px) brightness(0.9);
		transform: scale(1.05);
		transition: filter .35s ease;
	}
	img.loaded {
		filter: none;
	}
</style>