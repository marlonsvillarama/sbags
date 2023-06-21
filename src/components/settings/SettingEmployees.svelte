<script>
    import { CurrentEmployee, Employees } from "../../store/resources";

    import Button from "../shared/Button.svelte";
    import EmployeeList from "./employee/EmployeeList.svelte";
    import EmployeeUpdateInfo from './employee/EmployeeInfoForm.svelte';
    import EmployeeViewSchedule from './employee/EmployeeViewSchedule.svelte';

    let pages = [
        { name: 'list',         title: 'Employees',         component: EmployeeList },
        { name: 'info',         title: 'Employee Info',     component: EmployeeUpdateInfo },
        { name: 'schedule',     title: 'Employee Schedule', component: EmployeeViewSchedule }
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
            case 'cancel':
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
            page: 'info'
        })
    }
</script>

<div class="header">
   <div class="header-title">
        <span class="title">{selectedPage.title}</span>
    </div>
    
    {#if selectedPage.name == 'list'}
        <Button label="Create new employee" icon="user-plus" type="cta" on:mouseup={navigateToCreate}></Button>
    {:else}
        <Button label="Back to list" icon="arrow-left" on:mouseup={(e)=>handleAction({action:'navigate',page:'list'})}></Button>
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