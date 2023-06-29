<script>
    import { createEventDispatcher } from "svelte";

    import Button from "../../shared/Button.svelte";
    import Modal from "../../shared/Modal.svelte";
    import Spinner from "../../shared/Spinner.svelte";

    export let employee = {}

    let btnId = `delete-${employee ? employee.id : ''}`
    let spinnerId = `spinner-${employee ? employee.id : ''}`
    let btnDelete
    let doDelete = false
    let title = ''

    let dispatch = createEventDispatcher()
    const showModal = () => {
        console.log('showModal employee', employee)
        if (!employee.uid) {
            return
        }

        title = `Delete employee '${employee.uid}'`
        dialog.show()
    }

    const handleConfirm = () => {
        dialog.hide()
        doDelete = true
        dispatch('delete', {
            id: employee.id
        })
    }

    let dialog
</script>

{#if doDelete}
    <Spinner icon="pulse" id={spinnerId} label="Deleting..." />
{:else}
    <Button bind:this={btnDelete} id={btnId} title="Delete employee" icon="trash" type="icon" on:mouseup={showModal} />
{/if}

<Modal bind:this={dialog} type='confirm' on:confirm={handleConfirm}>
    <span slot="header">{title}</span>
    <span slot="content">Are you sure you want to delete this employee? This operation cannot be undone.</span>
</Modal>
