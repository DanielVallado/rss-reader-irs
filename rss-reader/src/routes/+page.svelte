<script lang="ts">
    import { Feed, Input, Button, Select , sortArticles } from '$lib';

    import { deserialize } from '$app/forms';
    import type { ActionResult } from '@sveltejs/kit';
    import type { Article } from '$lib/server/repositories';
    import type { SortCriterion } from '$lib';


    export let data;

    let feed: Article[] = data.feed ?? [];
    let selectedFilter: SortCriterion = 'date';
    let searchTerm = '';

    function handleFilter(event: Event): void {
        selectedFilter = (event.target as HTMLSelectElement).value as SortCriterion;        
    }

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

    async function handleReload(event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) {
        event.preventDefault();
        const formData = new FormData();

       const response = await fetch(event.currentTarget.action, {
			method: 'POST',
            body: formData
		});

        const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			console.log('Success!');
		} else {
            console.log('Error!');
        }

        console.log(result);
    }
    
    // Reload the feed when the component is mounted
    $: sortedFeed = sortArticles(feed, selectedFilter);

    $: displayedFeed = sortedFeed.filter(item => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return true;
        const inTitle = item.title?.toLowerCase().includes(term) ?? false;
        const inDesc  = item.description?.toLowerCase().includes(term) ?? false;
        const inDate  = item.publishedAt?.toLowerCase().includes(term) ?? false;
        return inTitle || inDesc || inDate;
    });

</script>

<section class="container">
    <!-- <Button text="Añadir RSS" /> -->
    
    <div class="order">
        <label class="link-label" for="link">Añadir RSS:</label>
        <form class="link" method="POST" action="?/addRss" onsubmit={handleSubmit}>
            <Input id="link" name="link" placeholder="Introduce el enlace"/>
            <Button text="Añadir" variant="secondary" padding="1.5rem 3rem" type="submit"/>
        </form>
        

        <label class="filter-label" for="filter">Ordenar por:</label>
        <div class="filter">
            <Select id="filter" name="filter" on:change={handleFilter}
                options={[
                    { value: "date", label: "Fecha" },
                    // { value: "category", label: "Categoría" },
                    { value: "title", label: "Título" },
                    { value: "description", label: "Descripción" }
                ]}
                
                variant="primary"
                padding="1.5rem 1rem"
            />
        </div>

        <form class="reload" method="POST" action="?/reload" onsubmit="{handleReload}">
            <Button text="&#x27F3;" fontSize="2rem" type="submit"/>
        </form>    
    </div>
    
    <search class="search-container">
        <label class="no-margin" for="search">Buscar:</label>
        <Input id="search" name="search" placeholder="Escribe para buscar..." bind:value={searchTerm}/>
    </search>

    {#if displayedFeed.length > 0 }
        <div class="feed">
            <Feed feed={displayedFeed}/>
        </div>
    {:else}
        <p>No se encontraron feeds</p>
    {/if}

    <!-- <pre>{JSON.stringify(feed, null, 2)}</pre> -->
    
</section>

<style>
    label {
        font-weight: bold;
    }
    .feed {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
        gap: 2rem;
        padding: 2rem 0;
    }
    .container {
        margin: 4rem auto;
    }
    .order {
        display: grid;
        grid-template-columns: 2fr 1fr auto;
        grid-template-rows: auto auto;
        column-gap: 10rem;
        align-items: center;
    }
    .link-label {
        grid-column: 1;
        grid-row: 1;
    }
    .link {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        grid-column: 1;
        grid-row: 2;
    }
    .filter-label {
        grid-column: 2;
        grid-row: 1;
    }
    .filter {
        grid-column: 2;
        grid-row: 2;
    }
    .reload {
        grid-column: 3;
        grid-row: 2;
        justify-self: right;
    }
    .search-container {
        margin-top: 2rem;
    }
</style>