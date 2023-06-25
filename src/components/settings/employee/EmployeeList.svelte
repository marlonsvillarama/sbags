<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { collectionData } from 'rxfire/firestore'
    import { db } from "../../../firebase";
    import { startWith } from 'rxjs/operators'
    import { Employees } from "../../../store/resources";

    import EmployeeListRow from "./EmployeeListRow.svelte";

    let dispatch = createEventDispatcher()
    let employees = []

    const updateList = () => {
        let dbquery = db.collection('employees')
            .orderBy('uid')
        collectionData(dbquery, { idField: 'id' }).pipe(startWith([]))
            .subscribe(results => {
                employees = results
                employees = employees.sort((a, b) => (a.uid.toLowerCase() > b.uid.toLowerCase()) ? 1 : -1)
                Employees.update(e => employees)
            })
    }

    const handleAction = (data) => {
        console.log(`EmployeeList handleAction ==>`, data)
        if (data.action == 'update' || data.action == 'delete') {
            updateList()
        }

        dispatch('action', { ...data })
    }
    
    onMount(() => {
        updateList()
    })
</script>

<div class="table">
    <div class="tbl-header">
        <span>Name</span>
        <span>Active</span>
        <span>Actions</span>
        <span></span>
    </div>
    <div class="content">
        {#each employees as employee}
            <EmployeeListRow employee={employee} on:action={(e)=>handleAction(e.detail)} />
        {/each}
    </div>
</div>

<style>
    .table {
        width: 100%;
        /* box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        border-radius: 0.5rem; */
        /* padding: 1rem 1.25rem; */
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
    .tbl-header > span:first-child {
        flex: 0 0 20rem;
    }
    .tbl-header > *:nth-child(2) {
        flex: 0 0 10rem;
    }
    .tbl-header > span:nth-child(3) {
        flex: 1;
    }
    .tbl-header > span:last-child {
        flex: 0 0 auto;
    }
</style>