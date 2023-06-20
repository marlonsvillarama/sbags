<script>
    export let label = 'Number'
    export let required = false
    export let min = 0
    export let max = 100
    export let value = min
    export let error = 'This field is required.'

    let labelClass = `fld-label ${required ? 'required' : ''}`
    let isDirty = false

    const handleChange = () => {
        if (required && (value == '' || value == null || value == undefined)) {
            isDirty = true
        }
    }

    export const setDirty = () => {
        isDirty = true
    }
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <input bind:value={value} min={min} max={max} type="number" on:change={handleChange} />
    {#if isDirty}
        <span class="fld-error">{error}</span>
    {/if}
</div>