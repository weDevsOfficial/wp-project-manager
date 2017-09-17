<template>
	<div>
		<router-view name="task-lists"></router-view>
		<router-view name="single-list"></router-view>
	</div>
</template>

<script>
	import store from './store';
	import mixin from './mixin';

	export default {
		store,
	}
</script>
