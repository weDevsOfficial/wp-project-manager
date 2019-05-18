<template>
    <div v-if="lateMileStones.length" class="pm-late-milestone pm-milestone-data">
        <h2 class="group-title">{{ __( 'Late Milestones', 'wedevs-project-manager') }}</h2>
        <div v-for="milestone in lateMileStones" class="pm-milestone late">
            <div class="milestone-detail ">
                <h3 class="milestone-head">
                    {{ milestone.title }} <br>
                    <span class="time-left">
                        ({{ humanDate(milestone) }} - 
                        <time :datetime="momentFormat(milestone)" :title="momentFormat(milestone)">
                            {{ getDueDate(milestone) }}
                        </time>)
                    </span>
                    
                    <action :milestone="milestone"></action>
                </h3>

                <div class="detail">
                    <div v-html="milestone.content"></div>
                </div>
            </div>

            <div class="pm-milestone-edit-form" v-if="can_edit_milestone(milestone)">
                <transition name="slide">
                    <new-milestone-form section="milestones" v-if="milestone.edit_mode" :milestone="milestone"></new-milestone-form>
                </transition>
            </div>
            <div class="pm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="pm-col-6 pm-milestone-todo pm-sm-col-12">
                    <h3>{{ __( 'Task Lists', 'wedevs-project-manager')  }}</h3>
                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>
               
                <div v-if="milestone.discussion_boards.data.length"  class="pm-col-6 pm-milestone-discussion pm-last-col pm-sm-col-12">
                    <h3>{{  __( 'Discussions', 'wedevs-project-manager') }}</h3>
                    <ul>
                        <li v-for="discuss in milestone.discussion_boards.data">
                            <discuss :discuss="discuss"></discuss>
                        </li>
                    </ul>
                </div>
                <div class="clearfix"></div>
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
            lateMileStones () {
                var milestones = this.$store.state.projectMilestones.milestones.filter(function(milestone) {
                    
                    if ( milestone.status === 'complete' ) {
                        return false;
                    }

                    var due_date = milestone.achieve_date.date;
                    
                    if ( !due_date ) {
                        return milestone;
                    }

                    due_date = new Date(due_date);
                    due_date = pm.Moment(due_date).format('YYYY-MM-DD');

                    if ( ! pm.Moment( due_date ).isValid() ) {
                        return false;
                    }

                    var today   = pm.Moment().format( 'YYYY-MM-DD' ),
                        due_day = pm.Moment( due_date).format( 'YYYY-MM-DD' );
                    
                    
                    return pm.Moment(due_day).isBefore(today) ? milestone : false;
                });

                milestones = _.sortBy(milestones, function(milestone) { return milestone.achieve_date.date; });
                
                return milestones;
            },
        },

        methods: {
            humanDate (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                    due_date = new Date(due_date),
                    due_date = pm.Moment(due_date).format();

                return pm.Moment(due_date).fromNow();
            },
            momentFormat (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                    due_date = new Date(due_date),
                    due_date = pm.Moment(due_date).format();

                return due_date;
            },
            getDueDate (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                var due_date = this.dateFormat(due_date);

                return due_date;
            }
        }
    }
</script>

