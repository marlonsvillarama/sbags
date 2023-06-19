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
    let employeeHours = 20
    let ctaLabel = `${$CurrentEmployee.id ? 'Update' : 'Create'} Employee`

    const handleUpdate = async () => {
        $CurrentEmployee = {
            ...$CurrentEmployee,
            uid: employeeName,
            active: employeeActive,
            maxhours: employeeHours
        }
        console.log(`EmployeeUpdateInfo handleUpdate CurrentEmployee`, $CurrentEmployee)

        await setDoc(doc(db, 'employees', $CurrentEmployee.id), { ...$CurrentEmployee })

        $Employees.update(list => {
            let current = list.filter(e => e.id == $CurrentEmployee.id)
            if (current.length <= 0) {
                list.push({ ...$CurrentEmployee })
            }
            current = {
                ...$CurrentEmployee,
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

    const handleCancel = () => {
        dispatch('action', {
            action: 'cancel',
            dirty: isDirty
        })
    }

    const makeDirty = () => {
        isDirty = true
    }
</script>

<div class="form">
    <InputText label="Employee name" required bind:value={employeeName} on:change={makeDirty} />
    <InputCheckbox label="Is Active" bind:checked={employeeActive} on:check={makeDirty} on:uncheck={makeDirty} />
    <InputNumber label="Hours per week" required bind:value={employeeHours} min=1 max=40 on:change={makeDirty} />

    <div class="actions">
        <Button label={ctaLabel} type="cta" on:mouseup={handleUpdate} />
        <Button label="Cancel" on:mouseup={handleCancel} />
    </div>
</div>

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