<script></script>

<div data-modal class="modal">
    <div class="modal-header">
        <!-- {$modalTitle} -->
    </div>
    <div class="modal-content">
        <!-- {$modalText} -->
    </div>
    <footer>
        <!-- {#if $modalType == 'confirm'}
            <button type="button" class="btn-action" on:click={handleConfirm}>Confirm</button>
        {/if}
        <button type="button" class="btn-def" on:click={handleCancel}>{$modalType=='confirm' ? 'Cancel' : 'Close'}</button> -->
    </footer>
</div>


<style></style>