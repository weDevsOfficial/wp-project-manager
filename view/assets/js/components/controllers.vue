<template>
	<div class="wedevs-pm-wrap">
		<router-view name="project-lists"></router-view>
		<router-view name="categories"></router-view>
		<router-view name="add-ons"></router-view>
		<router-view name="my-tasks"></router-view>
		<router-view name="calendar"></router-view>
		<router-view name="reports"></router-view>
		<router-view name="progress"></router-view>
		<router-view name="settings"></router-view>
	</div>
</template>


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
<!--<style scoped>
	#projects {
		
	}

</style> -->

