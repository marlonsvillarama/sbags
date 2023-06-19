<script>
    export let employee
    
    import { createEventDispatcher } from "svelte";
    import { db } from "../../../firebase";
    import { CurrentEmployee, Employees } from "../../../store/resources";
    import { modalText, modalTitle, modalType } from "../../../store/modal";

    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/Checkbox.svelte";
    import EmployeeDeleteButton from "./EmployeeDeleteButton.svelte";

    let dispatch = createEventDispatcher()
    let employees = []

    const getEmployee = (id) => {
        let empFiltered = $Employees.filter(e => e.id == id);
        let empToDelete = empFiltered.length > 0 ? empFiltered[0] : null
        console.log(`SettingsEmployees empToDelete, id==>${id}`, empToDelete)

        return empToDelete
    }

    const toggleEmployee = async (id, toggle) => {
        let emp = getEmployee(id)
        if (!emp) {
            modalTitle.update(e=>'An error has occured')
            modalText.update(e=>'Error retrieving employee. Click "Close" to exit this window.')
            modalType.update(e=>'alert')

            return
        }
        
        const res = await db.collection('employees').doc(emp.id).update({active:toggle})
        emp.active = true
        Employees.update(value=>employees)
    }

    const showUpdateInfo = (id) => {
        CurrentEmployee.update(e => $Employees.filter(emp => emp.id == id)[0])
        dispatch('action', {
            action: 'navigate',
            page: 'info'
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
        <Checkbox bind:checked={employee.active}
            on:check={e=>toggleEmployee(employee.id, true)}
            on:uncheck={e=>toggleEmployee(employee.id, false)} />
    </span>
    <div class="emp-actions">
        <Button label="Update info" icon="edit" type="icon" on:mouseup={()=>showUpdateInfo(employee.id)} />
        <Button label="View schedule" icon="calendar" type="icon" on:mouseup={()=>showSchedule(employee.id)} />
    </div>
    <EmployeeDeleteButton employee={employee} on:modal={e=>showModal(e.detail)} />
</div>

<style>
    .row {
        padding: 0.5rem 0 0.5rem;
        color: var(--font-color-gray-med);
        display: flex;
        flex-direction: row;
        align-items: center;
        /* justify-content: space-between; */
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