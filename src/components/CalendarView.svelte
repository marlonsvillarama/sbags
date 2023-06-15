<script>
    import { onDestroy } from 'svelte';
    import { DayData, Settings, WeekDays } from '../store/calendar'
    import { Events } from '../store/events'
    import { Employees, Resources } from '../store/resources'
    import CalendarViewDay from './CalendarViewDay.svelte'
    import { db } from "../firebase.js"
    // import { collectionData } from 'rxfire/firestore'
    // import { startWith } from 'rxjs/operators'

    let times = []
    let weekDays = []
    let events = []
    

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
        db.collection('events')
            .where('startdate', '>=', weekDays[0].date)
            .where('startdate', '<', nextDay)
            .orderBy('startdate')
            .onSnapshot(data => {
                Events.set([])
                console.log(`>> CalendarView data`, data)
                let eventDocs = data.docs.map(doc => {
                    let d = doc.data()
                    return {
                        uid: d.uid,
                        break: d.break,
                        startDate: d.startdate.toDate(),
                        endDate: d.enddate.toDate()
                    }
                })
                for (const value of Object.values(eventDocs)) {
                    events.push(value)
                }
                console.log(`CalendarView events`, events)
                Events.update(e => events)

                let resources = [...new Set(events.map(e => e.uid))]
                Resources.update(e => resources)
            })
        
        db.collection('employees')
            .where('active', '==', 'true')
            .orderBy('uid')
            .onSnapshot(data => {
                Employees.set({})
                let empDocs = data.docs.map(doc => {
                    let d = doc.data()
                    return {
                        uid: d.uid,
                        active: d.active,
                        maxHours: d.maxhours,
                        blocks: d.blocks
                    }
                })
                for (const value of Object.values(empDocs)) {

                }
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
    <!-- <div class="cal-grid">
        {#each $Resources as res}
        <div class="cal-row">
            {#if $ViewMode == 'resource'}
                <ResourceViewRow resource={res} />
            {:else}
                <TimeViewRow />
            {/if}
        </div>
        {/each}
    </div> -->
</div>

<style>
    .cal-view {
        display: flex;
        flex-direction: row;
        flex: 0 0 auto;
        /* border: 1px solid red; */
        /* height: 100px; */
    }
    .cal-grid {
        /* padding-top: 0.5rem; */
        /* border: 1px solid red; */
        flex-grow: 1;
        overflow: auto;
        display: flex;
        flex-direction: row;
        border-left: 1px solid var(--color-hairline);
        /* height: 1000px; */
    }
</style>