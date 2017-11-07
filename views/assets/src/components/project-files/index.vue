<template>
    <div>
        <router-view name="pm-files"></router-view>
    </div>

</template>

<script>
    import store from './store';
    import mixin from './mixin';
    
    export default {
    	state: store.state,
	    
	    mutations: store.mutations,
        
        created () {
        	this.registerStore('pmFiles');
        }
    }

</script>
