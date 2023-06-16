<script>
    import { onDestroy } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { DateToString, DayData, Settings } from '../store/calendar'
    import { Employees, Resources } from '../store/resources'
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
        // console.log(`X = ${e.offsetX}, Y = ${e.offsetY}`)
        console.log('drag', e)
        console.log('parent', e)
    }

    const handleMouseOver = (e) => {
        console.log('mouseover', e)
    }

    const initTile = () => {
        console.log('  ***** Tile event', event)
        // console.log('  >> Tile startDate', event.startDate)
        // console.log('  >> Tile startDate.getHours', event.startDate.getHours())
        // console.log('  >> Tile startDate.getMinutes', event.startDate.getMinutes())
        // console.log('  >> Tile endDate', event.endDate)
        // console.log('  >> Tile endDate.getHours', event.endDate.getHours())
        // console.log('  >> Tile endDate.getMinutes', event.endDate.getMinutes())
        if (!event) {
            // console.log('  >> Tile no event detected')
            return;
        }

        console.log(`EventTile dayData`, dayData)
        if (!dayData) {
            return;
        }

        let startHour = event.startDate.getHours()
        let startMinutes = event.startDate.getMinutes()
        let startTime = new Date(now.getFullYear(), 0, 1, startHour, startMinutes);
        let endHour = event.endDate.getHours()
        let endMinutes = event.endDate.getMinutes()
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
        // console.log(' >> Tile Settings.StartHour', Settings.StartHour)

        let key = DateToString(event.startDate)
        height = duration
        top = ((startTime.getHours() - Settings.StartHour) * 60) + startTime.getMinutes()
        width = (BASE_WIDTH / dayData[key].resources.length)
        left = width * (dayData[key].resources.indexOf(event.uid))
        console.log(`EventTile width`, width)
        console.log(`EventTile left`, left)
        // console.log(' >> Tile height', height)
        // console.log(' >> Tile top', top)

        console.log(` ==> uid=${event.uid}`, resources.indexOf(event.uid));
        tileClass = `tile ${ event.break == true ? 'tile-break' : `tile-${resources.indexOf(event.uid) + 1}`}`
        // console.log(' >> Tile tileClass', tileClass)
        tileStyle = `top: ${top}px; left: ${left}%; width: ${width}%; height: ${height}px`
    }
    initTile()

    const unsubscribeEmp = Employees.subscribe(value => {
        employees = value
        console.log('  >> EventTile employees', resources)
    })
    const unsubscribeRes = Resources.subscribe(value => {
        resources = value
        console.log('  >> EventTile resources', resources)
    })
    const unsubscribeDay = DayData.subscribe(value => {
        dayData = value
        console.log(`  ***** EventTile dayData`, dayData)
        initTile()
    })
    onDestroy(() => {
        unsubscribeEmp()
        unsubscribeRes()
        unsubscribeDay()
    })
</script>

<div class={tileClass} draggable="true" style={tileStyle}
    on:dragstart={(e)=>handleDragStart(e)}
    on:drag={(e)=>handleDrag(e)}>
    {#if !event.break}
        <div class="tile-header">
            <span>{event.uid}</span>
            <span>{timeSpan}</span>
        </div>
    {/if}
</div>
