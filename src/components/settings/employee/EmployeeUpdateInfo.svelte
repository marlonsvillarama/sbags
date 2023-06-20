<script>
    import { createEventDispatcher } from "svelte";
    import { onDestroy } from "svelte";
    import { db } from "../../../firebase";
    import { doc, setDoc } from 'firebase/firestore'
    import { CurrentEmployee, Employees } from "../../../store/resources";
    
    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/form/Checkbox.svelte";
    import FormField from "../../shared/form/FormField.svelte";
    import InputText from "../../shared/form/InputText.svelte";
    import InputCheckbox from "../../shared/form/InputCheckbox.svelte";
    import InputNumber from "../../shared/form/InputNumber.svelte";
    import Modal from "../../shared/Modal.svelte";

    console.log(`EmployeeUpdateInfo CurrentEmployee`, $CurrentEmployee)
    let dispatch = createEventDispatcher()
    let isDirty = false
    let employeeName = $CurrentEmployee ? $CurrentEmployee.uid : ''
    let employeeActive = $CurrentEmployee ? $CurrentEmployee.active : true
    let employeeHours = $CurrentEmployee ? $CurrentEmployee.maxhours : true
    let ctaLabel = `${$CurrentEmployee ? 'Update' : 'Create'} Employee`
    let dialog
    let dialogTitle = ''
    let dialogContent = ''
    let dialogType = ''

    const updateEmployee = async () => {
        $CurrentEmployee = {
            ...$CurrentEmployee,
            uid: employeeName,
            active: employeeActive,
            maxhours: employeeHours
        }
        console.log(`EmployeeUpdateInfo handleUpdate CurrentEmployee`, $CurrentEmployee)

        await setDoc(doc(db, 'employees', $CurrentEmployee.id), { ...$CurrentEmployee })

        Employees.update(list => {
            let current = list.filter(e => e.id == $CurrentEmployee.id)
            if (current.length <= 0) {
                list.push({ ...$CurrentEmployee })
            }
            current = {
                ...current,
                uid: employeeName,
                active: employeeActive,
                maxhours: employeeHours
            }
            return list
        })
        dispatch('action', {
            action: 'update',
            dirty: false
        })
    }

    const handleUpdate = async () => {
        if (isDirty) {
            dialogTitle = 'One or more fields are required.'
            dialogContent = 'Please make sure all required fields are filled out corectly.'
            dialogType = 'alert'
            dialog.show()
        }
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
    }

    const makeDirty = () => {
        isDirty = true
        console.log(`EmployeeUpdateInfo isDirty ==>`, isDirty)
    }
</script>

<div id="" class="form">
    <InputText label="Employee name" required bind:value={employeeName} on:change={makeDirty} />
    <InputCheckbox label="Is Active" bind:checked={employeeActive} on:check={makeDirty} on:uncheck={makeDirty} />
    <InputNumber label="Hours per week" required bind:value={employeeHours} on:change={makeDirty} />

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