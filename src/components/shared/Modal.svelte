<script>
    import { createEventDispatcher } from "svelte";
    import { ModalData, modalText, modalTitle, modalType } from "../../store/modal";
    

    let okClass = 'button btn-cta'
    let dispatch = createEventDispatcher()
    let text = ''
    let title = 'Default title'
    let type = 'alert'

    const handleConfirm = () => {
        dispatch('confirm', {})
    }

    const handleCancel = () => {
        dispatch('cancel', {})
    }

    export const show = () => {
        let modal = document.querySelector('[data-modal]')
        let overlay = document.querySelector('[data-overlay]')

        modal['style'].display = 'block'
        overlay['style'].display = 'block'
    }

    export const hide = () => {
        let modal = document.querySelector('[data-modal]')
        let overlay = document.querySelector('[data-overlay]')

        modal['style'].display = 'none'
        overlay['style'].display = 'none'
    }
</script>

<div data-overlay class="overlay"></div>
<div data-modal class="modal">
    <div class="modal-header">
        {$ModalData.title}
    </div>
    <div class="modal-content">
        {$ModalData.text}
    </div>
    <footer>
        {#if $ModalData.type == 'confirm'}
            <button type="button" class="btn-action" on:click={handleConfirm}>Confirm</button>
        {/if}
        <button type="button" class="btn-def" on:click={handleCancel}>{$ModalData.type=='confirm' ? 'Cancel' : 'Close'}</button>
    </footer>
</div>

<style>
    .overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9;
    }
    .modal {
        display: none;
        position: fixed;
        top: 20%;
        left: 50%;
        translate: -50% -20%;
        background: white;
        border-radius: 0.5rem;
        z-index: 10;
        width: 30rem;
    }
    .modal > div {
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
        justify-content: space-between;
        padding: 1rem 1.25rem;
        /* background-color: aliceblue; */
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