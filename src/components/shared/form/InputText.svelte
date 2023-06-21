<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Text'
    export let required = false
    export let value = ''
    export let error = 'This field is required.'
    export let dirty = false

    let dispatch = createEventDispatcher()
    let labelClass = `fld-label ${required ? 'required' : ''}`

    export const checkDirty = () => {
        dirty = (required && !value)
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
    <input required={required} bind:value={value} type="text" on:change={handleChange} />
    {#if dirty}
        <span class="fld-error">{error}</span>
    {/if}
</div>
