<script>
    import { onDestroy } from "svelte";
    import { Employees, DeleteEmployee } from "../store/resources";
    import Button from "./Button.svelte";
    import Modal from "./Modal.svelte";

    let modalDialog = null
    let modalTitle = 'Modal title'
    let modalType = 'alert'
    let modalText = 'Modal text goes here...'
    let operation = 'delete'
    let employees = []
    let employeeID = ''

    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
    })
    onDestroy(() => {
        unsubscribeEmp()
    })

    const showDeleteEmployee = (id) => {
        employeeID = id
        console.log('id = ', id)
        modalTitle = `Delete employee '${id}''`
        modalType = 'confirm'
        modalText = 'Are you sure you want to delete this employee? This operation cannot be undone.'

        let empFiltered = employees.filter(e => e.uid == id);
        let empToDelete = empFiltered.length > 0 ? empFiltered[0] : null
        if (!empToDelete) {
            modalText = 'Error retrieving employee. Click "Close" to exit this window.'
            modalType = 'alert'
            modalDialog.show()
            return
        }

        modalDialog.show()
        console.log('showing modal', id)
    }

    const handleConfirm = () => {
        console.log('modal confirm')
        switch(operation) {
            case 'delete': {
                DeleteEmployee(employeeID)
                break
            }
        }
    }

    const handleCancel = () => {
        console.log('modal cancel')
    }
</script>

<Modal bind:this={modalDialog} title={modalTitle} type={modalType} on:confirm={()=>handleConfirm()} on:cancel={()=>handleCancel()}>
    <div>
        {modalText}
    </div>
</Modal>

<div>

</div>

<div class="table">
    <div class="header">
        <span>Name</span>
        <span>Active</span>
        <span>Actions</span>
        <span></span>
    </div>
    <div class="content">
        {#each $Employees as employee}
            <div class="row">
                <span>{employee.uid}</span>
                <span>{employee.active}</span>
                <div class="emp-actions">
                    <Button label="Update info" icon="edit" />
                    <Button label="View schedule" icon="calendar" />
                </div>
                <Button label="Delete employee" icon="trash" on:mouseup={()=>showDeleteEmployee(employee.uid)} />
            </div>
        {/each}
    </div>
</div>

<style>
    .table {
        width: 100%;
        /* border: 1px solid red; */
    }
    .header, .row {
        padding: 0.5rem 0 0.5rem;
        color: var(--font-color-gray-med);
        display: flex;
        flex-direction: row;
        align-items: center;
        /* justify-content: space-between; */
    }
    .header {
        font-weight: 700;
        border-bottom: 3px solid var(--color-hairline);
    }
    .header > span:first-child,
    .row > span:first-child {
        flex: 0 0 20rem;
    }
    .header > span:nth-child(2),
    .row > span:nth-child(2) {
        flex: 0 0 10rem;
    }
    .header > span:nth-child(3),
    .row > :nth-child(3) {
        flex: 1;
        /* border: 1px solid red; */
    }
    .header > span:last-child,
    .row > :last-child {
        flex: 0 0 auto;
    }
    /* .content {
        padding: 1rem 0;
    } */
    /* .row:hover {
        cursor: pointer;
        background: antiquewhite;
        /* border: 1px solid red; *
    } */
    .row:not(:last-child) {
        border-bottom: 1px solid var(--color-hairline);
    }
    .row > span:first-child {
        padding: 0 0.5rem;
    }
    .emp-actions {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }
</style>