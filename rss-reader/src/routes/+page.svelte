<script lang="ts">
    import { Feed, Input, Button } from '$lib';

    import { deserialize } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';

    export let data;

    let feed = data.feed;
    let groupBySource = true;

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

    async function handleReload(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement}) {
        event.preventDefault();
        const formData = new FormData();

       const response = await fetch(event.currentTarget.action, {
			method: 'POST',
            body: formData
		});


    }
</script>

<section class="container">
    <!-- <Button text="Añadir RSS" /> -->
    <label class="no-margin" for="link">Añadir RSS:</label>
    <div class="order">
         <form class="input-container" method="POST" action="?/addRss" onsubmit={handleSubmit}>
            <Input id="link" name="link" placeholder="Enlace"/>
            <Button text="Añadir" variant="secondary" padding="1.5rem 3rem" type="submit"/>
        </form>

        <form method="POST" action="?/reload" onsubmit="{handleReload}">
            <Button text="&#x27F3;" fontSize="2rem" type="submit"/>
        </form>
    </div>
    
    <div class="search-container">
        <label class="no-margin" for="search">Buscar:</label>
        <Input id="search" name="search"/>
    </div>

    {#if feed && feed.length > 0 }
        <div class="feed">
            <Feed feed={feed}/>
        </div>
    {:else}
        <p>No se encontraron feeds</p>
    {/if}

    <!-- <pre>{JSON.stringify(feed, null, 2)}</pre> -->
    
</section>

<style>
    .feed {
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
    }
    .search-container {
        margin-top: 2rem;
    }
</style>