<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Text'
    export let required = false
    export let value = ''
    export let error = 'This field is required.'

    let labelClass = `fld-label ${required ? 'required' : ''}`
    let isDirty = false

    const handleChange = () => {
        if (required && !value) {
            isDirty = true
        }
    }

    export const setDirty = () => {
        isDirty = true
    }
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <input required={required} bind:value={value} type="text" on:change={handleChange} />
    {#if isDirty}
        <span class="fld-error">{error}</span>
    {/if}
</div>
