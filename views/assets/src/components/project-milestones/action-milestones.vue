<template>
 <ul class="pm-links pm-right" v-if="can_edit_milestone(milestone)">
    <li>
        <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="pm-icon-edit dashicons dashicons-edit " :title="edit_milestone"></a>
    </li>
    <li>
        <a @click.prevent="deleteSelfMilestone()" class="pm-milestone-delete dashicons dashicons-trash" :title="delete_milestone" href="#"></a>
    </li>

    <li>
        <a v-if="is_complete" @click.prevent="milestoneMarkUndone(milestone)" class="pm-milestone-open dashicons dashicons-update" :title="mark_as_incomplete" href="#"></a>
    </li>
    <li>
        <a v-if="!is_complete" @click.prevent="milestoneMarkDone(milestone)" class="pm-milestone-complete dashicons dashicons-yes" :title="mark_as_complete" href="#"></a>
    </li>
    <li>
        <a href="#" @click.prevent="milestoneLockUnlock(milestone)" v-if="PM_Vars.is_pro && user_can('view_private_milestone')"><span :class="privateClass( milestone.meta.privacy )"></span></a>
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
                edit_milestone: __( 'Edit Milestone', 'pm' ),
                delete_milestone: __( 'Delete milestone', 'pm' ),
                mark_as_incomplete: __( 'Mark as incomplete', 'pm' ),
                mark_as_complete: __( 'Mark as complete', 'pm' ),


            }
        },

        computed: {
            is_complete () {
                return this.milestone.status === 'complete' ? true : false;
            }
        },
        methods:{
            milestoneMarkDone (milestone) {
                var args = {
                    data: {
                        id: milestone.id,
                        title: milestone.title,
                        status: 'complete'
                    },
                    callback (res) {
                        milestone.status = 'complete';
                    }
                }
                this.updateMilestone(args);
            },

            milestoneMarkUndone (milestone) {
                var args = {
                    data: {
                        id: milestone.id,
                        title: milestone.title,
                        status: 'incomplete'
                    },
                    callback (res) {
                        milestone.status = 'incomplete';
                    }
                }
                this.updateMilestone(args);
            },
            deleteSelfMilestone(){

                var self = this;
                var hasCurrentPage = self.$route.params.current_page_number;
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
                            if(hasCurrentPage) {
                               self.$store.commit( 'projectMilestones/fetchMilestoneStatus', false ); 
                            }
                            
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