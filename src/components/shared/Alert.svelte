<script>
    export let text = 'Default alert'
    export let type = 'message'

    let alertClass = `alert alert-${type}`
</script>

<span class={alertClass}>{text}</span>

<style>
    .alert {
        padding: 1rem 2rem;
        border: 0;
        border-radius: 0.5rem;
    }
    .alert-message {
        background-color: rgb(235, 245, 255);
        color: rgb(30, 66, 159);
    }
</style>