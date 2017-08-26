<template>
	<div id="ttt">
		i am default template
		<do-action :hook="'cpm-after-title'"></do-action>
	</div>
</template>

<script>

	import mixin from '../mixin';
	import do_action from './do-action.vue';

	var this_component = {
		
		mixins: [mixin],

		components: {
			'do-action': do_action
		},
	}

	export default this_component;

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#projects {
		
	}

</style>