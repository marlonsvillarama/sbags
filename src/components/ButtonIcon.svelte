<script>
    import { createEventDispatcher } from "svelte";
	import {
        AlertCircleIcon,
        CalendarIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        SettingsIcon,
        UserIcon
    } from "svelte-feather-icons";

    export let icon = 'alert-circle'

    const icons = [
        { name: 'alert-circle',     component: AlertCircleIcon },
        { name: 'calendar',         component: CalendarIcon },
        { name: 'chevron-left',     component: ChevronLeftIcon },
        { name: 'chevron-right',    component: ChevronRightIcon },
        { name: 'settings',         component: SettingsIcon },
        { name: 'user',             component: UserIcon }
    ]

    let selectedIcon = icons[0]
    let filtered = icon ? icons.filter(i => i.name == icon.toLowerCase()) : [ icons[0] ]
    selectedIcon = filtered.length > 0 ? filtered[0] : icons[0]
    // console.log(selectedIcon)

    let dispatch = createEventDispatcher()
    const handleMouseUp = () => {
        dispatch('mouseup', {})
    }
</script>

<button class="button" on:mouseup={handleMouseUp}>
    <svelte:component this={selectedIcon.component} size="20" />
</button>

<style>
    .button {
        display: block;
        background-color: white;
        border: 0;
        border-radius: var(--btn-border-radius);
        color: var(--color-strand-red);
        font-weight: 500;
        padding: 0.8125rem 1rem;
        cursor: pointer;
        transition: all .1s ease-in-out;
    }
    .button:hover {
        background-color: var(--color-strand-red-full);
        color: white;
    }
</style>