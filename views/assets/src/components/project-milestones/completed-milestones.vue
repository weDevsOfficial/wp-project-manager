<template>
    <div  v-if="completedMilestones.length" class="pm-complete-milestone pm-milestone-data">
        <h2 class="group-title">{{ __( 'Completed Milestones', 'wedevs-project-manager') }}</h2>
        <div v-for="milestone in completedMilestones" class="pm-milestone complete">
            <div class="milestone-detail ">
                <h3 class="milestone-head">
                    <span v-html="milestone.title"></span>
                    <br>
                    <action :milestone="milestone"></action>
                </h3>

                <div class="detail">
                    <div v-html="milestone.description"></div>
                </div>
            </div>

            <div class="pm-milestone-edit-form" v-if="can_edit_milestone(milestone)">
                <transition name="slide">
                    <new-milestone-form section="milestones" v-if="milestone.edit_mode" :milestone="milestone"></new-milestone-form>
                </transition>
            </div>
            <div class="pm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="pm-col-6 pm-milestone-todo pm-sm-col-12">
                    <h3>{{ __( 'Task Lists', 'wedevs-project-manager') }}</h3>
                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>

                <div v-if="milestone.discussion_boards.data.length"  class="pm-col-6 pm-milestone-discussion pm-last-col pm-sm-col-12">
                    <h3>{{ __( 'Discussions', 'wedevs-project-manager')}}</h3>
                    <ul>
                        <li v-for="discuss in milestone.discussion_boards.data">
                            <discuss :discuss="discuss"></discuss>
                        </li>
                    </ul>
                </div>

                <div class="clearfix"></div>
            </div>
            <div class="pm-milestone-completed">
                {{ __( 'Completed on:', 'wedevs-project-manager') }}
                <time :datetime="milestone.achieved_at.date +' '+ milestone.achieved_at.time" :title="milestone.achieved_at.date +' '+ milestone.achieved_at.time">{{milestone.achieved_at.date}} {{milestone.achieved_at.time}}</time>            
            </div>
        </div>
    </div>
</template>

<script>
    import new_milestone_form from './new-milestone-form.vue';
    import list from './list.vue';
    import action from './action-milestones.vue';
    import discuss from './milestone-discussion.vue';
    import Mixins from './mixin';

    export default {
        mixins: [Mixins],
        components: {
            'new-milestone-form': new_milestone_form,
            'list': list,
            'action': action,
            'discuss': discuss
        },
        computed: {
            completedMilestones () {
                var milestones = this.$store.state.projectMilestones.milestones.filter(function(milestone) {
                    return milestone.status === 'complete' ? milestone : false;
                });

                milestones = _.sortBy(milestones, function(milestone) { return milestone.achieved_at.date; });
                
                return milestones.reverse();
            },
        }
    }
</script>

