<script>
    import { createEventDispatcher } from "svelte";
    import { db } from "../../../firebase";
    import { Timestamp } from "firebase/firestore";
    import { onMount } from "svelte";
    import { CurrentBlock, CurrentEmployee } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";
    import Dropdown from "../../shared/form/Dropdown.svelte";
    import InputCheckbox from "../../shared/form/InputCheckbox.svelte";
    import InputDate from "../../shared/form/InputDate.svelte";
    import Modal from "../../shared/Modal.svelte";

    let ctaLabel = `${$CurrentBlock['id'] ? 'Update' : 'Create'}`
    let isDirty = false
    let dialog
    let dialogAction = ''
    let dialogTitle = ''
    let dialogContent = ''
    let dialogType = ''
    let dispatch = createEventDispatcher()
    let frequencyItems = [
        { text: 'One time', value: 'one time' },
        { text: 'Occurs daily', value: 'daily' },
        { text: 'Occurs every week', value: 'weekly' },
    ]
    let selectedDays = {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    }
    let selectedFrequency = $CurrentBlock['frequency'] || ''
    let startDate
    let endDate
    let startTime
    let endTime
    let allDay = false

    const parseDate = (dt) => {
        if (!dt) {
            return ''
        }

        let month = (dt.getMonth()+1).toString().padStart(2, '0')
        let date = dt.getDate().toString().padStart(2, '0')
        let output = `${dt.getFullYear()}-${month}-${date}`
        return output
    }

    const toTimestamp = (value, isTime) => {
        let output = null
        if (!value) {
            return output
        }

        if (isTime) {
            let values = value.split(':')
            let now = new Date()
            now.setHours(values[0])
            now.setMinutes(values[1])

            output = Timestamp.fromDate(now)
        }
        else {
            output = Timestamp.fromDate(new Date(value))
        }

        return output
    }

    const parseTime = (dt) => {
        if (!dt) {
            return ''
        }
        
        let hour = dt.getHours().toString().padStart(2, '0')
        let minute = dt.getMinutes().toString().padStart(2, '0')
        let output = `${hour}:${minute}`
        return output
    }

    const parseBlock = () => {
        let start_date = $CurrentBlock['start_date'] ? $CurrentBlock['start_date'].toDate() : null
        let start_time = $CurrentBlock['start_time'] ? $CurrentBlock['start_time'].toDate() : null
        let end_date = $CurrentBlock['end_date'] ? $CurrentBlock['end_date'].toDate() : null
        let end_time = $CurrentBlock['end_time'] ? $CurrentBlock['end_time'].toDate() : null

        allDay = $CurrentBlock['allday'] || false
        startDate = parseDate(start_date)
        endDate = parseDate(end_date)
        startTime = parseDate(start_time)
        endTime = parseDate(end_time)
        
        switch(selectedFrequency) {
            case 'one time': {
                startDate = parseDate(start_time)
                break
            }
            case 'weekly': {
                let days = $CurrentBlock['days']
                selectedDays.monday = days.indexOf('monday') >= 0
                selectedDays.tuesday = days.indexOf('tuesday') >= 0
                selectedDays.wednesday = days.indexOf('wednesday') >= 0
                selectedDays.thursday = days.indexOf('thursday') >= 0
                selectedDays.friday = days.indexOf('friday') >= 0
                selectedDays.saturday = days.indexOf('saturday') >= 0
                selectedDays.sunday = days.indexOf('sunday') >= 0

                break
            }
        }
        if (!allDay) {
            startTime = parseTime(start_time)
            endTime = parseTime(end_time)
        }
    }

    const backToList = () => {
        dispatch('action', {
            action: 'cancel'
        })
        $CurrentBlock = null
    }

    const checkDirty = () => {
        isDirty = false
    }

    const getSelectedDays = () => {
        let days = []
        for(const [key, value] of Object.entries(selectedDays)) {
            if (value) {
                days.push(key)
            }
        }

        return days
    }

    const generateId = (length) => {
        let len = length || 20
        let result = ''
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;

        while (counter < len) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }

        return result
    }

    const updateBlock = async () => {
        let days = getSelectedDays()
        /* let days = []
        for(const [key, value] of Object.entries(selectedDays)) {
            if (value) {
                days.push(key)
            }
        } */

        let updateBlock = {
            frequency: selectedFrequency,
            allday: allDay,
        }

        if (days.length > 0) {
            updateBlock.days = days.join(',')
        }

        if ($CurrentBlock['id']) {
            updateBlock.id = $CurrentBlock['id']
        }

        if (selectedFrequency == 'one time') {
            if (allDay) {
                updateBlock.start_time = toTimestamp(startDate)
            }
            else {
                let dtStartDate = new Date(startDate)
                let dtStartTime = toTimestamp(startTime, true).toDate()
                let dtEndTime = toTimestamp(endTime, true).toDate()
                let dtStart = new Date(
                    dtStartDate.getFullYear(),
                    dtStartDate.getMonth(),
                    dtStartDate.getDate(),
                    dtStartTime.getHours(),
                    dtStartTime.getMinutes()
                )
                let dtEnd = new Date(
                    dtStartDate.getFullYear(),
                    dtStartDate.getMonth(),
                    dtStartDate.getDate(),
                    dtEndTime.getHours(),
                    dtEndTime.getMinutes()
                )

                updateBlock.start_time = toTimestamp(dtStart.toString())
                updateBlock.end_time = toTimestamp(dtEnd.toString())
            }
        }
        else {
            updateBlock.start_date = toTimestamp(startDate)
            updateBlock.end_date = toTimestamp(endDate)

            if (!allDay) {
                updateBlock.end_time = toTimestamp(endTime, true)
                updateBlock.start_time = toTimestamp(startTime, true)
            }
        }

        CurrentEmployee.update(emp => {
            emp['blocked'] = emp['blocked'] || []
            let found = emp['blocked'].filter(b => b.id == $CurrentBlock['id'])
            if (found.length > 0) {
                emp['blocked'] = emp['blocked'].map(block => {
                    let obj = null
                    if (block.id == $CurrentBlock['id']) {
                        obj = {
                            ...updateBlock
                        }
                    }
                    else {
                        obj = { ...block }
                    }
                    return obj
                })
            }
            else {
                updateBlock['id'] = generateId()
                emp['blocked'].push({...updateBlock})
            }

            return emp
        })
        await db.collection('employees').doc($CurrentEmployee['id']).set({ ...$CurrentEmployee })
    }

    const deleteBlock = async () => {
        CurrentEmployee.update(emp => {
            emp['blocked'] = emp['blocked'].filter(b => b.id != $CurrentBlock['id'])
            return emp
        })
        await db.collection('employees').doc($CurrentEmployee['id']).set({ ...$CurrentEmployee })
        dispatch('action', {
            action: 'delete'
        })
    }

    const isBlank = (value) => {
        return value == '' || value == null || value == undefined ||
            (
                value != '' && value.trim() == ''
            )
    }

    const validateOneTime = () => {
        console.log(`validateOneTime allDay`, allDay)
        console.log(`validateOneTime startDate`, startDate)
        console.log(`validateOneTime startTime`, startTime)
        console.log(`validateOneTime endTime`, endTime)

        if (allDay && isBlank(startDate)) {
            return {
                result: false,
                message: 'Please enter a Start Date value.'
            }
        }

        if (!allDay) {
            if (isBlank(startDate) || isBlank(startTime) || isBlank(endTime)) {
                return {
                    result: false,
                    message: 'Please make sure all of the date and time fields are populated.'
                }
            }

            if (toTimestamp(startTime, true) >= toTimestamp(endTime, true)) {
                return {
                    result: false,
                    message: 'The Start Time must be earlier than the End Time.'
                }
            }
        }

        if (new Date(startDate) < new Date(parseDate(new Date()))) {
            return {
                result: false,
                message: 'The Start Date must be on or before today.'
            }
        }

        return { result: true }
    }

    const validateDaily = () => {
        if (allDay) {
            if (isBlank(startDate) || isBlank(endDate)) {
                return {
                    result: false,
                    message: 'Please specify all date values.'
                }
            }
        }

        if (!allDay) {
            if (isBlank(startDate) || isBlank(startTime) || isBlank(endDate) || isBlank(endTime)) {
                return {
                    result: false,
                    message: 'Please specify all date and time values.'
                }
            }

            if (toTimestamp(startTime, true) > toTimestamp(endTime, true)) {
                return {
                    result: false,
                    message: 'The Start Time must be the same or earlier than the End Time.'
                }
            }
        }

        if (toTimestamp(startDate) > toTimestamp(endDate)) {
                return {
                    result: false,
                    message: 'The Start Date must be the same or earlier than the End Date.'
                }
            }

        if (new Date(endDate) < new Date(parseDate(new Date()))) {
            return {
                result: false,
                message: 'The End Date must be on or after today.'
            }
        }

        return { result: true }
    }

    const validateWeekly = () => {
        let output = validateDaily()
        console.log(`validateWeekly daily output==>`, output)
        if (!output.result) {
            return output
        }

        if (getSelectedDays().length <= 0) {
            return {
                result: false,
                message: 'Please select at least one day of the week.'
            }
        }

        return { result: true }
    }

    const validateForm = () => {
        let output = {}

        if (!selectedFrequency) {
            return {
                result: false,
                message: 'You must select the frequency for this block.'
            }
        }

        console.log(`validateForm selectedFrequency`, selectedFrequency)
        switch(selectedFrequency) {
            case 'one time': {
                output = validateOneTime()
                break
            }
            case 'daily': {
                output = validateDaily()
                break
            }
            case 'weekly': {
                output = validateWeekly()
                break
            }
            default: break
        }

        console.log(`validateForm output==>`, output)
        return output
    }

    const handleUpdate = () => {
        let validate = validateForm()
        if (!validate.result) {
            dialogAction = 'delete'
            dialogTitle = 'There was an error saving the time block.'
            dialogContent = validate.message
            dialogType = 'alert'
            dialog.show()

            return
        }
        
        // 
        // return
        // 

        updateBlock()
        dispatch('action', {
            action: 'navigate',
            page: 'list'
        })
    }

    const handleDelete = () => {
        dialogAction = 'delete'
        dialogTitle = 'Delete this block?'
        dialogContent = 'Are you sure you want to continue?'
        dialogType = 'confirm'
        dialog.show()
    }

    const handleCancel = () => {
        if (isDirty) {
            dialogAction = 'cancel'
            dialogTitle = 'Your changes will be lost!'
            dialogContent = 'Are you sure you want to exit this page?'
            dialogType = 'confirm'
            dialog.show()
        }
        else {
            backToList()
        }
    }

    const handleModal = () => {
        deleteBlock()
        dispatch('action', {
            action: 'navigate',
            page: 'list'
        })
    }

    onMount(() => {
        checkDirty()
        parseBlock()
    })
</script>

<div class="form">
    <Dropdown label="Frequency" items={frequencyItems} bind:value={selectedFrequency} />

    {#if selectedFrequency != '' }
        <InputCheckbox label="All day" bind:checked={allDay} />
        
        <div class="table-rows">
            <div>
                <InputDate label="Start Date" bind:value={startDate} />
                {#if selectedFrequency != 'one time'}
                    <InputDate label="End Date" bind:value={endDate} />
                {/if}
                {#if allDay == false}
                    <InputDate time label="Start Time" bind:value={startTime} />
                {/if}
                {#if allDay == false}
                    <InputDate time label="End Time" bind:value={endTime} />
                {/if}
            </div>
        </div>
    {/if}

    {#if selectedFrequency == 'weekly' || selectedFrequency == 'fortnightly'}
    <div class="table-rows">
        <div>
            <!-- <InputCheckbox label="Every day" bind:checked={selectAllDays} on:change={()=>toggleAllDays()} /> -->
            <InputCheckbox label="Monday" bind:checked={selectedDays.monday} />
            <InputCheckbox label="Tuesday" bind:checked={selectedDays.tuesday} />
            <InputCheckbox label="Wednesday" bind:checked={selectedDays.wednesday} />
            <InputCheckbox label="Thursday" bind:checked={selectedDays.thursday} />
        </div>
        <div>
            <!-- <InputCheckbox label="Thursday" bind:checked={thursday} on:change={()=>toggleDay('thursday', !thursday)} /> -->
            <InputCheckbox label="Friday" bind:checked={selectedDays.friday} />
            <InputCheckbox label="Saturday" bind:checked={selectedDays.saturday} />
            <InputCheckbox label="Sunday" bind:checked={selectedDays.sunday} />
        </div>
    </div>
    {/if}

    <div class="actions">
        <Button label={ctaLabel} type="cta" on:mouseup={handleUpdate} />
        {#if $CurrentBlock['id']}
            <Button label="Delete" on:mouseup={handleDelete} />
        {/if}
        <Button label="Cancel" on:mouseup={handleCancel} />
    </div>
</div>

<Modal bind:this={dialog} type={dialogType} on:confirm={()=>handleModal()}>
    <span slot="header">{dialogTitle}</span>
    <span slot="content">{dialogContent}</span>
</Modal>

<style>
    .form {
        padding: 1rem 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    .actions {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: center;
        padding-top: 4rem;
    }
    .table-rows div {
        display: flex;
        flex-direction: row;
        gap: 2rem;
        align-items: center;
    }
</style>