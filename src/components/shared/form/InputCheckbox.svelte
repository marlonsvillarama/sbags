<script>
    import Checkbox from "./Checkbox.svelte";

    export let label = 'Checkbox'
    export let checked = false
</script>

<div class="fld">
    <span class="fld-label">{label}</span>
    <Checkbox bind:checked={checked} on:change />
</div>

<style>
    .fld {
        width: 10rem;
        /* border: 1px solid red; */
    }
</style>