<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { db } from "../../../firebase";
    import { doc, setDoc } from 'firebase/firestore'
    import { CurrentEmployee, Employees } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import EmployeeBlockForm from "./EmployeeBlockForm.svelte";
    import EmployeeBlockList from "./EmployeeBlockList.svelte";
    import InputDate from "../../shared/form/InputDate.svelte";

    let dispatch = createEventDispatcher()
    const handleUpdate = () => {
        dispatch('action', { action: 'update' })
    }

    const handleCancel = () => {
        dispatch('action', { action: 'cancel' })
    }

    let pages = [
        { name: 'list',         title: 'Employees',         component: EmployeeBlockList },
        { name: 'form',         title: 'Employee Info',     component: EmployeeBlockForm },
        // { name: 'schedule',     title: 'Employee Schedule', component: EmployeeViewSchedule }
    ]

    const loadComponent = (page) => {
        let filtered = pages.filter(p => p.name == page)
        return filtered.length > 0 ? filtered[0] : null
    }
    let selectedPage = loadComponent('list')

	const navigate = (page) => {
        selectedPage = loadComponent(page)
        if (page != 'list') {
            dispatch('action', {
                action: 'form'
            })
        }
	}

    const handleAction = (data) => {
        console.log(`EmployeeSchedule handleAction==>`, data)
        switch(data.action) {
            case 'navigate': {
                navigate(data.page)
                break;
            }
            case 'form': {
                dispatch('action', {
                    action: 'form'
                })
                break
            }
            case 'cancel':
            case 'update': {
                navigate('list')
                break;
            }
            default: break;
        }
    }

    /* const navigateToCreate = () => {
        $CurrentEmployee = null
        handleAction({
            action: 'navigate',
            page: 'info'
        })
    } */
</script>

<div class="form">
    <svelte:component this={selectedPage.component} on:action={(e) => handleAction(e.detail) } />
</div>

<style>
    .form {
        /* padding: 1rem 0; */
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    /* .actions {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: center;
        padding-top: 4rem;
    } */
</style>