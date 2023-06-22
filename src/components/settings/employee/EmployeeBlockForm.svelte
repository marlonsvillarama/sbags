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

    let ctaLabel = `${$CurrentBlock ? 'Update' : 'Create'}`
    let isDirty = false
    let dialog
    let dialogTitle = ''
    let dialogContent = ''
    let dialogType = ''
    let dispatch = createEventDispatcher()
    let frequencyItems = [
        { text: 'One time', value: 'one time' },
        { text: 'Occurs daily', value: 'daily' },
        { text: 'Occurs every week', value: 'weekly' },
        { text: 'Occurs every fornight', value: 'fornightly' }
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
    let selectAllDays = false
    let selectedFrequency = $CurrentBlock['frequency']
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
        console.log(`parseDate output = ${output} <==`, dt)
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

        console.log(`toTimestamp value==>`, value)
        console.log(`toTimestamp output==>`, output)

        return output
    }

    const parseTime = (dt) => {
        if (!dt) {
            return ''
        }
        
        let hour = dt.getHours().toString().padStart(2, '0')
        let minute = dt.getMinutes().toString().padStart(2, '0')
        let output = `${hour}:${minute}`
        console.log(`parseTime output = ${output} <==`, dt)
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
        /* (
            // inputName.isDirty() ||
            // inputHours.isDirty()
        ) */
        console.log('EmployeeBlockForm checkDirty isDirty ==>', isDirty)
    }

    const updateBlock = () => {
        console.log(`updateBlock selectedDays`, selectedDays)
        let days = []
        for(const [key, value] of Object.entries(selectedDays)) {
            if (value) {
                days.push(key)
            }
        }

        let updateBlock = {
            frequency: selectedFrequency,
            allday: allDay,
            start_date: (selectedFrequency == 'one time' ? null : toTimestamp(startDate)),
            end_date: (selectedFrequency == 'one time' ? null : toTimestamp(endDate)),
            start_time: (selectedFrequency == 'one time' ? toTimestamp(startDate, true) : (allDay ? null : toTimestamp(startTime, true))),
            end_time: (selectedFrequency == 'one time' ? (allDay ? null : toTimestamp(endTime, true)) : toTimestamp(endTime, true)),
            days: days.length > 0 ? days.join(',') : null
        }

        CurrentEmployee.update(emp => {
            let found = emp['blocked'].filter(b => b.id == $CurrentBlock['id'])
            console.log(`blocked map found==>`, found)
            if (found.length > 0) {
                emp['blocked'] = emp['blocked'].map(block => {
                    console.log(`blocked found map block==>`, block)
                    let obj = null
                    if (block.id == $CurrentBlock['id']) {
                        obj = {
                            ...$CurrentBlock,
                            ...updateBlock
                        }
                    }
                    else {
                        obj = { ...block }
                    }
                    console.log(`blocked map obj==>`, obj)
                    return obj
                })
            }
            else {
                console.log(`blocked not found $CurrentBlock==>`, $CurrentBlock)
                emp['blocked'].push({...$CurrentBlock})
            }

            return emp
        })
        console.log(`updateBlock CurrentEmployee ==>`, $CurrentEmployee)
        db.collection('employees').doc($CurrentEmployee['id']).set({ ...$CurrentEmployee })
    }

    const handleUpdate = () => {
        updateBlock()
    }

    const handleDelete = () => {
        dialogTitle = 'Delete this block?'
        dialogContent = 'Are you sure you want to continue?'
        dialogType = 'confirm'
        dialog.show()
    }

    const handleCancel = () => {
        if (isDirty) {
            dialogTitle = 'Your changes will be lost!'
            dialogContent = 'Are you sure you want to exit this page?'
            dialogType = 'confirm'
            dialog.show()
        }
        else {
            backToList()
        }
    }

    /* const toggleAllDays = () => {
        monday = selectAllDays
        toggleDay('monday', selectAllDays)
        
        tuesday = selectAllDays
        toggleDay('tuesday', selectAllDays)

        wednesday = selectAllDays
        toggleDay('wednesday', selectAllDays)

        thursday = selectAllDays
        toggleDay('thursday', selectAllDays)

        friday = selectAllDays
        toggleDay('friday', selectAllDays)

        saturday = selectAllDays
        toggleDay('saturday', selectAllDays)

        sunday = selectAllDays
        toggleDay('subday', selectAllDays)
    } */

    // const toggleDay = (day, toggle) => {
    /* const toggleDay = (day) => {
        /* if (toggle) {
            if (selectedDays.indexOf(day) < 0) {
                selectedDays.push(day)
            }
        }
        else {
            if (selectedDays.indexOf(day) >= 0) {
                selectedDays.splice(selectedDays.indexOf(day), 1)
            }
        } *
        console.log(`toggle selectedDays`, selectedDays)
    } */

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
        {#if $CurrentBlock}
            <Button label="Delete" on:mouseup={handleDelete} />
        {/if}
        <Button label="Cancel" on:mouseup={handleCancel} />
    </div>
</div>

<Modal bind:this={dialog} type={dialogType} on:confirm={backToList}>
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