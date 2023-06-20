<script>
	import 'normalize.css'
  	import './assets/css/global.css'
  	import './assets/css/calendar.css'
  	import './assets/css/tile.css'
	import './assets/css/fields.css'

	import { navigate, Route, Router } from 'svelte-routing'
	import Button from './components/shared/Button.svelte'
	import PageHeader from './components/page/PageHeader.svelte'
	import PageFooter from './components/page/PageFooter.svelte'
	import CalendarView from './components/calendar/CalendarView.svelte'
	import CalendarViewHeader from './components/calendar/CalendarViewHeader.svelte'
	import SettingsView from './components/settings/SettingsView.svelte'
	import Modal from './components/shared/Modal.svelte'

	const navigateRoute = (route) => {
		navigate(`/${route}`)
	}

	const handleMouseUp = (data) => {
		switch(data.action) {
			case 'navigate': {
				navigateRoute(data.page)
				break;
			}
			default: break;
		}
	}
</script>

<div class="container">
	<Router>
		<Route path="/">
			<PageHeader mode='home' on:mouseup={(e)=>handleMouseUp(e.detail)} />
			<CalendarViewHeader />
			<div class="content">
				<CalendarView />
			</div>
			<PageFooter />
		</Route>
	
		<Route path="/settings">
			<PageHeader mode='settings' on:mouseup={(e)=>handleMouseUp(e.detail)} />
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
