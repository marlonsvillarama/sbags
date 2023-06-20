<script>
    import { createEventDispatcher } from "svelte";
    import { ModalData } from "../../store/modal";
    
    export let type = 'alert'
    let dialog
    let okClass = 'button btn-cta'
    let dispatch = createEventDispatcher()
    let visible = false

    const handleConfirm = () => {
        dispatch('confirm', {})
    }

    /* const handleCancel = () => {
        // dispatch('cancel', {})
        hide()
    } */

    export const show = () => {
        /* let modal = document.querySelector('[data-modal]')
        let overlay = document.querySelector('[data-overlay]')

        modal['style'].display = 'block'
        overlay['style'].display = 'block' */
        dialog.showModal()
    }

    export const hide = () => {
        /* let modal = document.querySelector('[data-modal]')
        let overlay = document.querySelector('[data-overlay]')

        modal['style'].display = 'none'
        overlay['style'].display = 'none' */
        dialog.close()
    }
</script>

<dialog bind:this={dialog}
    on:close={() => (visible = false)}
>
    <div class="modal-header">
        <slot name="header"></slot>
    </div>

    <div class="modal-content">
        <slot name="content"></slot>
    </div>
    
    <footer>
        {#if type == 'confirm'}
            <button type="button" class="btn-action" on:click={handleConfirm}>Confirm</button>
        {/if}
        <button type="button" class="btn-def" on:click={hide}>{type=='confirm' ? 'Cancel' : 'Close'}</button>
    </footer>
</dialog>
<!-- <div data-overlay class="overlay"></div>
<div data-modal class="modal">
    <div class="modal-header">
        -- {$ModalData.title} --Modal title
    </div>
    <div class="modal-content"></div>
    <footer>
        -- {#if $ModalData.type == 'confirm'} --
            <button type="button" class="btn-action" on:click={handleConfirm}>Confirm</button>
        -- {/if} --
        <button type="button" class="btn-def" on:click={handleCancel}>{$ModalData.type=='confirm' ? 'Cancel' : 'Close'}</button>
    </footer>
</div> -->

<style>
    /* .overlay { */
    dialog::backdrop {
        /* display: none;
        position: fixed;
        inset: 0; */
        background: rgba(0, 0, 0, 0.5);
        /* z-index: 9; */
    }
    /* .modal { */
    dialog {
        /* display: none; */
        position: fixed;
        top: 20%;
        left: 50%;
        translate: -50% -20%;
        background: white;
        border-radius: 0.5rem;
        border: 0;
        /* z-index: 10; */
        width: 40rem;
    }
    /* .modal > div { */
    dialog > div {
        padding: 0.75rem 1.25rem;
    }
    .modal-header {
        border-bottom: 1px solid var(--color-hairline);
        color: var(--font-color-gray-med);
        font-weight: 700;
        font-size: 1.5rem;
    }
    .modal-content {
        line-height: 1.5rem;
    }
    footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content:flex-end;
        padding: 1rem 1.25rem;
        gap: 1rem;
    }
    button {
        outline: 0;
        border: 0;
    }
    .btn-def {
        background-color: var(--color-btn-default);
        color: var(--color-strand-red);
    }
    .btn-def:hover {
        /* background-color: var(--color-strand-red-full); */
        background-color: var(--color-btn-default-hover);
        /* color: white; */
    }
    .btn-action {
        background-color: var(--color-strand-red);
        color: white;
    }
    .btn-action:hover {
        background-color: var(--color-strand-red-full);
    }
</style>