<script>
    export let title = ''
    export let border = true
    
    let headerClass = `card-header${ border ? ' header-border' : ''}`
</script>

<div class={headerClass}>
    <span class="header-title">{title}</span>
</div>

<style>
    .card-header {
        padding: 1rem 2rem;
    }
    .header-border {
        border-bottom: 1px solid var(--border-gray-lite)
    }
    .header-title {
        font-size: 1.3125rem;
        font-weight: 700;
    }
</style>