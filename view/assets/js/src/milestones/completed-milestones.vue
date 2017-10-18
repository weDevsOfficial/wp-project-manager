<template>
    <div  v-if="completedMilestones.length" class="pm-complete-milestone pm-milestone-data">
        <h2 class="group-title">Completed Milestones</h2>

        <div v-for="milestone in completedMilestones" class="pm-milestone complete">
            <div class="milestone-detail ">
                <h3 class="milestone-head">
                    {{ milestone.title }} <br>
                   <action :milestone="milestone"></action>
                </h3>

                <div class="detail">
                    <div v-html="milestone.description"></div>
                </div>
            </div>

            <div class="pm-milestone-edit-form" v-if="milestone.edit_mode">
                <new-milestone-form section="milestones" :milestone="milestone"></new-milestone-form>
            </div>
            <div class="pm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="pm-col-6 pm-milestone-todo pm-sm-col-12">
                    <h3>Task List</h3>

                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>

                <div v-if="milestone.discussion_boards.data.length"  class="pm-col-6 pm-milestone-discussion pm-last-col pm-sm-col-12">
                    <h3>Discussion</h3>

                    <ul>
                        <li v-for="discuss in milestone.discussion_boards.data">
                            <discuss :discuss="discuss"></discuss>
                        </li>
                    </ul>
                </div>

                <div class="clearfix"></div>
            </div>

            <div class="pm-milestone-completed">
                Completed on: 
                <time datetime="2017-09-20T05:21:16+00:00" title="2017-09-20T05:21:16+00:00">September 20, 2017 5:21 am</time>            
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

