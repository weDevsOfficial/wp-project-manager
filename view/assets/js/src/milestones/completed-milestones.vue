<template>
    <div  v-if="completedMilestones.length" class="cpm-complete-milestone cpm-milestone-data">
        <h2 class="group-title">{{text.completed_milestones}}</h2>

        <div v-for="milestone in completedMilestones" class="cpm-milestone complete">
            <div class="milestone-detail ">
                <h3 class="milestone-head">
                    {{ milestone.title }} <br>
                   <action :milestone="milestone"></action>
                </h3>

                <div class="detail">
                    <div v-html="milestone.description"></div>
                </div>
            </div>

            <div class="cpm-milestone-edit-form" v-if="milestone.edit_mode">
                <new-milestone-form section="milestones" :milestone="milestone"></new-milestone-form>
            </div>
            <div class="cpm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="cpm-col-6 cpm-milestone-todo cpm-sm-col-12">
                    <h3>{{text.task_lists}}</h3>

                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>

                <div v-if="milestone.discussion_boards.data.length"  class="cpm-col-6 cpm-milestone-discussion cpm-last-col cpm-sm-col-12">
                    <h3>{{text.discussions}}</h3>

                    <ul>
                        <li v-for="discuss in milestone.discussion_boards.data">
                            <discuss :discuss="discuss"></discuss>
                        </li>
                    </ul>
                </div>

                <div class="clearfix"></div>
            </div>

            <div class="cpm-milestone-completed">
                {{text.completed_on}}
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

	export default {
        components: {
            'new-milestone-form': new_milestone_form,
            'list': list,
            'action': action,
            'discuss': discuss
        },
        computed: {
            completedMilestones () {
                return this.$store.state.milestones.filter(function(milestone) {
                    return milestone.status === 'complete' ? milestone : false;
                });
            },
        }
	}
</script>

