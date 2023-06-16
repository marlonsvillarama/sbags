<script>
    import { createEventDispatcher } from "svelte";

    export let data = []
</script>

<div class="table">
    <div class="header">
        <span>Name</span>
        <span>Actions</span>
    </div>
    <div class="content">
        content
    </div>
</div>
<style>
    .table {
        width: 100%;
        /* border: 1px solid red; */
    }
    .header {
        padding: 0.5rem 0 0.75rem;
        border-bottom: 2px solid var(--color-hairline);
        color: var(--font-color-gray-med);
        font-weight: 700;
        display: flex;
        flex-direction: row;
        align-items: center;
        /* justify-content: space-between; */
    }
    .header > span:first-child {
        flex: 1;
    }
    .header > span:last-child {
        flex: 0 0 30rem;
    }
    .content {
        padding: 1rem 0;
    }
</style>