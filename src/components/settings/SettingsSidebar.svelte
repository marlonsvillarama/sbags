<script>
    import { createEventDispatcher } from "svelte";
    import ButtonList from "../shared/ButtonList.svelte";
    import Button from "../shared/Button.svelte";

    let dispatch = createEventDispatcher()
    let active = ''
    const showPage = (page) => {
        active = page
        console.log('showPage active', active)
        dispatch('change', {
            page: page
        })
    }
</script>

<div class="sidebar">
    <ButtonList>
        <Button icon="users" label="Employees" type='icon' on:mouseup={()=>showPage('employees')} />
        <Button icon="clock" label="Hours" type='icon' on:mouseup={()=>showPage('hours')} />
        <!-- <Button icon="coffee" label="Time Offs" type='icon' on:mouseup={()=>showPage('time offs')} /> -->
    </ButtonList>
</div>
<style>
    .sidebar {
        /* border: 1px solid red; */
        flex: 0 0 15rem;
    }
</style>