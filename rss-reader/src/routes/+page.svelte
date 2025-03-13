<script lang="ts">
    import { Button, Input, Card, extractImageUrl, FormatDate } from '$lib';

    import { deserialize } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';

    export let data;

    let feed = data.feed;

    async function handleSubmit(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			console.log('Success!');
		} else {
            console.log('Error!');
        }

        console.log(result);
	}
</script>

<section class="container">
    <!-- <Button text="Añadir RSS" /> -->
    <label class="no-margin" for="link">Añadir RSS:</label>
    <div class="order">
         <form class="input-container" method="POST" onsubmit={handleSubmit}>
            <Input id="link" name="link" placeholder="Enlace"/>
            <Button text="Añadir" variant="secondary" padding="1.5rem 3rem" type="submit"/>
        </form>

        

        <Button></Button>
    </div>
    
    <div class="search-container">
        <label class="no-margin" for="search">Buscar:</label>
        <Input id="search" name="search"/>
    </div>
    

    <div>
        {#if feed}
            {#each feed.items as item}
                <Card date={FormatDate(item.pubDate)} title={item.title} link={item.link} description={item.content} categories={item.categories}  imageUrl={extractImageUrl(item)}/>
            {/each}
        {/if}
    </div>

    <pre>{JSON.stringify(feed, null, 2)}</pre>
    
</section>

<style>
    div {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
        gap: 2rem;
        padding: 2rem 0;
    }
    .container {
        margin: 4rem auto;
    }
    .input-container{
        width: 90%;
        max-width: 60rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
    }
    .order {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 0;
    }
    .search-container {
        display: block;

    }
</style>