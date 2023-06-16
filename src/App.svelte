<script>
	import 'normalize.css'
  	import './assets/css/global.css'
  	import './assets/css/calendar.css'
  	import './assets/css/tile.css'

	import { navigate, Route, Router } from 'svelte-routing'
	import PageHeader from './components/PageHeader.svelte'
	import PageFooter from './components/PageFooter.svelte'
	import CalendarView from './components/CalendarView.svelte'
	import CalendarViewHeader from './components/CalendarViewHeader.svelte'
	import SettingsView from './components/SettingsView.svelte'

	const navigateRoute = (route) => {
		navigate(`/${route}`)
	}
</script>

<div class="container">
	<Router>
		<Route path="/">
			<PageHeader mode='home' on:opensettings={()=>navigateRoute('settings')} />
			<CalendarViewHeader />
			
			<div class="content">
				<CalendarView />
			</div>
	
			<PageFooter />
		</Route>
	
		<Route path="/settings">
			<PageHeader mode='settings' on:openhome={()=>navigateRoute('')} />
			<SettingsView />
		</Route>
	</Router>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 2rem;
		height: 100%;
		width: 100%;
	}
	.content {
		flex: 1;
		border: 0px solid red;
		overflow-x: hidden;
		overflow-y: scroll;
		/* margin-top: -0.75rem; */
	}
</style>
