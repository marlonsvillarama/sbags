<script>
    import { Link, Route, Router } from "svelte-routing";
    import Root from "./components/routing/Root.svelte";
    import Settings from "./components/routing/settings/Settings.svelte";
</script>

<Router>
    <Route path="/" component={Root} />

    <Route path="/settings" component={Settings} />
</Router>

<style></style>