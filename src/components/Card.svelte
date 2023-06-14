<script>
    import CardHeader from "./CardHeader.svelte";

    export let title = ''
    export let shadow = false

    let wrapperClass = `card-wrapper${shadow ? ' card-shadow' : ''}`
</script>

<div class={wrapperClass}>
    {#if title}
    <CardHeader title={title} />
    {/if}
    <div class="card-content">
        <slot></slot>
    </div>
</div>

<style>
    .card-wrapper {
        border: 1px solid var(--border-gray-lite);
        /* border: 1px solid var(--border-strand-red); */
        border-radius: 0.5rem;
        background-color: white;
    }
    .card-shadow {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;;
    }
    .card-content {
        padding: 1rem 2rem;
    }
</style>