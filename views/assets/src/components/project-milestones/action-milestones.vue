<template>
 <ul class="pm-links pm-right" v-if="user_can('create_milestone')">
    <li>
        <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="pm-icon-edit dashicons dashicons-edit " :title="__( 'Edit Milestone', 'pm' )"></a>
    </li>
    <li>
        <a @click.prevent="deleteSelfMilestone()" class="pm-milestone-delete dashicons dashicons-trash" :title="__( 'Delete milestone', 'pm' )" href="#"></a>
    </li>

    <li>
        <a v-if="is_complete" @click.prevent="milestoneMarkUndone(milestone)" class="pm-milestone-open dashicons dashicons-update" :title="__( 'Mark as incomplete', 'pm' )" href="#"></a>
    </li>
    <li>
        <a v-if="!is_complete" @click.prevent="milestoneMarkDone(milestone)" class="pm-milestone-complete dashicons dashicons-yes" :title="__( 'Mark as complete', 'pm' )" href="#"></a>
    </li>
    <li>
        <span :class="privateClass( milestone.meta.privacy )"></span>
    </li>
</ul>
</template>

<script>
    import Mixins from './mixin';
    
    export default {
        props: ['milestone'],

        mixins: [Mixins],

        data () {
            return {
                due_date: this.milestone.achieve_date.date,
            }
        },

        computed: {
            is_complete () {
                return this.milestone.status === 'complete' ? true : false;
            }
        },
        methods:{
            milestoneMarkDone (milestone) {
                milestone.status = 'complete';
                var args = {
                    data: {
                        id: milestone.id,
                        status: 'complete'
                    }
                }
                this.updateMilestone(args);
            },

            milestoneMarkUndone (milestone) {
                milestone.status = 'incomplete';
                var args = {
                    data: {
                        id: milestone.id,
                        status: 'incomplete'
                    }
                }
                this.updateMilestone(args);
            },
            deleteSelfMilestone(){
                var self = this;
                var args = {
                    milestone_id: this.milestone.id,
                    callback: function(res){
                        if (!self.$store.state.projectMilestones.milestones.length) {
                            self.$router.push({
                                name: 'milestones', 
                                params: { 
                                    project_id: self.project_id 
                                }
                            });
                        } else {
                            self.getSelfMilestones();
                        }

                        self.templateAction();
                    }
                }
                this.deleteMilestone( args );
            }
        }
    }
</script>