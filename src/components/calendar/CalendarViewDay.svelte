<script>
    import { onDestroy } from 'svelte'
    import { GetDateKey, DayData, Settings } from '../../store/calendar'
    import { Events } from '../../store/events'
    import { Employees } from '../../store/resources'
    import Tile from './EventTile.svelte'

    export let day = {}

    const isEqual = (d1, d2) => {
        let result = d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() == d2.getMonth() &&
            d1.getDate() == d2.getDate()
        return result
    }

    let times = []
    const init = () =>  {
        times = []
        for (let i=Settings.StartHour; i<Settings.EndHour; i++) {
            let j = i > 12 ? (i - 12) : i;

            if (i==Settings.StartHour) {
                times.push(' ')
                continue;
            }
            times.push(`${j} ${i < 12 ? 'AM' : 'PM'}`)
        }
    }
    init()

    let dayEvents = []
    let resources = {}
    const unsubscribeEvents = Events.subscribe(valueEvents => {
        dayEvents = valueEvents.filter(e => {
            return isEqual(e.startdate.toDate(), day.date) == true &&
                $Employees.filter(emp => emp.active == true && emp.id == e.employee).length > 0
        })
        console.log('*** CalendarViewDay dayEvents ***', dayEvents)
        
        resources = [...new Set(dayEvents.map(e => e.employee))]
        DayData.update(e => {
            let key = GetDateKey(day.date)
            e[key] = e[key] || {}
            e[key].resources = resources
            return e
        })
    })
    onDestroy(() => {
        unsubscribeEvents()
    })
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