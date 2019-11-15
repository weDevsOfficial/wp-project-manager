<template>
    <div class="wedevs-pm-wrap wrap pm pm-page-wrapper" id="wedevs-project-manager">
        <h1 style="display: none;"></h1>
        
        <do-action hook="pm-before-router-view"></do-action>
        <router-view></router-view>
        <do-action hook="addons-component"></do-action>
        
        <!-- <div class="pm-global-projects-wrap">
            <new-task-form v-if="taskForm" @disableTaskForm="closeTaskForm"></new-task-form>
        </div> -->

    </div>
</template>
<style>

</style>
<script>
    import do_action from '@components/common/do-action.vue';
    import NewTaskForm from '@components/my-tasks/new-task.vue';

    export default {
        components: {
            'do-action': do_action,
            'new-task-form': NewTaskForm
        },
        
        created () {
            this.registerModule();
            jQuery( document ).ajaxComplete(function(event, request, settings) {
                setTimeout(function(){
                    jQuery('a[rel=nofollow]').attr('target','_blank');
                },2000)
            });
        },

        mounted: function () {
            window.addEventListener('keydown', e => {
                let keycode = e.keyCode || e.which;
                if ( keycode === this.shiftkey && !this.otherkey ){
                    this.shiftDown = true;
                    this.otherkey = false;
                } else if (!this.cpressed && this.shiftDown && keycode === this.eKey && !this.otherkey ) {
                    e.preventDefault();
                    this.cpressed = true;
                    this.otherkey = false;
                    this.openTaskForm();
                } else if(this.cpressed && this.shiftDown && keycode === this.eKey ) {
                    e.preventDefault();
                    this.cpressed = false;
                    this.otherkey = false;
                    this.closeTaskForm();
                } else {
                    this.otherkey = true;
                }

                if ( keycode === this.escKey ) {
                    this.epressed = false;
                    this.shiftDown = false;
                    this.otherkey = false;
                    this.closeTaskForm();
                }
            });

            window.addEventListener('keyup', e => {
                let keycode = e.keyCode || e.which;
                this.otherkey = false;
                if ( keycode === this.shiftkey ) {
                    this.shiftDown = false;
                }
            });
        },

        methods: {
            registerModule () {
                let self = this;

                weDevsPmModules.forEach(function(module) {
                    let store = require('./components/'+module.path+'/store.js');
                    self.registerStore(module.name, store.default );
                });
            },
            closeTaskForm () {
                this.taskForm  = false;
                this.epressed  = false;
                this.shiftDown = false;
                this.otherkey  = false;
            },
            openTaskForm () {
                this.taskForm = true;
            }
        },

        data () {
            return {
                is_pro: PM_Vars.is_pro,
                users: [],
                taskForm: false,
                ctrlDown: false, 
                shiftDown: false, 
                epressed: false, 
                otherkey: false,
                ctrlKey: 17,
                cmdKey: 91,
                cmdKey2: 93,
                eKey: 13,
                escKey: 27,
                shiftkey: 16,
                enterkey: 13,
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

