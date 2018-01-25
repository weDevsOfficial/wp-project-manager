<template>
    <div class="wedevs-pm-wrap pm wrap" id="wedevs-project-manager">
        <router-view></router-view>

        <do-action hook="addons-component"></do-action> 
    </div>
</template>

<script>
    import do_action from './components/common/do-action.vue';
    
    export default {
        components: {
            'do-action': do_action,
        },

        created () {
            this.registerModule();
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

