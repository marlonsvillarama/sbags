<script>
    import { onDestroy } from 'svelte'
    import { Settings } from '../store/calendar'
    import { Events } from '../store/events'
    // import { Resources } from '../store/resources'
    import Tile from './EventTile.svelte'

    export let day = {}
    // console.log(`CalendarViewDay day`, day)

    const isEqual = (d1, d2) => {
        // console.log('  >> isEqual d1', d1)
        // console.log('  >> isEqual d2', d2)
        let result = d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() == d2.getMonth() &&
            d1.getDate() == d2.getDate()
        // console.log(' >> isEqual result', result)
        return result
    }

    let times = []
    for (let i=Settings.StartHour; i<Settings.EndHour; i++) {
        let j = i > 12 ? (i - 12) : i;

        if (i==Settings.StartHour) {
            times.push(' ')
            continue;
        }
        times.push(`${j} ${i < 12 ? 'AM' : 'PM'}`)
    }
    let events = []
    let dayEvents = []
    let resources = []
    let unsubscribeEvents = Events.subscribe(valueEvents => {
        // for (const value of Object.values(valueEvents)) {
        //     events.push(value)
        // }
        // console.log('CalendarViewDay events', events)
        dayEvents = valueEvents.filter(e => isEqual(e.startDate, day.date) == true)
        resources = [...new Set(dayEvents.map(e => e.uid))]
        console.log('*** CalendarViewDay dayEvents ***', dayEvents)
    })
    onDestroy(() => {
        unsubscribeEvents()
    })

    // console.log(`Events`, events)
    // console.log(`dayEvents`, dayEvents)
</script>

<div class="cal-col">
    {#each times as time}
        <div class="cal-row"></div>
    {/each}
    {#each dayEvents as event}
        <Tile event={event} />
    {/each}
</div>


<style>
    .cal-col {
        flex: 1;
        border-right: 1px solid var(--color-hairline);
        position: relative;
    }
    .cal-col>.cal-row {
        border-bottom: 1px solid var(--color-hairline);
    }
</style>