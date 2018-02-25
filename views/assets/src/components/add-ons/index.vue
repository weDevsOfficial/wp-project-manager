<template>
    <p>Hi i am add ons</p>
</template>

<script>
    import mixin from './../../helpers/mixin/mixin';
    
    export default {
        mixins: [mixin],
        mounted: function(){
	        pm.NProgress.done();
	    },
        methods: {

        }
    }
</script>