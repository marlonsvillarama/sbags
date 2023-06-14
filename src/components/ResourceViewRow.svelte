<script>
    import Tile from "./ScheduleTile.svelte";
    export const resource = {}
</script>

<div class="view-row">
    <div class="row-side">
        <h3>{resource.name || ' '}</h3><br/>
        <span>Max Hours: {resource.maxHours || 0}</span>
    </div>
    <div class="row-day">
        <Tile>
            <span>8 AM - 10 AM</span>
        </Tile>
    </div>
    <div class="row-day">
        Tuesday
    </div>
    <div class="row-day">
        Wednesday
    </div>
    <div class="row-day">
        Thursday
    </div>
    <div class="row-day">
        Friday
    </div>
    <div class="row-day">
        Saturday
    </div>
    <div class="row-day">
        Sunday
    </div>
</div>

<style>
    .view-row {
        border-bottom: 1px solid var(--border-gray-lite);
        display: flex;
        flex-direction: row;
        padding-bottom: 0.5rem;
    }
    .row-side {
        width: 10%;
        padding: 0.5rem;
        border-right: 1px solid var(--border-gray-lite);
        display: flex;
        align-items: center;
    }
    .row-day {
        flex: 1;
        padding: 0 0.5rem;
    }
    .row-day:not(:last-child):not(:nth-child(8)) {
        border-right: 1px solid var(--border-gray-lite);
    }
</style>