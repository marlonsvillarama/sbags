<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { CurrentEmployee, CurrentPTO, TimeOffs } from "../../../store/resources";
    import { db } from "../../../firebase";
    import { collectionData } from "rxfire/firestore";
    import { startWith } from "rxjs";

    import Button from "../../shared/Button.svelte";
    import EmployeePTOListRow from "./EmployeePTOListRow.svelte";

    let timeOffs = []
    let dispatch = createEventDispatcher()

    const updateList = async () => {
        timeOffs = []
        let dbquery = db.collection('timeoffs')
            .where('employee', '==', $CurrentEmployee['id'])
            // .where('date', '>=', new Date())
            .orderBy('date')
        collectionData(dbquery, { idField: 'id' }).pipe(startWith([]))
            .subscribe(results => {
                console.log(`EmployeePtoList updateList timeOffs==>`, timeOffs)
                timeOffs = results
                timeOffs = timeOffs.sort((a, b) => (a.start_time > b.start_time) ? 1 : -1)
                TimeOffs.update(e => timeOffs)
            })
    }

    const handleNew = () => {
        CurrentPTO.update(e => {
            return {}
        })
        console.log(`EmployeePTOList handleNew CurrentPTO`, $CurrentPTO)
        dispatch('action', {
            action: 'navigate',
            page: 'ptoform'
        })
    }

    const handleAction = (data) => {
        console.log(`EmployeePTOList handleAction`, data)
        if (data.action == 'delete') {
            updateList()
        }
        else {
            dispatch('action', { ...data })
        }
    }

    const init = () => {
        timeOffs = $TimeOffs
        if (timeOffs) {
            timeOffs = timeOffs.sort((a, b) => a.date > b.date ? 1 : -1)
        }
    }

    onMount(() => {
        // init()
        updateList()
    })
</script>

<div class="container">
    <div class="table">
        <div class="header">
            <span class="tbl-title">Time Offs - {$CurrentEmployee['uid']}</span>
            <Button type="cta" label="New time off" on:mouseup={handleNew} />
        </div>
        <div class="content">
            {#each timeOffs as pto}
                <EmployeePTOListRow pto={pto} on:action={(e)=>handleAction(e.detail)} />
            {/each}
        </div>
    </div>
</div>

<style>
    /* .container {
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        border-radius: 0.5rem;
        padding: 1rem 1.25rem;
    } */
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