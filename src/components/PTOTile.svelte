<script>
    import { onDestroy } from "svelte";
    import { Employees, Resources } from '../store/resources'

    let employees = []
    let resources = []
    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
        console.log(`PTOTile employees`, employees)
    })
    const unsubscribeRes = Resources.subscribe(value => {
        resources = value
        console.log(`PTOTile resources`, resources)
    })
    onDestroy(() => {
        unsubscribeEmp()
        unsubscribeRes()
    })

    export let pto = null
    export let holiday = null
    let tileClass = ''
    let timeSpan = ''

    const initPTO = () => {
        console.log(`initPTO pto`, pto)
        console.log(`initPTO resources`, resources)
        tileClass = `tile tile-${resources.indexOf(pto.uid) + 1} pto`
        console.log(`  ==> PTOTile tileClass`, tileClass)

        if (!pto.start || !pto.end) {
            timeSpan = 'All day'
            return;
        }

        let now = new Date()
        let startDate = pto.start.toDate()
        let startHour = startDate.getHours()
        let startMinutes = startDate.getMinutes()
        let startTime = new Date(now.getFullYear(), 0, 1, startHour, startMinutes);

        let endDate = pto.end.toDate()
        let endHour = endDate.getHours()
        let endMinutes = endDate.getMinutes()
        // console.log(' >> Tile endMinutes', endMinutes)
        let endTime = new Date(now.getFullYear(), 0, 1, endHour, endMinutes);
        let duration = (endTime.getTime() - startTime.getTime()) / 60000
        // console.log(' >> Tile startTime', startTime)
        // console.log(' >> Tile endTime', endTime)
        // console.log(' >> Tile duration', duration)

        let startTimeText = `${startHour > 12 ? startHour - 12 : startHour}${(startMinutes > 0 ? `:${startMinutes.toString().padStart(2, '0')}` : '')}`
        startTimeText = `${startTimeText}${startHour < 12 ? 'AM' : 'PM'}`

        let endTimeText = `${endHour > 12 ? endHour - 12 : endHour}${(endMinutes > 0 ? `:${endMinutes.toString().padStart(2, '0')}` : '')}`
        endTimeText = `${endTimeText}${endHour < 12 ? 'AM' : 'PM'}`
        
        timeSpan = `${startTimeText}-${endTimeText} ${(startHour >= 12 && endHour >= 12) ? ' ' : '' }`
    }

    const initHoliday = () => {
        tileClass = 'tile holiday'
    }

    const init = () => {
        console.log('PTOTile init')
        if (pto) {
            initPTO()
        }
        else if (holiday) {
            initHoliday()
        }
    }
    init()
</script>

<div class={tileClass}>
    {#if pto}
        <span>{pto.uid}</span>
    {:else if holiday}
        <span>{holiday.name}</span>
    {/if}
    <span>{timeSpan}</span>
</div>

<style>
    .pto {
        position: relative;
        font-weight: 700;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .holiday {
        position: relative;
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
        background: repeating-linear-gradient(
            45deg,
            var(--color-hairline),
            var(--color-hairline) 10px,
            var(--color-btn-default) 10px,
            var(--color-btn-default) 20px
        );
        border: 1px solid var(--color-hairline);
        color: inherit;
    }
</style>