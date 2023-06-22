<script>
    export let employee
    
    import { createEventDispatcher } from "svelte";
    import { db } from "../../../firebase";
    import { CurrentEmployee, Employees } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/form/Checkbox.svelte";
    import EmployeeDeleteButton from "./EmployeeDeleteButton.svelte";

    let dispatch = createEventDispatcher()
    let employees = $Employees

    const getEmployee = (id) => {
        let empFiltered = employees.filter(e => e.id == id);
        let empToDelete = empFiltered.length > 0 ? empFiltered[0] : null

        return empToDelete
    }

    const toggleEmployee = async (id, toggle) => {
        let emp = getEmployee(id)
        if (!emp) {
            return
        }
        
        await db.collection('employees').doc(emp.id).update({ active:toggle })
        emp.active = true
        Employees.update(value=>employees)
      }

    const deleteEmployee = async (id) => {
        let emp = getEmployee(id)
        if (!emp) {
            return
        }

        await db.collection('employees').doc(emp.id).delete()
        Employees.update(value=>employees.filter(e=>e.id != emp.id))
        dispatch('action', {
            action: 'delete'
        })
    }

    const showUpdateInfo = (id) => {
        CurrentEmployee.update(e => $Employees.filter(emp => emp.id == id)[0])
        dispatch('action', {
            action: 'navigate',
            page: 'info'
        })
        dispatch('action', {
            action: 'form'
        })
    }

    const showSchedule = (id) => {
        CurrentEmployee.update(e => $Employees.filter(emp => emp.id == id)[0])
        dispatch('action', {
            action: 'navigate',
            page: 'schedule'
        })
    }
</script>

<div class="row">
    <span>{employee.uid}</span>
    <span>
        <Checkbox bind:checked={employee.active} on:change={e=>toggleEmployee(employee.id, e.detail.checked)} />
    </span>
    <div class="emp-actions">
        <Button label="Update info" icon="edit" type="icon" on:mouseup={()=>showUpdateInfo(employee.id)} />
        <Button label="View schedule" icon="calendar" type="icon" on:mouseup={()=>showSchedule(employee.id)} />
    </div>

    <EmployeeDeleteButton employee={employee} on:delete={()=>deleteEmployee(employee.id)} />
</div>

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