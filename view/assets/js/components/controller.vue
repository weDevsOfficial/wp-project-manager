<template>
	<div class="wedevs-pm-wrap cpm wrap">
		<pm-projects></pm-projects>
		<pm-overview></pm-overview>
		<pm-discussions></pm-discussions>
		<pm-activities></pm-activities>
		<pm-milestones></pm-milestones>
		<router-view name="categories"></router-view>
		<router-view name="add-ons"></router-view>
		<router-view name="my-tasks"></router-view>
		<router-view name="calendar"></router-view>
		<router-view name="reports"></router-view>
		<router-view name="progress"></router-view>
		<router-view name="settings"></router-view>
	</div>
</template>

<script>
	import discussions from './discussions/index.vue';
	import projects from './project-lists/index.vue';
	import overview from './overview/index.vue';
	import activities from './activities/index.vue';
	import milestones from './milestones/index.vue';

	export default {
		components: {
			'pm-discussions': discussions,
			'pm-projects': projects,
			'pm-overview': overview,
			'pm-activities': activities,
			'pm-milestones': milestones
		}
		
	}
</script>

<!-- Global style -->
<style>
	#nprogress .bar {
		z-index: 99999;
	}

</style> 


<!--<template>
	<div id="ttt">
		i am default template
		<do-action :hook="'cpm-after-title'"></do-action>
	</div>
</template>-->

<!-- <script>

// 	import mixin from '../mixin';
// 	import do_action from './do-action.vue';

// 	var this_component = {
		
// 		mixins: [mixin],

// 		components: {
// 			'do-action': do_action
// 		},
// 	}

// 	export default this_component;

// </script> -->

<!-- Add "scoped" attribute to limit CSS to this component only -->


