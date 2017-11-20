<template>
 <ul class="pm-links pm-right">
    <li>
        <a @click.prevent="showHideMilestoneForm('toggle', milestone)" class="pm-icon-edit dashicons dashicons-edit " :title="text.edit_milestone"></a>
    </li>
    <li>
        <a @click.prevent="deleteSelfMilestone()" class="pm-milestone-delete dashicons dashicons-trash" :title="text.delete_milestone" href="#"></a>
    </li>

    <li>
        <a v-if="is_complete" @click.prevent="milestoneMarkUndone(milestone)" class="pm-milestone-open dashicons dashicons-update" :title="text.mark_as_incomplete" href="#"></a>
    </li>
    <li>
        <a v-if="!is_complete" @click.prevent="milestoneMarkDone(milestone)" class="pm-milestone-complete dashicons dashicons-yes" :title="text.mark_as_complete" href="#"></a>
    </li>
    <li>
        <span class="pm-unlock"></span>
    </li>
</ul>
</template>

<script>
    export default {
        props: ['milestone'],

        mixins: [PmMixin.projectMilestones],

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