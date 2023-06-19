<script>
    export let label = 'Number'
    export let required = false
    export let min = 0
    export let max = 100
    export let value = min
    export let error = 'This field is required.'

    let labelClass = `fld-label ${required ? 'required' : ''}`
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <input bind:value={value} min={min} max={max} type="number" on:change />
    {#if required && (value == '' || value == null || value == undefined)}
        <span class="fld-error">{error}</span>
    {/if}
</div>
