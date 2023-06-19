<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Text'
    export let required = false
    export let value = ''
    export let error = 'This field is required.'

    let labelClass = `fld-label ${required ? 'required' : ''}`
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <input bind:value={value} type="text" on:change />
    {#if required && !value}
        <span class="fld-error">{error}</span>
    {/if}
</div>
