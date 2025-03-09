<script lang="ts">
    import { Button, Card, extractImageUrl } from '$lib';

    export let feed;
</script>

<section>
    <Button text="Añadir RSS" />
    <h1>hello</h1>
    <p>{feed.title}</p>

    <div>
        {#each feed.items as item}
            <Card title={item.title} description={item.content} imageUrl={extractImageUrl(item)}/>
        {/each}
    </div>

    <pre>{JSON.stringify(feed, null, 2)}</pre>
    
</section>

<style>
    div {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }

</style>