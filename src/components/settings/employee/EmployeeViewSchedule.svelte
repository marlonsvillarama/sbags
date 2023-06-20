<script>
    import { createEventDispatcher } from "svelte";
    import { db } from "../../../firebase";
    import { doc, setDoc } from 'firebase/firestore'
    import { CurrentEmployee, Employees } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/form/Checkbox.svelte";
    import EmployeeBlockList from "./EmployeeBlockList.svelte";

    let dispatch = createEventDispatcher()
    const handleUpdate = () => {
        dispatch('action', { action: 'update' })
    }

    const handleCancel = () => {
        dispatch('action', { action: 'cancel' })
    }
</script>

<div class="form">
    <span>Employee Schedule</span>

    <!-- <EmployeeBlockList data={$CurrentEmployee.blocked} /> -->

    <div class="actions">
        <Button label="Save" type="cta" on:mouseup={handleUpdate} />
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