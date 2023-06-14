<script>
    import { onDestroy } from 'svelte';
    import { WeekDays } from '../store/calendar'

</script>

<div class="cal-header">
    <div class="cal-days">
        <div class="cal-side"></div>
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
        padding: 0.75rem 0 0.5rem;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
    }
    .cal-days {
        display: flex;
        flex-direction: row;
        gap: 0;
        /* border-bottom: 1px solid var(--border-gray-lite); */
    }
    .cal-col {
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 0.5rem;
        flex: 1;
        font-weight: 600;
    }
    .col-day {
        font-size: 1rem;
        color: var(--font-color-gray-lite);
    }
    .col-date {
        font-size: 2.25rem;
        color: var(--font-color-gray-med);
    }
    .col-sub {
        font-size: 1.25rem;
        color: var(--font-color-gray-lite);
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