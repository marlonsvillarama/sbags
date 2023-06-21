<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { CurrentEmployee } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import EmployeeBlockListRow from "./EmployeeBlockListRow.svelte";

    let blocks = []

    const handleAction = (data) => {}

    onMount(() => {
        blocks = $CurrentEmployee['blocked']
        blocks = blocks.sort((a, b) => a.frequency.toLowerCase() > b.frequency.toLowerCase() ? 1 : -1)
    })
</script>

<div class="container">
    <div class="table">
        <div class="header">
            <span class="tbl-title">Blocked times</span>
            <Button type="cta" label="New blocked time" />
        </div>
        <div class="content">
            {#each blocks as block}
                <EmployeeBlockListRow block={block} on:action={(e)=>handleAction(e.detail)} />
            {/each}
        </div>
    </div>
</div>

<style>
    .container {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        border-radius: 0.5rem;
        padding: 1rem 1.25rem;
    }
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
        border-bottom: 3px solid var(--color-hairline);
        /* background-color: #CFCFCF; */
    }
    .tbl-title {
        color: var(--font-color-gray-med);
        font-size: 1.25rem;
        font-weight: 700;
    }
    .table {
        width: 100%;
        /* border: 1px solid red; */
    }
    .tbl-header {
        padding: 0.5rem 0 0.5rem;
        color: var(--font-color-gray-med);
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .tbl-header {
        font-weight: 700;
        border-bottom: 3px solid var(--color-hairline);
    }
</style>