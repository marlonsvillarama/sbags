<script>
    export let pto
    
    import { createEventDispatcher, onMount } from "svelte";
    import { db } from "../../../firebase";
    import { TimeOffs } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Modal from "../../shared/Modal.svelte";

    let dialog
    let dispatch = createEventDispatcher()
    let timeOffs = $TimeOffs
    let timeOffId

    const parseDateTime = (value) => {
        if (!value || isNaN(value)) {
            return null
        }

        let dt = value.toDate()
        let dateString = dt.toLocaleDateString('en-us', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        let dateParts = dateString.split(', ')
        let hour = dt.getHours()
        
        return {
            day: dateParts[0],
            date: dateParts[1],
            year: dateParts[2],
            time: `${hour > 12 ? hour - 12 : hour}:${dt.getMinutes().toString().padStart(2, '0')}`,
            ampm: hour >= 12 ? 'PM' : 'AM'
        }
    }

    const showModal = (id) => {
        if (!id) {
            return
        }

        timeOffId = id
        dialog.show()
    }

    const deletePTO = async (id) => {
        await db.collection('timeoffs').doc(pto.id).delete()
        TimeOffs.update(value=>timeOffs.filter(e=>e.id != pto.id))
        dispatch('action', {
            action: 'delete'
        })
    }

    const handleConfirm = () => {
        dialog.hide()
        deletePTO(timeOffId)
    }

    let dateText = null
    const init = () => {
        dateText = pto.date.toDate().toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    onMount(() => {
        init()
    })
</script>

<div class="row">
    <span>{dateText}</span>
    <div class="emp-actions">
        <Button label="Delete" icon="trash" title="Delete" type="icon" on:mouseup={()=>showModal(pto.id)} />
    </div>

    <!-- <EmployeeDeleteButton employee={employee} on:delete={()=>deleteEmployee(employee.id)} /> -->
</div>

<Modal bind:this={dialog} type='confirm' on:confirm={handleConfirm}>
    <span slot="header">Delete employee time off</span>
    <span slot="content">Are you sure you want to delete this time off? This operation cannot be undone.</span>
</Modal>

<style>
    .row {
        padding: 0.5rem 0 0.5rem;
        color: var(--font-color-gray-med);
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .row > span:first-child {
        flex: 0 0 20rem;
    }
    .row > :nth-child(2) {
        flex: 0 0 10rem;
    }
    .row > :nth-child(3) {
        flex: 1;
    }
    .row > :last-child {
        flex: 0 0 auto;
    }
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