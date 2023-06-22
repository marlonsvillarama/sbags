<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { db } from "../../../firebase";
    import { CurrentEmployee } from "../../../store/resources";
    
    import Button from "../../shared/Button.svelte";
    import InputText from "../../shared/form/InputText.svelte";
    import InputCheckbox from "../../shared/form/InputCheckbox.svelte";
    import InputNumber from "../../shared/form/InputNumber.svelte";
    import Modal from "../../shared/Modal.svelte";

    let dispatch = createEventDispatcher()
    let employeeName = $CurrentEmployee ? $CurrentEmployee['uid'] : ''
    let employeeActive = $CurrentEmployee ? $CurrentEmployee['active'] : true
    let employeeHours = $CurrentEmployee ? $CurrentEmployee['maxhours'] : 40
    let ctaLabel = `${$CurrentEmployee ? 'Update' : 'Create'} Employee`
    let isDirty = false
    let dialog
    let dialogTitle = ''
    let dialogContent = ''
    let dialogType = ''
    let inputName
    let inputHours

    const updateEmployee = async () => {
        $CurrentEmployee = {
            ...$CurrentEmployee,
            uid: employeeName,
            active: employeeActive,
            maxhours: employeeHours
        }
        db.collection('employees').doc($CurrentEmployee['id']).set({ ...$CurrentEmployee })

        dispatch('action', {
            action: 'update',
            dirty: false
        })
    }

    const handleUpdate = async () => {
        checkDirty()
        if (isDirty) {
            dialogTitle = 'One or more fields are required.'
            dialogContent = 'Please make sure all required fields are filled out corectly.'
            dialogType = 'alert'
            dialog.show()
            return
        }

        updateEmployee()
    }

    const backToList = () => {
        dispatch('action', {
            action: 'cancel'
        })
        $CurrentEmployee = null
    }

    const handleCancel = () => {
        if (isDirty) {
            dialogTitle = 'Your changes will be lost!'
            dialogContent = 'Are you sure you want to exit this page?'
            dialogType = 'confirm'
            dialog.show()
        }
        else {
            backToList()
        }
    }

    const checkDirty = () => {
        isDirty = (
            inputName.isDirty() ||
            inputHours.isDirty()
        )
        console.log('EmployeeInfoForm checkDirty isDirty ==>', isDirty)
    }

    onMount(() => checkDirty())
</script>

<div id="" class="form">
    <InputText bind:this={inputName} label="Employee name" required bind:value={employeeName} on:change={checkDirty} />
    <InputCheckbox label="Is Active" bind:checked={employeeActive} on:change />
    <InputNumber bind:this={inputHours} label="Hours per week" required bind:value={employeeHours} on:change={checkDirty} />

    <div class="actions">
        <Button label={ctaLabel} type="cta" on:mouseup={handleUpdate} />
        <Button label="Cancel" on:mouseup={handleCancel} />
    </div>
</div>

<Modal bind:this={dialog} type={dialogType} on:confirm={backToList}>
    <span slot="header">{dialogTitle}</span>
    <span slot="content">{dialogContent}</span>
</Modal>

<style>
    .form {
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .actions {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: center;
        padding-top: 4rem;
    }
</style>