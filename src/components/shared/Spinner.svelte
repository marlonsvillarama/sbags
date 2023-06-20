<script>
    import { createEventDispatcher } from "svelte";
    import {
        Circle,
        DoubleBounce,
        Jumper,
        Moon,
        Pulse,
        Stretch,
        SyncLoader
    } from 'svelte-loading-spinners'
    
    const icons = [
        { name: 'circle',           component: Circle },
        { name: 'double-bounce',    component: DoubleBounce },
        { name: 'jumper',           component: Jumper },
        { name: 'moon',             component: Moon },
        { name: 'pulse',            component: Pulse },
        { name: 'stretch',          component: Stretch },
        { name: 'sync-loader',      component: SyncLoader }
    ]

    export let icon = ''
    export let size = '24'
    export let label = ''
    export let color = '#FF3E00'
    export let duration = '1s'

    let selectedIcon

    const init = () => {
        let filtered = icon ? icons.filter(i => i.name == icon.toLowerCase()) : [ icons[0] ]
        selectedIcon = filtered.length > 0 ? filtered[0] : icons[0]
    }
    init()
</script>

<div class="spinner">
    <svelte:component this={selectedIcon.component} size={size} color={color} unit="px" duration={duration} />
    {#if label}
        <span>{label}</span>
    {/if}
</div>

<style>
    .spinner {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-strand-red);
        font-weight: 500;
    }
</style>