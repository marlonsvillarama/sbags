<script>
    import { createEventDispatcher } from 'svelte';
    import { onDestroy } from 'svelte'
    import { PreviousWeek, NextWeek, ResetWeek, WeekDays } from "../../store/calendar";
    import Button from "../shared/Button.svelte";

    let dateLabel = ''
    const writeDateLabel = () => {
        if (!weekStart || !weekEnd) {
            return
        }

        dateLabel = weekStart.month == weekEnd.month ?
            `${weekStart.month} ${weekStart.date.getDate()}-${weekEnd.date.getDate()}, ${weekEnd.date.getFullYear()}` :
            `${weekStart.name} - ${weekEnd.name}`
        console.log(`PageHeader dateLabel`, dateLabel)
    }

    let weekDays = []
    let weekStart
    let weekEnd
    const unsubscribeWeek = WeekDays.subscribe(data => {
        weekDays = data
        console.log('PageHeader weekDays', weekDays)
        weekStart = weekDays[0]
        weekEnd = weekDays[weekDays.length - 1]
        writeDateLabel()
    })
    onDestroy(() => {
        unsubscribeWeek()
    })

    const prevWeek = () => {
        PreviousWeek()
        writeDateLabel()
    }

    const nextWeek = () => {
        NextWeek()
        writeDateLabel()
    }

    const resetWeek = () => {
        ResetWeek()
        writeDateLabel()
    }

    let dispatch = createEventDispatcher()
    const openSettings = () => {
        dispatch('mouseup', {
            action: 'navigate',
            page: 'settings'
        })
    }

    const backToHome = () => {
        dispatch('mouseup', {
            action: 'navigate',
            page: ''
        })
    }

    export let mode = 'home'
</script>

<div class="page-header">
    <div class="page-logo"></div>
    <div class="page-controls">
        {#if mode == 'home'}
            <Button icon="clock" on:mouseup={resetWeek} type="icon" />
            <Button icon="chevron-left" on:mouseup={prevWeek} type="icon" />
            <Button icon="chevron-right" on:mouseup={nextWeek} type="icon" />
            <!-- <ButtonIcon icon="calendar" name="Pick a date" /> -->
            <Button icon="settings" on:mouseup={openSettings} type="icon" />
        {:else}
            <Button icon="arrow-left" label="Back to calendar view" on:mouseup={backToHome} />
        {/if}
    </div>
</div>

<div class="page-subheader">
    {#if mode == 'home'}
        <div class="page-title">
            <span>Week of {dateLabel}</span>
        </div>
        <div class="page-actions">
            <Button label="Copy from last week" icon="copy"></Button>
            <Button label="Generate new schedule" icon="calendar"></Button>
        </div>
    {:else}
    <div class="page-title">
        <span>Settings</span>
    </div>
{/if}
</div>


<style>
    .page-header {
        border: 0px solid red;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }
    .page-logo {
        background: no-repeat url('https://cdn.shopify.com/s/files/1/0557/4046/5328/t/275/assets/logo.svg?v=54951805321601846281685521762');
        background-size: auto;
        height: 32px;
        width: 250px;
        border: 0px solid green;
    }
    .page-controls {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
    }
    .page-title {
        font-size: 1.75rem;
        font-weight: bold;
        color: var(--font-color-gray-med);
        text-align: center;
        border: 0px solid red;
    }
    .page-subheader {
        border: 0px solid red;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .page-actions {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }
</style>