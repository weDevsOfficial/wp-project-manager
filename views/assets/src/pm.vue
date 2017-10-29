<template>
	<div class="wedevs-pm-wrap pm wrap">
		<pm-projects></pm-projects>
		<pm-overview></pm-overview>
		<pm-discussions></pm-discussions>
		<pm-activities></pm-activities>
		<pm-milestones></pm-milestones>
		<pm-categories></pm-categories>
		<pm-task-lists></pm-task-lists>
		<pm-files></pm-files>
		<pm-settings></pm-settings>
		<router-view name="add-ons"></router-view>
		<router-view name="my-tasks"></router-view>
		<router-view name="calendar"></router-view>
		<router-view name="reports"></router-view>
		<router-view name="progress"></router-view>


		<do-action hook="addons-component"></do-action>
	</div>
</template>

<script>
	import discussions from './discussions/index.vue';
	import projects from './project-lists/index.vue';
	import overview from './overview/index.vue';
	import activities from './activities/index.vue';
	import milestones from './milestones/index.vue';
	import categories from './categories/index.vue';
	import task_lists from './task-lists/index.vue';
	import files from './files/index.vue';
	import do_action from './common/do-action.vue';
	import settings from './settings/index.vue';

	export default {
		components: {
			'pm-discussions': discussions,
			'pm-projects': projects,
			'pm-overview': overview,
			'pm-activities': activities,
			'pm-milestones': milestones,
			'pm-categories': categories,
			'pm-task-lists': task_lists,
			'pm-files': files,
			'do-action': do_action,
			'pm-settings': settings
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
		<do-action :hook="'pm-after-title'"></do-action>
	</div>
</template>-->

<!-- <script>

// 	import mixin from '../mixin';
// 	import do_action from './common/do-action.vue';

// 	var this_component = {
		
// 		mixins: [mixin],

// 		components: {
// 			'do-action': do_action
// 		},
// 	}

// 	export default this_component;

// </script> -->

<!-- Add "scoped" attribute to limit CSS to this component only -->


