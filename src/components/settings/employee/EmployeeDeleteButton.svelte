<script>
    import { createEventDispatcher } from "svelte";
    import { modalData,  modalText, modalTitle, modalType } from "../../../store/modal";
    import Button from "../../shared/Button.svelte";
    // import Modal from "./Modal.svelte";
    import Spinner from "../../shared/Spinner.svelte";

    export let employee = {}

    let btnId = `delete-${employee ? employee.id : ''}`
    let btnDelete

    let dispatch = createEventDispatcher()
    const showModal = () => {
        console.log('showModal employee', employee)
        if (!employee.uid) {
            return
        }

        modalText.update(e => `Are you sure you want to delete this employee? This operation cannot be undone.`)
        modalTitle.update(e => `Delete employee '${employee.uid}'`)
        modalType.update(e => 'confirm')

        console.log('showing modal', employee.uid)
        dispatch('modal', {
            action: 'delete',
            id: employee.id,
            name: employee.uid
        })
    }
</script>

<Button bind:this={btnDelete} id={btnId} label="Delete employee" icon="trash" type="icon" on:mouseup={showModal} />

<style></style>