<script>
    import { createEventDispatcher } from "svelte";
    import { db } from "../../../firebase";
    import { Employees } from "../../../store/resources";

    import EmployeeListRow from "./EmployeeListRow.svelte";
    import Modal from "../../shared/Modal.svelte";

    let dispatch = createEventDispatcher()
    let modalDialog
    console.log(`EmployeeList Employees ==>`, $Employees)

    const handleConfirm = () => {}

    const handleCancel = () => {}

    const handleAction = (data) => {
        console.log(`EmployeeList handleAction data==>`, data)
        dispatch('action', { ...data })
    }
</script>

<div class="table">
    <div class="tbl-header">
        <span>Name</span>
        <span>Active</span>
        <span>Actions</span>
        <span></span>
    </div>
    <div class="content">
        {#each $Employees as employee}
            <EmployeeListRow employee={employee} on:action={(e) => handleAction(e.detail)} />
        {/each}
    </div>
</div>

<Modal bind:this={modalDialog}
    on:confirm={()=>handleConfirm()}
    on:cancel={()=>handleCancel()}
/>

<style>
    .table {
        width: 100%;
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