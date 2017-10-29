<template>
	<div>
		<router-view name="activities"></router-view>
	</div>
</template>

<script>
	import mixin from './mixin';
	import store from './store';

	export default {
        store,
    }
</script>
