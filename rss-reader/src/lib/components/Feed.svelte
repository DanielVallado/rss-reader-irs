<script lang="ts">
    import { Card, extractImageUrl, FormatDate } from '$lib';

    export let feed;
</script>

{#if feed.items && feed.items.length > 0}
    {#each feed.items as item}
        <Card date={FormatDate(item.pubDate)} title={item.title} link={item.link} description={item.content} categories={item.categories}  imageUrl={extractImageUrl(item)}/>
    {/each}
{/if}