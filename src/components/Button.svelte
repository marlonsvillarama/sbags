<script>
    import { createEventDispatcher } from "svelte";
	import {
        AlertCircleIcon,
        ArrowLeftIcon,
        CalendarIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        ClockIcon,
        CoffeeIcon,
        CopyIcon,
        SettingsIcon,
        UserIcon,

        UsersIcon

    } from "svelte-feather-icons";

    export let icon = ''
    export let type = 'button'
    export let label = ''

    const icons = [
        { name: 'alert-circle',     component: AlertCircleIcon },
        { name: 'arrow-left',       component: ArrowLeftIcon },
        { name: 'calendar',         component: CalendarIcon },
        { name: 'chevron-left',     component: ChevronLeftIcon },
        { name: 'chevron-right',    component: ChevronRightIcon },
        { name: 'clock',            component: ClockIcon },
        { name: 'coffee',           component: CoffeeIcon },
        { name: 'copy',             component: CopyIcon },
        { name: 'settings',         component: SettingsIcon },
        { name: 'user',             component: UserIcon },
        { name: 'users',            component: UsersIcon }
    ]

    let selectedIcon
    let buttonClass = ''

    const init = () => {
        buttonClass = `button ${ type == 'button' ? 'btn-def' : 'btn-icon' }`

        if (!icon) {
            return
        }

        let filtered = icon ? icons.filter(i => i.name == icon.toLowerCase()) : [ icons[0] ]
        selectedIcon = filtered.length > 0 ? filtered[0] : icons[0]
    }
    init()

    let dispatch = createEventDispatcher()
    const onMouseUp = () => {
        dispatch('mouseup', {})
    }
</script>

<div class={buttonClass} on:mouseup={onMouseUp}>
    {#if icon}
        <svelte:component this={selectedIcon.component} size={ label ? "20" : "24" } />
    {/if}
    {label}
</div>

<style>
    .button {
        border-width: 0px;
        outline: 0;
        border-top-left-radius: var(--btn-border-radius);
        border-top-right-radius: var(--btn-border-radius);
        border-bottom-left-radius: var(--btn-border-radius);
        border-bottom-right-radius: var(--btn-border-radius);
        /* border-radius: 0.3125rem; */
        font-size: 1rem;
        font-weight: 500;
        padding: 0.8125rem 1rem;
        /* padding: 1rem 1.75rem; */
        cursor: pointer;
        transition: all .1s ease-in-out;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-strand-red);
    }
    .btn-def {
        background-color: var(--color-btn-default);
        color: var(--color-strand-red);
    }
    .btn-def:hover {
        background-color: var(--color-strand-red-full);
        /* background-color: var(--color-btn-default-hover); */
        color: white;
    }
    .btn-icon {
        padding: 0.8125rem 1rem;
        background-color: white;
        color: var(--color-strand-red);
    }
    .btn-icon:hover {
        /* background-color: var(--color-strand-red-full); */
        background-color: var(--color-btn-default-hover);
        /* color: white; */
    }
    .btn-action {
        background-color: var(--color-strand-red);
        color: white;
    }
    .btn-action:hover {
        background-color: var(--color-strand-red-full);
    }
</style>