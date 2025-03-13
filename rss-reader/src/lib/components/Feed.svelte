<script lang="ts">
    import { Card, FormatDate } from '$lib';

    export let feed;
</script>


{#each feed as item}
    <Card date={FormatDate(item.pubDate)} title={item.title} link={item.link} description={item.description} categories={item.categories}  imageUrl={item.imageUrl || undefined}/>
{/each}
