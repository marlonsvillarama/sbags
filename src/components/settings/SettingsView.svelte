<script>
	import { navigate, Route, Router } from 'svelte-routing'
    import Sidebar from "./SettingsSidebar.svelte";
    import SettingEmployees from './SettingEmployees.svelte';
    import SettingHours from './SettingHours.svelte';
    import SettingTimeOffs from './SettingTimeOffs.svelte';

    const pages = [
        { name: 'employees',            component: SettingEmployees },
        { name: 'hours',                component: SettingHours },
        // { name: 'time offs',            component: SettingTimeOffs }
    ]

    const loadComponent = (page) => {
        let filtered = pages.filter(p => p.name == page)
        console.log(filtered)
        return filtered.length > 0 ? filtered[0] : pages[0]
    }
    let selectedPage = loadComponent('employees')
    
	const changePage = (page) => {
        console.log('SettingsView changePage route', page)
        selectedPage = loadComponent(page)
	}
</script> 

<div class="container">
    <Sidebar on:change={(e)=>changePage(e.detail.page)}/>
    <div class="content">
        <svelte:component this={selectedPage.component}
            on:updateinfo={()=>changePage('employee-info')}
            on:viewschedule={()=>changePage('employee-schedule')}
        />
    </div>
</div>

<style>
    .container {
        margin-top: 1rem;
        padding: 1.5rem 0 2rem;
        border-top: 1px solid var(--color-hairline);
        display: flex;
        flex-direction: row;
        gap: 3rem;
    }
    .content {
        /* border: 1px solid red; */
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
    }
    .content .title {
        font-weight: 700;
        font-size: 1.5rem;
        text-transform: capitalize;
    }
</style>