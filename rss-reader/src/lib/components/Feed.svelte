<script lang="ts">
    import { Card, formatDate } from '$lib';

    export let feed;
</script>


{#each feed as item}
    <Card date={formatDate(item.publishedAt)} title={item.title} link={item.link} description={item.description} categories={item.categories}  imageUrl={item.imageUrl || undefined}/>
{/each}
