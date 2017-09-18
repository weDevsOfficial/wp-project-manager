<template>
	<div>
		<router-view name="discussions"></router-view>
		<router-view name="individual-discussion"></router-view>
	</div>
</template>

<script>
    import store from './store';
    import mixin from './mixin';
    
    export default {
        store,
    }

</script>
