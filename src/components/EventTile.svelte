<script>
    import { onDestroy } from 'svelte'
    import { createEventDispatcher } from 'svelte'
    import { Settings } from '../store/calendar'
    import { Resources } from '../store/resources'
    export let event = null
    let height = 0
    let top = 0
    let tileClass = ''
    let tileStyle = ''
    let timeSpan = ''
    let now = new Date()
    let resources = []

    const unsubscribeRes = Resources.subscribe(valueRes => {
        resources = valueRes
        console.log('  >> EventTile resources', resources)
    })
    onDestroy(() => {
        unsubscribeRes()
    })
    
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
        // console.log('  ***** Tile event', event)
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

        let startHour = event.startDate.getHours()
        let startMinutes = event.startDate.getMinutes()
        let startTime = new Date(now.getFullYear(), 0, 1, startHour, startMinutes);
        let endHour = event.endDate.getHours()
        let endMinutes = event.endDate.getMinutes()
        // console.log(' >> Tile endMinutes', endMinutes)
        let endTime = new Date(now.getFullYear(), 0, 1, endHour, endMinutes);
        let duration = (endTime - startTime) / 60000
        // console.log(' >> Tile startTime', startTime)
        // console.log(' >> Tile endTime', endTime)
        // console.log(' >> Tile duration', duration)

        let startTimeText = `${startHour}${(startMinutes > 0 ? `:${startMinutes.toString().padStart(2, '0')}` : '')}`
        startTimeText = `${startTimeText} ${startHour < 12 ? 'AM' : 'PM'}`

        let endTimeText = `${endHour}${(endMinutes > 0 ? `:${endMinutes.toString().padStart(2, '0')}` : '')}`
        endTimeText = `${endTimeText} ${startHour < 12 ? 'AM' : 'PM'}`
        
        timeSpan = `${startTimeText}-${endTimeText} ${(startHour >= 12 && endHour >= 12) ? ' ' : '' }`
        // console.log(' >> Tile Settings.StartHour', Settings.StartHour)

        height = duration
        top = ((startTime.getHours() - Settings.StartHour) * 60) + startTime.getMinutes()
        // console.log(' >> Tile height', height)
        // console.log(' >> Tile top', top)

        tileClass = `tile ${ event.break == true ? 'tile-break' : `tile-3`}`
        // console.log(' >> Tile tileClass', tileClass)
        tileStyle = `top: ${top}px; width: 90%; height: ${height}px`
    }
    initTile()
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

<style>
    .tile {
        font-size: .8125rem;
        font-weight: 700;
        padding: 0.25rem 0.5rem;
        /* border-radius: 0.3125rem; */
        position: absolute;
        cursor: pointer;
        overflow: hidden;
        transition: background-color .1s ease-in-out;
        color: var(--font-color);
    }
    .tile-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .tile-1 {
        background-color: rgb(252, 236, 190);
        border: 1px solid rgb(251, 223, 147);
    }
    .tile-1:hover {
        background-color: rgb(247, 232, 186);
        border: 1px solid rgb(251, 223, 147);
    }
    .tile-2 {
        background-color: rgb(50, 139, 207);
        border: 1px solid rgb(53, 127, 184);
        color: white;
    }
    .tile-2:hover {
        background-color: rgb(47, 132, 196);
        border: 1px solid rgb(53, 127, 184);
        color: white
    }
    .tile-3 {
        background-color: rgb(185, 126, 194);
        border: 1px solid rgb(165, 120, 171);
        color: white;
    }
    .tile-3:hover {
        background-color: rgb(175, 119, 184);
        border: 1px solid rgb(165, 120, 171);
        color: white
    }
    .tile-break {
        background: repeating-linear-gradient(
            45deg,
            rgb(215, 219, 239),
            rgb(215, 219, 239) 10px,
            rgb(188, 195, 229) 10px,
            rgb(188, 195, 229) 20px
        );
        border: 1px solid rgb(188, 195, 229);
        border-radius: 0;
    }
</style>