<template>
    <div class="wedevs-pm-wrap wrap pm pm-page-wrapper" id="wedevs-project-manager">
        <do-action hook="pm-before-router-view"></do-action>
        <router-view></router-view>

        <do-action hook="addons-component"></do-action>

    </div>
</template>
<style>

</style>
<script>
    import do_action from '@components/common/do-action.vue';

    export default {
        components: {
            'do-action': do_action,
        },

        created () {
            this.registerModule();
            jQuery( document ).ajaxComplete(function(event, request, settings) {
                setTimeout(function(){
                    jQuery('a[rel=nofollow]').attr('target','_blank');
                },2000)
            });
        },

        methods: {
            registerModule () {
                let self = this;

                weDevsPmModules.forEach(function(module) {
                    let store = require('./components/'+module.path+'/store.js');
                    self.registerStore(module.name, store.default );
                });
            }
        },

        data () {
            return {
                is_pro: PM_Vars.is_pro
            }
        }

    }
</script>

<!-- Global style -->
<style>
    #nprogress .bar {
        z-index: 99999;
    }

</style>

