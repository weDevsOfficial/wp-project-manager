<template>
    <div class="wedevs-pm-wrap wrap pm pm-page-wrapper" id="wedevs-project-manager">
        <h1 class="hrm-h1"></h1>
        <do-action hook="pm-before-router-view"></do-action>
        <router-view></router-view>

        <do-action hook="addons-component"></do-action>

    </div>
</template>
<style>
    .hrm-h1 {
        margin: 0 !important;
        padding: 0 !important;
    }
</style>
<script>
    import do_action from './components/common/do-action.vue';

    export default {
        components: {
            'do-action': do_action,
        },

        created () {
            this.registerModule();
        },

        // watch: {
        //     $route(to, from) {
        //         this.$store.commit('recordHistory', {
        //             to, from
        //         });
        //     }
        // },

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

