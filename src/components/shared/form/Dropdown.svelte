<script>
    import { createEventDispatcher } from "svelte";

    export let label = 'Text'
    export let required = false
    export let value = ''
    export let error = 'This field is required.'
    export let dirty = false
    export let items = []

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
    <div class="fld-select">
        <select required={required} bind:value={value} on:change={handleChange}>
            {#each items as item}
                <option value={item.value}>{item.text}</option>
            {/each}
        </select>
        <div class="arrow"></div>
    </div>
</div>

<style>
    .fld-select {
        width: 30rem;
    }
    .fld-select select,
    .fld-select option {
        border: 1px solid var(--color-hairline);
        border-radius: 0.3125rem;
        outline: 0;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        color: var(--font-color-gray-med);
    }
    .fld-select {
        /* border: 1px solid red; */
        position: relative;
        /* display: inline-block; */
    }
    .fld-select select {
        width: 100%;
    }
    .fld-select .arrow {
        position: absolute;
        height: 100%;
        width: 24px;
        top: 0;
        right: 0;
        background-color: var(--color-strand-red);
        border-top-right-radius: 0.3125rem;
        border-bottom-right-radius: 0.3125rem;
        pointer-events: none;
    }
    /* .fld-select select:focus + .arrow,
    .fld-select select:hover + .arrow {
        background-color: aliceblue;
    } */
    .fld-select .arrow::before,
    .fld-select .arrow::after {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
        left: 7px;
    }
    .fld-select .arrow::before {
        border-color: transparent transparent transparent transparent;
        border-width: 0 6px 6px 6px;
        top: 20%;
    }
    .fld-select .arrow::after {
        border-color: white transparent transparent transparent;
        border-width: 6px 6px 0 6px;
        bottom: 42%;
    }
    .fld-select select:focus + .arrow::after {
        border-color: transparent transparent white transparent;
        border-width: 0 6px 6px 6px;
        top: 42%;
    }
</style>