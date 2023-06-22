<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Text'
    export let required = false
    export let value = ''
    export let error = 'This field is required.'
    export let dirty = false
    export let time = false

    let dispatch = createEventDispatcher()
    let labelClass = `fld-label ${required ? 'required' : ''}`

    export const checkDirty = () => {
        dirty = (required && !value)
    }

    export const isDirty = () => dirty

    const handleChange = () => {
        console.log(`InputDate value==>`, value)
        checkDirty()
        dispatch('change', {
            dirty: dirty
        })
    }

    checkDirty()
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    {#if time}
        <input required={required} bind:value={value} type="time" on:change={handleChange} />
    {:else}
        <input required={required} bind:value={value} type="date" on:change={handleChange} />
    {/if}
    {#if dirty}
        <span class="fld-error">{error}</span>
    {/if}
</div>

<style>
    .fld {
        width: 12rem;
        /* border: 1px solid red; */
    }
</style>