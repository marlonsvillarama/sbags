<script>
    import { createEventDispatcher } from "svelte";
    
    export let checked = false

    let dispatch = createEventDispatcher()
    const handleChange = (e) => {
        console.log(`Checkbox e==>`, e)
        dispatch(e.target.checked ? 'check' : 'uncheck', {})
    }
</script>

<input type="checkbox" bind:checked={checked} on:change={(e)=>handleChange(e)}>

<style>
    input[type=checkbox] {
        position: relative;
        width: 50px;
        height: 30px;
        appearance: none;
        cursor: pointer;
        background: #c6c6c6;
        outline: none;
        border-radius: 15px;
        box-shadow: inset 0 0 5px rgba(0,0,0,.2);
    }
    input:checked[type=checkbox] {
        background: var(--color-strand-red);
    }
    input[type=checkbox]::before {
        content: '';
        position: absolute;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        top: 3px;
        left: 3px;
        background: white;
        transition: all 0.2s ease-in-out;
    }
    input:checked[type=checkbox]::before {
        left: 23px;
    }
</style>