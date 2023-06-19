<script>
    import { createEventDispatcher } from "svelte";
    import { Employees } from "../../../store/resources";
    
    import Button from "../../shared/Button.svelte";
    import Checkbox from "../../shared/Checkbox.svelte";
    import FormField from "../../shared/FormField.svelte";
    import Modal from "../../shared/Modal.svelte";

    export let employee = null
</script>

<div class="form">
    <FormField label="Employee Name" required=true>
        <input type="text" id="employeeName" name="employeeName" /> 
    </FormField>
</div>

<style></style>