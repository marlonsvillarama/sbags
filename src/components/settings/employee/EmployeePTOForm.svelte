<script>
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";
    import { db } from "../../../firebase";
    import { Timestamp } from "firebase/firestore";
    import { CurrentEmployee, CurrentPTO } from "../../../store/resources";
    
    import Button from "../../shared/Button.svelte";
    import InputDate from "../../shared/form/InputDate.svelte";
    import InputText from "../../shared/form/InputText.svelte";
    import InputCheckbox from "../../shared/form/InputCheckbox.svelte";
    import InputNumber from "../../shared/form/InputNumber.svelte";
    import Modal from "../../shared/Modal.svelte";

    let dispatch = createEventDispatcher()
    // let employeeName = $CurrentEmployee ? $CurrentEmployee['uid'] : ''
    // let employeeActive = $CurrentEmployee ? $CurrentEmployee['active'] : true
    // let employeeHours = $CurrentEmployee ? $CurrentEmployee['maxhours'] : 40
    let ctaLabel = `${$CurrentPTO ? 'Update' : 'Create'} time off`
    let isDirty = false
    let dialog
    let dialogTitle = ''
    let dialogContent = ''
    let dialogType = ''
    let inputName
    let inputHours
    let ptoDate

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

    const updatePTO = async () => {
        $CurrentPTO = {
            employee: $CurrentEmployee['id'],
            date: toTimestamp(ptoDate)
        }
        db.collection('timeoffs').doc($CurrentPTO['id']).set({ ...$CurrentPTO })

        dispatch('action', {
            action: 'navigate',
            page: 'timeoffs'
        })
    }

    const handleUpdate = async () => {
        isDirty = checkDirty()
        if (isDirty) {
            dialogTitle = 'One or more fields are required.'
            dialogContent = 'Please make sure all required fields are filled out corectly.'
            dialogType = 'alert'
            dialog.show()
            return
        }

        updatePTO()
    }

    const backToList = () => {
        dispatch('action', {
            action: 'navigate',
            page: 'timeoffs'
        })
        $CurrentPTO = null
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

    const checkDirty = () => {
        /* isDirty = (
            inputName.isDirty() ||
            inputHours.isDirty()
        ) */
        // console.log('EmployeeInfoForm checkDirty isDirty ==>', isDirty)
        return ptoDate == '' || ptoDate == null || ptoDate == undefined
    }

    const init = () => {
        if (!$CurrentPTO['id']) {
            return
        }

        ptoDate = $CurrentPTO['date'].toDate()
    }

    onMount(() => init())
</script>

<div id="" class="form">
    <InputDate bind:value={ptoDate} label="Date" required on:change={checkDirty} />

    <div class="actions">
        <Button label={ctaLabel} type="cta" on:mouseup={handleUpdate} />
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
</style>