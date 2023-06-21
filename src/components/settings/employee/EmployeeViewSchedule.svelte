<script>
    import { createEventDispatcher, onMount } from "svelte";
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

    onMount(() => {})
</script>

<div class="form">
    <EmployeeBlockList />
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