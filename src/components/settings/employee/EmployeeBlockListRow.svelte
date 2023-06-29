<script>
    export let block
    
    import { createEventDispatcher, onMount } from "svelte";
    import { db } from "../../../firebase";
    import { CurrentBlock, CurrentEmployee } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Modal from "../../shared/Modal.svelte";

    let dialog
    let dispatch = createEventDispatcher()
    let employee
    let scheduleText = ''

    const parseDateTime = (value) => {
        if (!value || isNaN(value)) {
            return null
        }

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
            ampm: hour >= 12 ? 'PM' : 'AM'
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
                let time1
                let time2
                let dates = start.date == end.date ? `on ${start.date}` : `from ${start.date} to ${end.date}`

                output = `${output} ${dates}`
                if (allday) {
                    output = `${output}, all day`
                }
                else {
                    time1 = parseDateTime(start_time)
                    time2 = parseDateTime(end_time)

                    let times = `${time1.time} ${time1.ampm} to ${time2.time} ${time2.ampm}`
                    output = `${output}, ${times}`
                }
                break
            }
            case 'weekly': {
                let start = parseDateTime(start_date)
                let end = parseDateTime(end_date)
                let time1
                let time2

                output = `${output} from `
                output = `${output} ${start.date} to ${end.date}`
                
                if (days) {
                    output = `${output}, every ${parseDays(days)}`
                }

                if (allday) {
                    output = `${output}, all day`
                }
                else {
                    time1 = parseDateTime(start_time)
                    time2 = parseDateTime(end_time)

                    let times = `${time1.time} ${time1.ampm} to ${time2.time} ${time2.ampm}`
                    output = `${output}, ${times}`
                }
                
                break
            }
        }

        return output
    }

    const handleEdit = () => {
        CurrentBlock.update(e => block)
        console.log(`EmployeeBlockListRow handleEdit CurrentBlock`, $CurrentBlock)
        dispatch('action', {
            action: 'navigate',
            page: 'form'
        })
    }

    const deleteBlock = async () => {
        CurrentEmployee.update(emp => {
            emp['blocked'] = emp['blocked'].filter(b => b.id != block.id)
            return emp
        })
        await db.collection('employees').doc($CurrentEmployee['id']).set({ ...$CurrentEmployee })
        dispatch('action', {
            action: 'delete'
        })
    }

    const handleConfirm = () => {
        dialog.hide()
        deleteBlock()
    }

    const showModal = () => {
        if (!block.id) {
            return
        }
        dialog.show()
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
        <Button icon="edit" type="icon" on:mouseup={handleEdit} />
        <Button icon="trash" type="icon" on:mouseup={showModal} />
    </div>
    <span>{scheduleText}</span>
</div>

<Modal bind:this={dialog} type='confirm' on:confirm={handleConfirm}>
    <span slot="header">Delete blocked time</span>
    <span slot="content">Are you sure you want to delete this blocked time? This operation cannot be undone.</span>
</Modal>

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