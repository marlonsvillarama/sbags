<script>
    import { createEventDispatcher } from "svelte";
    import { onDestroy, onMount } from "svelte";
    import { CurrentEmployee, Employees } from "../../store/resources";
    import { modalData, modalText, modalTitle, modalType } from "../../store/modal";
    import { db } from "../../firebase";

    import Button from "../shared/Button.svelte";
    import EmployeeList from "./employee/EmployeeList.svelte";
    import EmployeeUpdateInfo from './employee/EmployeeUpdateInfo.svelte';
    import EmployeeViewSchedule from './employee/EmployeeViewSchedule.svelte';
    import Modal from "../shared/Modal.svelte";

    let modalDialog = null
    let employees = []
    let employeeId = ''

    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
    })
    onDestroy(() => {
        unsubscribeEmp()
    })

    const getEmployee = (id) => {
        let empFiltered = employees.filter(e => e.id == id);
        let empToDelete = empFiltered.length > 0 ? empFiltered[0] : null
        console.log(`SettingsEmployees empToDelete, id==>${id}`, empToDelete)

        return empToDelete
    }

    const deleteEmployee = async (id) => {
        let empToDelete = getEmployee(id)
        if (!empToDelete) {
            modalTitle.update(e=>'An error has occured')
            modalText.update(e=>'Error retrieving employee. Click "Close" to exit this window.')
            modalType.update(e=>'alert')

            return
        }
        
        console.log('empToDelete', empToDelete)
        employeeId = empToDelete.id

        let response = await db.collection('employees').doc(id).delete()
        console.log(`deleteEmployee response ==>`, response)
        modalDialog.hide()
    }

    const handleConfirm = () => {
        switch ($modalData.action) {
            case 'delete': {
                deleteEmployee($modalData.id)
                break
            }
            default: break
        }
    }

    const handleCancel = () => {
        modalDialog.hide()
    }

    const showModal = (data) => {
        modalData.update(e=>data)
        modalDialog.show()
    }

    let pages = [
        { name: 'list',         component: EmployeeList },
        { name: 'info',         component: EmployeeUpdateInfo },
        { name: 'schedule',     component: EmployeeViewSchedule }
    ]

    const loadComponent = (page) => {
        let filtered = pages.filter(p => p.name == page)
        return filtered.length > 0 ? filtered[0] : null
    }
    let selectedPage = loadComponent('list')

	const navigate = (page) => {
        selectedPage = loadComponent(page)
	}

    const handleAction = (data) => {
        switch(data.action) {
            case 'navigate': {
                navigate(data.page)
                break;
            }
            default: break;
        }
    }
</script>

<div class="header">
   <div class="header-title">
        <span class="title">Employees</span>
        {#if selectedPage.name != 'list'}
            <ul class="bc">
                <li>Employees</li>
            </ul>
        {/if}
    </div>
    
    {#if selectedPage.name == 'list'}
        <Button label="Create new employee" icon="user-plus" type="cta"></Button>
    {:else}
        <Button label="Back to list" icon="arrow-left" on:mouseup={(e)=>handleAction({action:'navigate',page:'list'})}></Button>
    {/if}
</div>

<svelte:component this={selectedPage.component} on:action={(e) => handleAction(e.detail) } />

<Modal bind:this={modalDialog}
    on:confirm={()=>handleConfirm()}
    on:cancel={()=>handleCancel()}
/>

<style>
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .header-title {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .title {
        font-weight: 700;
        font-size: 1.5rem;
        text-transform: capitalize;
    }
    .header-title ul {
        list-style: none;
    }
</style>