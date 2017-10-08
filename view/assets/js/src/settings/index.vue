<template>
	<div>
		<settings-header></settings-header>
		<router-view name="general"></router-view>
		<router-view name="email"></router-view>
	</div>
</template>

<script>
    import store from './store';
    import mixin from './mixin';
    import header from './header.vue';
    
    export default {
        store,
        components: {
			'settings-header': header
		}
    }

</script>

<style>
	.router-link-exact-active {
		margin-bottom: -1px;
		border-bottom: 1px solid #f1f1f1;
    	background: #f1f1f1;
	}
	    
</style>
