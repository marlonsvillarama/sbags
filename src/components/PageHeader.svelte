<script>
    import { onDestroy } from 'svelte'
    import { PreviousWeek, NextWeek, ResetWeek, WeekDays } from "../store/calendar";
    import Button from "./Button.svelte";
    import ButtonIcon from "./ButtonIcon.svelte";

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
        // console.log('prevWeek')
        PreviousWeek()
        writeDateLabel()
    }

    const nextWeek = () => {
        // console.log('nextWeek')
        NextWeek()
        writeDateLabel()
    }

    const resetWeek = () => {
        // console.log('resetWeek')
        ResetWeek()
        writeDateLabel()
    }
</script>

<div class="page-header">
    <div class="page-logo"></div>
    <div class="page-title">
        <span>{dateLabel}</span>
    </div>
    <div class="page-controls">
        <Button label="Now" on:mouseup={resetWeek} />
        <ButtonIcon icon="chevron-left" on:mouseup={prevWeek} />
        <ButtonIcon icon="chevron-right" on:mouseup={nextWeek} />
        <ButtonIcon icon="calendar" />
        <ButtonIcon icon="settings" />
    </div>
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
        height: 24px;
        width: 250px;
        border: 0px solid green;
    }
    .page-controls {
        display: flex;
        flex-direction: row;
        gap: 0.75rem;
    }
    .page-title {
        font-size: 2rem;
        font-weight: bold;
        color: var(--font-color-gray-med);
        text-align: center;
        border: 0px solid red;
    }
</style>