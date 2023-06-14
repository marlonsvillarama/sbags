<script>
    import { createEventDispatcher } from "svelte";
    export let action = false
    export let label = ''

    let buttonClass = `button ${ action == true ? 'btn-action' : 'btn-def' }`

    let dispatch = createEventDispatcher()
    const onMouseUp = () => {
        dispatch('mouseup', {})
    }
</script>

<button class={buttonClass} type='button' on:mouseup={onMouseUp}>{label}</button>

<style>
    .button {
        border-width: 0px;
        outline: 0;
        border-top-left-radius: var(--btn-border-radius);
        border-top-right-radius: var(--btn-border-radius);
        border-bottom-left-radius: var(--btn-border-radius);
        border-bottom-right-radius: var(--btn-border-radius);
        /* border-radius: 0.3125rem; */
        font-size: 1rem;
        font-weight: 500;
        padding: 1rem 1.75rem;
        cursor: pointer;
        transition: all .1s ease-in-out;
    }
    .btn-def {
        background-color: var(--color-btn-default);
        color: var(--color-strand-red);
    }
    .btn-def:hover {
        background-color: var(--color-strand-red-full);
        /* background-color: var(--color-btn-default-hover); */
        color: white;
    }
    .btn-action {
        background-color: var(--color-strand-red);
        color: white;
    }
    .btn-action:hover {
        background-color: var(--color-strand-red-full);
    }
</style>