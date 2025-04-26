<script>
    export let name;
</script>

<article class="category"> <!-- onclick="window.location.href='#';" -->
    <p>{name}</p>
</article>

<style>
    article {
        background: var(--primary);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    p {
        font-size: 1.2rem;
        color: var(--lightGray);
        padding: 0.5rem 1rem;
        margin: 0;
    }
</style>