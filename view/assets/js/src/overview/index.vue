<template>
	<div>
		<router-view name="pm-overview"></router-view>
	</div>

</template>

<script>
    import store from './store';
    import mixin from './mixin';
    
    export default {
        store,
    }

</script>
