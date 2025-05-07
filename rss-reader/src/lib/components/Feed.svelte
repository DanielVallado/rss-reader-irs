<script lang="ts">
    import { Card, formatDate } from '$lib';
    import type { ArticleWithCategories } from '$lib/server/services';

    export let feed: ArticleWithCategories[] = [];
    export let page: number;
    export let pageCount: number;
    export let limit: number;
    export let priorityCount = 6;
</script>

<div class="feed">
    {#each feed as item, i (item.id)}
    <Card date={formatDate(item.publishedAt ?? '') ?? ''} 
        title={item.title} link={item.link} 
        description={item.description ?? ''} 
        categories={item.categories}  
        imageUrl={item.imageUrl ?? undefined}
        priority={i < priorityCount}/>
    {/each}
</div>

<style>
    .feed {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
        gap: 2rem;
        padding: 2rem 0;
    }
</style>
