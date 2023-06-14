<script>

</script>

<div class="button-group">
    <slot></slot>
</div>

<style>
    .button-group {
        display: flex;
        flex-direction: row;
        gap: -1px;
    }
    .button-group button:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
    .button-group button:last-child {
        border-top-right-radius: var(--btn-border-radius) !important;
        border-bottom-right-radius: var(--btn-border-radius) !important;
    }
</style>