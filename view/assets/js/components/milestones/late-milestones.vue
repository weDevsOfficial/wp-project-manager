<template>
	<div v-if="lateMileStones.length" class="cpm-late-milestone cpm-milestone-data">
        <h2 class="group-title">Late Milestones</h2>

        <div v-for="milestone in lateMileStones" class="cpm-milestone late">
    		<div class="milestone-detail ">
            	<h3 class="milestone-head">
                	{{ milestone.title }} <br>
                    <span class="time-left">
                    	({{ humanDate(milestone) }} late - 
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

    		<div class="cpm-milestone-edit-form" v-if="milestone.edit_mode">
                <new-milestone-form section="milestones" :milestone="milestone"></new-milestone-form>
            </div>

    		<div class="cpm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="cpm-col-6 cpm-milestone-todo cpm-sm-col-12">
                    <h3>Task List</h3>

                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>
               
                
                <div v-if="milestone.discussion_boards.data.length"  class="cpm-col-6 cpm-milestone-discussion cpm-last-col cpm-sm-col-12">
                    <h3>Discussion</h3>

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

	export default {
        components: {
            'new-milestone-form': new_milestone_form,
            'list': list,
            'action': action,
            'discuss': discuss
        },
        computed: {
            lateMileStones () {
                moment.tz.add(PM_Vars.time_zones);
                moment.tz.link(PM_Vars.time_links);

                return this.$store.state.milestones.filter(function(milestone) {
                    
                    if ( milestone.status === 'complete' ) {
                        return false;
                    }

                    var due_date = milestone.achieve_date.date;
                    
                    if ( !due_date ) {
                        return milestone;
                    }

                    due_date = new Date(due_date);
                    due_date = moment(due_date).format('YYYY-MM-DD');

                    if ( ! moment( due_date ).isValid() ) {
                        return false;
                    }

                    var today   = moment.tz( PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' ),
                        due_day = moment.tz( due_date, PM_Vars.wp_time_zone ).format( 'YYYY-MM-DD' );
                    
                    
                    return moment(due_day).isBefore(today) ? milestone : false;
                });
            },
        },

        methods: {
            humanDate (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.create_at.date;
                    due_date = new Date(due_date),
                    due_date = moment(due_date).format();

                return moment(due_date).fromNow(true);
            },
            momentFormat (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.create_at.date;
                    due_date = new Date(due_date),
                    due_date = moment(due_date).format();

                return due_date;
            },
            getDueDate (milestone) {
                var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.create_at.date;
                var due_date = this.dateFormat(due_date);

                return due_date;
            }
        }
	}
</script>

