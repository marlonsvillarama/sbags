<script>
    import { createEventDispatcher } from "svelte";
    import { onDestroy } from "svelte";
    import { db } from "../../../firebase";
    import { doc, setDoc } from 'firebase/firestore'
    import { CurrentEmployee, Employees } from "../../../store/resources";
    
    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/Checkbox.svelte";
    import FormField from "../../shared/FormField.svelte";
    import Modal from "../../shared/Modal.svelte";

    console.log(`EmployeeUpdateInfo CurrentEmployee`, $CurrentEmployee)
    let dispatch = createEventDispatcher()
    let isDirty = false
    let employeeName = $CurrentEmployee ? $CurrentEmployee.uid : ''
    let employeeActive = $CurrentEmployee ? $CurrentEmployee.active : true
    let employeeHours = 20

    const handleUpdate = async () => {
        $CurrentEmployee = {
            ...$CurrentEmployee,
            uid: employeeName,
            active: employeeActive,
            maxhours: employeeHours
        }
        console.log(`EmployeeUpdateInfo handleUpdate CurrentEmployee`, $CurrentEmployee)

        await setDoc(doc(db, 'employees', $CurrentEmployee.id), { ...$CurrentEmployee })
        dispatch('update', { dirty: false })
    }

    const handleCancel = () => {
        dispatch('cancel', { dirty: isDirty })
    }

    const makeDirty = () => {
        isDirty = true
    }
</script>

<div class="form">
    <FormField label="Employee name" required>
        <input bind:value={employeeName} type="text" id="employeeName" name="employeeName" on:change={makeDirty} placeholder="Employee name..." />
    </FormField>
    <FormField label="Active">
        <Checkbox bind:checked={employeeActive} on:check={makeDirty} on:uncheck={makeDirty} />
    </FormField>
    <FormField label="Hours per week" required>
        <div class="quantity">
            <input bind:value={employeeHours} min="1" max="40" type="number" on:change={makeDirty} />
        </div>
    </FormField>
    <div class="actions">
        <Button label="Create Employee" type="cta" on:mouseup={handleUpdate} />
        <Button label="Cancel" />
    </div>
</div>

<style>
    .form {
        /* border: 1px solid red; */
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
        padding-top: 5rem;
    }
</style>