<script lang="ts">
    import { Card, formatDate } from '$lib';
    import type { ArticleWithCategories } from '$lib/server/services';

    export let feed: ArticleWithCategories[] = [];
    export let priorityCount = 6;
</script>


{#each feed as item, i (item.id)}
    <Card date={formatDate(item.publishedAt ?? '') ?? ''} 
        title={item.title} link={item.link} 
        description={item.description ?? ''} 
        categories={item.categories}  
        imageUrl={item.imageUrl ?? undefined}
        priority={i < priorityCount}/>
{/each}
