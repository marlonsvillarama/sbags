<script>
    import { CurrentEmployee, Employees } from "../../store/resources";

    import Button from "../shared/Button.svelte";
    import EmployeeList from "./employee/EmployeeList.svelte";
    import EmployeeInfoForm from './employee/EmployeeInfoForm.svelte';
    import EmployeeViewSchedule from './employee/EmployeeViewSchedule.svelte';
    import EmployeePtoList from "./employee/EmployeePTOList.svelte";
    import EmployeePtoForm from "./employee/EmployeePTOForm.svelte";

    let pages = [
        { name: 'list',         title: 'Employees',             component: EmployeeList },
        { name: 'form',         title: 'Employee Info',         component: EmployeeInfoForm },
        { name: 'schedule',     title: 'Employee Schedule',     component: EmployeeViewSchedule },
        { name: 'timeoffs',     title: 'Time Offs',             component: EmployeePtoList },
        { name: 'ptoform',      title: 'Create New Time Off',   component: EmployeePtoForm }
    ]
    let showBackToList = false

    const loadComponent = (page) => {
        let filtered = pages.filter(p => p.name == page)
        return filtered.length > 0 ? filtered[0] : null
    }
    let selectedPage = loadComponent('list')

	const navigate = (page) => {
        selectedPage = loadComponent(page)
	}

    const handleAction = (data) => {
        showBackToList = true
        console.log(`SettingEmployees data==>`, data)
        switch(data.action) {
            case 'navigate': {
                navigate(data.page)
                if (data.page == 'form' || data.page == 'ptoform') {
                    showBackToList = false
                }
                break;
            }
            /* case 'form': {
                showBackToList = false
                break
            } */
            // case 'cancel':
            case 'update': {
                navigate('list')
                break;
            }
            default: break;
        }
    }

    const navigateToCreate = () => {
        $CurrentEmployee = null
        handleAction({
            action: 'navigate',
            page: 'form'
        })
    }
</script>

<div class="header">
   <div class="header-title">
        <span class="title">{selectedPage.title}</span>
    </div>
    
    {#if selectedPage.name == 'list'}
        <Button label="Create new employee" icon="user-plus" type="cta" on:mouseup={navigateToCreate}></Button>
    {:else if selectedPage.name == 'schedule' || showBackToList}
        <Button label="Back to Employees" icon="arrow-left" on:mouseup={(e)=>handleAction({action:'navigate',page:'list'})}></Button>
    {/if}
</div>

<svelte:component this={selectedPage.component} on:action={(e) => handleAction(e.detail) } />

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
</style>