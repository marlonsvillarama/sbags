<script>
    import { onDestroy } from 'svelte';
    import { DayData, Holidays, Settings, TimeOffs, WeekDays, WeekSettings } from '../../store/calendar'
    import { Events } from '../../store/events'
    import { Employees, Resources } from '../../store/resources'
    import CalendarViewDay from './CalendarViewDay.svelte'
    import { db } from "../../firebase.js"
    import { collectionData } from 'rxfire/firestore'
    import { startWith } from 'rxjs/operators'

    let times = []
    let weekDays = []
    let events = []
    let employees = []
    let timeOffs = []
    let holidays = []
    let weekSettings = {}

    const init = () => {
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

    const unsubscribeWeek = WeekDays.subscribe(value => {
        weekDays = value;
        let lastDay = weekDays[6].date
        let nextDay = new Date(lastDay)
        nextDay.setDate(lastDay.getDate() + 1)
        console.log('>> CalendarView querying events for weekDays', weekDays)
        console.log('>> CalendarView querying events for nextDay', nextDay)

        let dbquery = db.collection('employees')
            .orderBy('uid')
        collectionData(dbquery, { idField: 'id' }).pipe(startWith([]))
            .subscribe(results => {
                employees = results
                console.log(`CalendarView employees`, employees)
                Employees.update(e => employees)

                let subquery = db.collection('events')
                    .where('startdate', '>=', weekDays[0].date)
                    .where('startdate', '<', nextDay)
                if (employees.length > 0) {
                    subquery.where('id', 'in', employees.filter(e=>e.active == true).map(e => e.id))
                }
                subquery.orderBy('startdate')
                collectionData(subquery, { idField: 'id' }).pipe(startWith([]))
                    .subscribe(results => {
                        events = results
                        Events.update(e => events)
                        console.log(`CalendarView events`, events)

                        Resources.update(e => [...new Set(events.map(e=>e.employee))])
                    })

                subquery = db.collection('timeoffs')
                    .where('date', '>=', weekDays[0].date)
                    .where('date', '<', nextDay)
                if (employees.length > 0) {
                    subquery.where('id', 'in', employees.filter(e=>e.active == true).map(e => e.id))
                }
                subquery.orderBy('date')
                collectionData(subquery, { idField: 'id' }).pipe(startWith([]))
                    .subscribe(results => {
                        timeOffs = results
                        console.log(`CalendarView timeOffs`, timeOffs)
                        console.log(`CalendarView timeOffs employees.map(e=>e.id)`, employees.map(e=>e.id))
                        timeOffs = timeOffs.filter(pto => employees.map(e=>e.id).indexOf(pto.employee) >= 0)
                        console.log(`CalendarView timeOffs filtered`, timeOffs)
                        TimeOffs.update(e => timeOffs)
                    })
            })
        
        dbquery = db.collection('holidays')
            .where('date', '>=', weekDays[0].date)
            .where('date', '<', nextDay)
            .orderBy('date')
        collectionData(dbquery, { idField: 'id' }).pipe(startWith([]))
            .subscribe(r => {
                // Holidays.set([])
                holidays = r
                Holidays.set(holidays)
                console.log(`CalendarView holiday holidays`, holidays)
            })
        
        db.collection('weeks')
            .where('start', '>=', weekDays[0].date)
            .where('start', '<', nextDay)
            .orderBy('start')
            .onSnapshot(data => {
                let results = data.docs.map(doc => doc.data());
                weekSettings = results.length > 0 ? results[0] : {}
                console.log('*** weekSettings ***', weekSettings)
            })
    })
    onDestroy(() => {
        unsubscribeWeek()
    });
</script>

<div class="cal-view">
    <div class="cal-side">
        {#each times as time}
        <div class="cal-row cal-side-row">
            <span>{time}</span>
        </div>
        {/each}
    </div>
    <div class="cal-lines">
        {#each times as time}
        <div class="cal-row"></div>
        {/each}
    </div>
    <div class="cal-grid">
        {#each $WeekDays as day}
            <CalendarViewDay day={day} />
        {/each}
    </div>
</div>

<style>
    .cal-view {
        display: flex;
        flex-direction: row;
        flex: 0 0 auto;
    }
    .cal-grid {
        flex-grow: 1;
        overflow: auto;
        display: flex;
        flex-direction: row;
        border-left: 1px solid var(--color-hairline);
    }
</style>