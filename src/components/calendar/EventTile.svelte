<script>
    import { onDestroy } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { DayData, GetDateKey, Settings } from '../../store/calendar'
    import { Employees, Resources } from '../../store/resources'
    export let event = null
    const BASE_WIDTH = 90
    let height = 0
    let top = 0
    let left = 0
    let width = BASE_WIDTH
    let tileClass = ''
    let tileStyle = ''
    let timeSpan = ''
    let now = new Date()
    let employees = []
    let resources = []
    let dayData

    const handleDragStart = (e) => {
        console.log(`dragStart`, e)
    }

    const handleDrag = (e) => {
        console.log('drag', e)
        console.log('parent', e)
    }

    const handleMouseOver = (e) => {
        console.log('mouseover', e)
    }

    const handleMouseUp = (e) => {

    }

    const initTile = () => {
        // console.log('  ***** Tile event', event)
        if (!event) {
            return;
        }

        // console.log(`EventTile dayData`, dayData)
        if (!dayData) {
            return;
        }

        let startDate = event.startdate.toDate();
        let startHour = startDate.getHours()
        let startMinutes = startDate.getMinutes()
        let startTime = new Date(now.getFullYear(), 0, 1, startHour, startMinutes);

        let endDate = event.enddate.toDate()
        let endHour = endDate.getHours()
        let endMinutes = endDate.getMinutes()
        let endTime = new Date(now.getFullYear(), 0, 1, endHour, endMinutes);
        let duration = (endTime.getTime() - startTime.getTime()) / 60000

        let startTimeText = `${startHour > 12 ? startHour - 12 : startHour}${(startMinutes > 0 ? `:${startMinutes.toString().padStart(2, '0')}` : '')}`
        startTimeText = `${startTimeText}${startHour < 12 ? 'AM' : 'PM'}`

        let endTimeText = `${endHour > 12 ? endHour - 12 : endHour}${(endMinutes > 0 ? `:${endMinutes.toString().padStart(2, '0')}` : '')}`
        endTimeText = `${endTimeText}${endHour < 12 ? 'AM' : 'PM'}`
        
        timeSpan = `${startTimeText}-${endTimeText} ${(startHour >= 12 && endHour >= 12) ? ' ' : '' }`

        let key = GetDateKey(startDate)
        height = duration
        top = ((startTime.getHours() - Settings.StartHour) * 60) + startTime.getMinutes()
        width = (BASE_WIDTH / dayData[key].resources.length)
        left = width * (dayData[key].resources.indexOf(event.employee))
        // console.log(`EventTile width`, width)
        // console.log(`EventTile left`, left)

        console.log(` ==> uid=${event.employee}`, resources.indexOf(event.employee));
        tileClass = `tile ${ event.break == true ? 'tile-break' : `tile-${resources.indexOf(event.employee) + 1}`}`
        tileStyle = `top: ${top}px; left: ${left}%; width: ${width}%; height: ${height}px`
    }
    initTile()

    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
        console.log(`  ***** EventTile employees`, employees)
    })
    const unsubscribeRes = Resources.subscribe(value => {
        resources = value
        console.log(`  ***** EventTile resources`, resources)
    })
    const unsubscribeDayData = DayData.subscribe(value => {
        dayData = value
        console.log(`  ***** EventTile dayData`, dayData)
        initTile()
    })
    onDestroy(() => {
        unsubscribeEmp()
        unsubscribeRes()
        unsubscribeDayData()
    })
</script>

<div class={tileClass} draggable="true" style={tileStyle}
    on:mouseup={(e)=>handleMouseUp(e)}
    on:dragstart={(e)=>handleDragStart(e)}
    on:drag={(e)=>handleDrag(e)}>
    {#if !event.break}
        <div class="tile-header">
            <!-- <span>{event.id}</span> -->
            <span>{event.uid}</span>
            <span>{timeSpan}</span>
        </div>
    {/if}
</div>