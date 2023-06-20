<script>
    import { createEventDispatcher } from "svelte";
    // import { modalData,  modalText, modalTitle, modalType } from "../../../store/modal";
    // import { ModalData } from "../../../store/modal";

    import Button from "../../shared/Button.svelte";
    import Modal from "../../shared/Modal.svelte";
    import Spinner from "../../shared/Spinner.svelte";

    export let employee = {}

    let btnId = `delete-${employee ? employee.id : ''}`
    let btnDelete
    let doDelete = false
    let title = ''

    let dispatch = createEventDispatcher()
    const showModal = () => {
        console.log('showModal employee', employee)
        if (!employee.uid) {
            return
        }

        // modalText.update(e => `Are you sure you want to delete this employee? This operation cannot be undone.`)
        // modalTitle.update(e => `Delete employee '${employee.uid}'`)
        // modalType.update(e => 'confirm')

        // title = `Delete employee '${employee.uid}'`
        // console.log('showing modal', employee.uid)
        dialog.show()
        /* dispatch('click', {
            action: 'delete',
            id: employee.id,
            name: employee.uid
        }) */
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
    <Spinner icon="pulse" label="Deleting..." />
{:else}
    <Button bind:this={btnDelete} id={btnId} label="Delete employee" icon="trash" type="icon" on:mouseup={showModal} />
{/if}

<Modal bind:this={dialog} type='confirm' on:confirm={handleConfirm}>
    <span slot="header">{title}</span>
    <span slot="content">Are you sure you want to delete this employee? This operation cannot be undone.</span>
</Modal>

<style></style>