<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Field'
    export let required = false

    let labelClass = `fld-label ${required ? 'required' : ''}`
</script>

<div class="fld">
    <span class={labelClass}>{label}</span>
    <slot />
</div>

<style>
    .fld {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 20rem;
    }
    .fld-label {
        font-size: 1.25rem;
        font-weight: 500;
        color: var(--font-color-gray-med);
    }
    .fld-label.required::after {
        content: ' - (Required)'
    }
</style>