<script>
    import { CurrentBlock } from "../../../store/resources";

    import Button from "../../shared/Button.svelte";

    let ctaLabel = `${$CurrentBlock ? 'Update' : 'Create'} Block Time`

    const handleUpdate = () => {}

    const handleCancel = () => {}
</script>

<div id="" class="form">
    <!-- <InputText bind:this={inputName} label="Employee name" required bind:value={employeeName} on:change={checkDirty} /> -->
    <!-- <InputCheckbox label="Is Active" bind:checked={employeeActive} on:change /> -->
    <!-- <InputNumber bind:this={inputHours} label="Hours per week" required bind:value={employeeHours} on:change={checkDirty} /> -->

    <div class="actions">
        <Button label={ctaLabel} type="cta" on:mouseup={handleUpdate} />
        <Button label="Cancel" on:mouseup={handleCancel} />
    </div>
</div>

<style></style>