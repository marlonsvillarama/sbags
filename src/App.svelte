<script>
	import 'normalize.css'
  	import './assets/css/global.css'
  	import './assets/css/calendar.css'

	import PageHeader from './components/PageHeader.svelte'
	import PageFooter from './components/PageFooter.svelte'
	import CalendarView from './components/CalendarView.svelte'
	import CalendarViewHeader from './components/CalendarViewHeader.svelte'
</script>

<div class="container">
	<PageHeader />
	<CalendarViewHeader />
	
	<div class="content">
		<CalendarView />
	</div>
	
	<PageFooter />
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2rem;
		height: 100%;
		width: 100%;
	}
	.content {
		flex: 1;
		border: 0px solid red;
		overflow-x: hidden;
		overflow-y: scroll;
		margin-top: -0.75rem;
	}
</style>
