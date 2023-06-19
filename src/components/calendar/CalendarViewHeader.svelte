<script>
    import { onDestroy } from 'svelte';
    import { GetDateKey, Holidays, TimeOffs, WeekDays } from '../../store/calendar'
    import Button from '../shared/Button.svelte';
    import PTOTile from './PTOTile.svelte'
    import { Employees } from '../../store/resources';
    // import { Employees } from '../store/resources'
    // import App from '../App.svelte';

    let timeOffs = []
    let holidays = []
    let employees = []
    const unsubscribePTO = TimeOffs.subscribe(value => {
        timeOffs = value
        timeOffs = timeOffs.filter(pto => $Employees.map(e=>e.id).indexOf(pto.employee) >= 0)
        console.log(`CalendarViewHeader timeOffs`, timeOffs)
    })
    const unsubscribeHolidays = Holidays.subscribe(value => {
        holidays = value
        console.log(`CalendarViewHeader holidays`, holidays)
    })
    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
        timeOffs = timeOffs.filter(pto => $Employees.map(e=>e.id).indexOf(pto.employee) >= 0)
    })
    onDestroy(() => {
        unsubscribePTO()
        unsubscribeHolidays()
    })
</script>

<div class="cal-header">
    <div class="cal-days">
        <div class="cal-side week-totals">
            <span class="col-day">Total</span>
            <span class="col-date">115</span>
            <div class="col-sub">Hours</div>
        </div>
        <div class="cal-lines"></div>
        {#each $WeekDays as day}
            <div class="cal-col">
                <span class="col-day">{day.dayOfWeek}</span>
                <span class="col-date">{day.date.getDate()}</span>
                <div class="col-sub">40 hours</div>
            </div>
        {/each}
        <div class="cal-scroll"></div>
    </div>
    <div class="cal-subheader">
        <div class="cal-side">PTOs</div>
        <div class="cal-lines"></div>
        {#each $WeekDays as day}
            <div class="cal-allday">
                {#each $Holidays as holiday}
                    {#if GetDateKey(holiday.date.toDate()) == GetDateKey(day.date)}
                        <PTOTile holiday={holiday} />
                    {/if}
                {/each}
                {#each $TimeOffs as pto}
                    <!-- <pre>{GetDateKey(pto.date.toDate())} == {GetDateKey(day.date)}</pre>  ; -->
                    {#if GetDateKey(pto.date.toDate()) == GetDateKey(day.date)}
                        <PTOTile pto={pto} />
                    {/if}
                {/each}
            </div>
        {/each}
        <div class="cal-scroll"></div>
    </div>
    <!-- <div class="cal-lines">

    </div> -->
</div>

<style>
    .cal-header {
        display: flex;
        flex-direction: column;
        gap: 0;
        /* border-top: 1px solid var(--color-strand-red); */
        border-bottom: 1px solid var(--border-gray-lite);
        padding: 0.75rem 0 0;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
    .cal-subheader {
        border-top: 1px solid var(--border-gray-lite);
        /* padding: 0.25rem 0; */
    }
    .cal-days, .cal-subheader {
        display: flex;
        flex-direction: row;
        gap: 0;
        /* border-bottom: 1px solid var(--border-gray-lite); */
    }
    .cal-days {
        padding-bottom: 0.5rem;
    }
    .cal-col {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: center;
        /* gap: 0.25rem; */
        flex: 1;
    }
    .col-day {
        font-size: 1rem;
        color: var(--font-color-gray-med);
        font-weight: 600;
    }
    .col-date {
        font-size: 2.25rem;
        color: var(--font-color-gray-med);
        font-weight: 600;
    }
    .col-sub {
        font-size: 1.25rem;
        color: var(--font-color-gray-lite);
    }
    .cal-allday {
        flex: 1;
    }
    .cal-side {
        text-align: center;
        font-weight: 700;
        /* line-height: 1.5rem; */
    }
    .cal-side.week-totals {
        display: flex;
        flex-direction: column;
        /* gap: 1rem; */
    }
    /* .cal-days > div, .cal-subdays > div {
        text-align: center;
    } */
    /* .cal-days > .cal-day {
        font-size: 1.25rem;
        font-weight: bold;
        padding: 1rem;
    }
    .cal-subdays > div {
        padding: 0.75rem;
    } */
    /* .cal-day:not(:last-child):not(:nth-child(8)) {
        border-right: 1px solid var(--border-gray-lite);
    } */
    /* .cal-side {
        width: 5rem;
        border-right: 1px solid var(--border-gray-lite);
    }
    .cal-lines {
        width: 1rem;
    } */
    /* .cal-day {
        flex: 1;
    } */
    .cal-scroll {
        padding: 0 !important;
        overflow: scroll;
        /* visibility: hidden; */
        flex: none;
        border: 0px solid red;
        /* background-color: antiquewhite; */
    }
	::-webkit-scrollbar {
		width: 10px;
	}
	::-webkit-scrollbar-track {
		background: transparent;
	}
	::-webkit-scrollbar-thumb {
		border-radius: 0.25rem;
		background: var(--color-strand-red-full);
	}
</style>