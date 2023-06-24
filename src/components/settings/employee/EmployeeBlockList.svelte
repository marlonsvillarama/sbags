<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { CurrentBlock, CurrentEmployee } from "../../../store/resources";
    import { db } from "../../../firebase";

    import Button from "../../shared/Button.svelte";
    import EmployeeBlockListRow from "./EmployeeBlockListRow.svelte";

    let blocks = []
    let dispatch = createEventDispatcher()

    const updateList = async () => {
        blocks = []
        let doc = await db.collection('employees').doc($CurrentEmployee['id']).get()
        if (doc.exists) {
            let data = doc.data()
            CurrentEmployee.update(e => data)
            blocks = data['blocked']
        }
    }

    const handleNew = () => {
        CurrentBlock.update(e => {
            return {}
        })
        console.log(`EmployeeBlockList handleNew CurrentBlock`, $CurrentBlock)
        dispatch('action', {
            action: 'navigate',
            page: 'form'
        })
    }

    const handleAction = (data) => {
        console.log(`EmployeeBlockList handleAction`, data)
        if (data.action == 'delete') {
            updateList()
        }
        else {
            dispatch('action', { ...data })
        }
    }

    const init = () => {
        blocks = $CurrentEmployee['blocked'] || []
        if (blocks) {
            blocks = blocks.sort((a, b) => a.frequency.toLowerCase() > b.frequency.toLowerCase() ? 1 : -1)
        }
    }

    onMount(() => {
        init()
    })
</script>

<div class="container">
    <div class="table">
        <div class="header">
            <span class="tbl-title">Blocked times - {$CurrentEmployee['uid']}</span>
            <Button type="cta" label="New blocked time" on:mouseup={handleNew} />
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
    }
    .tbl-title {
        color: var(--font-color-gray-med);
        font-size: 1.25rem;
        font-weight: 700;
    }
    .table {
        width: 100%;
    }
</style>