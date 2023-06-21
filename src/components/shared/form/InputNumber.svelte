<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Number'
    export let required = false
    export let min = 0
    export let max = 100
    export let value = min
    export let error = 'This field is required.'
    export let dirty = false

    let dispatch = createEventDispatcher()
    let labelClass = `fld-label ${required ? 'required' : ''}`

    export const checkDirty = () => {
        dirty = (required && (value == '' || value == null || value == undefined))
    }

    export const isDirty = () => dirty

    const handleChange = () => {
        checkDirty()
        dispatch('change', {
            dirty: dirty
        })
    }

    checkDirty()
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <input bind:value={value} min={min} max={max} type="number" on:change={handleChange} />
    {#if dirty}
        <span class="fld-error">{error}</span>
    {/if}
</div>