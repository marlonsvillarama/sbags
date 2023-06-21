<script>
    export let block
    
    import { createEventDispatcher, onMount } from "svelte";
    import { db } from "../../../firebase";
    import { CurrentEmployee } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/form/Checkbox.svelte";
    import EmployeeDeleteButton from "./EmployeeDeleteButton.svelte";

    let dispatch = createEventDispatcher()
    let employee
    let scheduleText = ''

    const capitalize = (value) => {
        if (!value) {
            return ''
        }

        return `${value.slice(0, 1).toUpperCase()}${value.slice(1).toLowerCase}`
    }

    const parseDateTime = (value) => {
        let dt = value.toDate()
        let dateString = dt.toLocaleDateString('en-us', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        let dateParts = dateString.split(', ')
        let hour = dt.getHours()
        
        return {
            day: dateParts[0],
            date: dateParts[1],
            year: dateParts[2],
            time: `${hour > 12 ? hour - 12 : hour}:${dt.getMinutes().toString().padStart(2, '0')}`,
            ampm: hour > 12 ? 'PM' : 'AM'
        }
    }

    const parseDays = (value) => {
        let days = value.split(',')
        days = days.map(d => `${d.slice(0, 1).toUpperCase()}${d.slice(1).toLowerCase()}`).join(', ')
        return days
    }

    const parseBlock = () => {
        let output = ''

        console.log(`EmployeeBlockListRow block ==>`, block)
        let id = block['id']
        let days = block['days']
        let allday = block['allday']
        let start_date = block['start_date']
        let end_date = block['end_date']
        let start_time = block['start_time']
        let end_time = block['end_time']
        let frequency = block['frequency']

        if (!frequency) {
            return output
        }

        output = `Occurs ${frequency},`
        switch(frequency.toLowerCase()) {
            case 'one time': {
                let start = parseDateTime(start_time)
                output = `${output} ${allday ? 'all day' : ''} on ${start.date}`
                if (!allday) {
                    let end = parseDateTime(end_time)
                    output = `${output}, from `
                    output = `${output} ${start.time} ${start.ampm} to ${end.time} ${end.ampm}`
                }
                break
            }
            case 'daily': {
                let start = parseDateTime(start_date)
                let end = parseDateTime(end_date)
                let time1 = parseDateTime(start_time)
                let time2 = parseDateTime(end_time)
                let dates = start.date == end.date ? `on ${start.date}` : `from ${start.date} to ${end.date}`
                let times = `${time1.time} ${time1.ampm} to ${time2.time} ${time2.ampm}`
                output = `${output} ${dates}, ${times}`
                break
            }
            case 'weekly': {
                let start = parseDateTime(start_date)
                let end = parseDateTime(end_date)
                let time1 = parseDateTime(start_time)
                let time2 = parseDateTime(end_time)
                let times = `${time1.time} ${time1.ampm} to ${time2.time} ${time2.ampm}`
                output = `${output} from `
                output = `${output} ${start.date} to ${end.date}, ${times}`
                if (days) {
                    output = `${output}, every ${parseDays(days)}`
                }
                break
            }
            case 'fortnightly': {
                break
            }
            case 'monthly': {
                break
            }
        }

        return output
    }

    onMount(() => {
        employee = $CurrentEmployee
        if (!employee) {
            return
        }

        scheduleText = parseBlock()
    })
</script>

<div class="row">
    <div class="actions">
        <Button icon="edit" type="icon" on:mouseup={()=>{alert(block.id)}} />
        <Button icon="trash" type="icon" />
    </div>
    <span>{scheduleText}</span>
</div>

<style>
    .row {
        padding: 0.5rem 1rem;
        color: var(--font-color-gray-med);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
    .row > :first-child {
        flex: 0 0 10rem;
    }
    .row > :last-child {
        flex: 1;
    }
    .row:not(:last-child) {
        border-bottom: 1px solid var(--color-hairline);
    }
    .row > span:first-child {
        padding: 0 0.5rem;
    }
    .actions {
        display: flex;
        flex-direction: row;
        gap: 0.25rem;
        align-items: center;
    }
</style>