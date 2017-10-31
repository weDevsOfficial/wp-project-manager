<template>
	<div v-if="upComingMileStones.length" class="pm-upcomming-milestone pm-milestone-data">
        <h2 class="group-title">{{text.upcoming_milestones}}</h2>

        <div v-for="milestone in upComingMileStones" class="pm-milestone late">
    		<div class="milestone-detail ">
            	<h3 class="milestone-head">
                	{{ milestone.title }} <br>
                    <span class="time-left">
                    	({{ humanDate(milestone) }} {{text.moment_left}} 
                    	<time :datetime="momentFormat(milestone)" :title="momentFormat(milestone)">
                    		{{ getDueDate(milestone) }}
                    	</time>
                    	)
                    </span>
                    
                    <action :milestone="milestone"></action>
                </h3>

	            <div class="detail">
	                <div v-html="milestone.content"></div>
	            </div>
    		</div>

            <transition name="slide">
        		<div class="pm-milestone-edit-form pm-col-6 pm-sm-col-12" style="float:none;margin-left:20px;" v-if="milestone.edit_mode">
                    <new-milestone-form section="milestones" :milestone="milestone"></new-milestone-form>
                </div>
            </transition>
    		<div class="pm-milestone-items-details">
                <div v-if="milestone.task_lists.data.length"  class="pm-col-6 pm-milestone-todo pm-sm-col-12">
                    <h3>{{text.task_lists}}</h3>

                    <ul>
                        <li v-for="list in milestone.task_lists.data">
                            <list :list="list"></list>
                        </li>
                    </ul>
                </div>
               
                <div v-if="milestone.discussion_boards.data.length"  class="pm-col-6 pm-milestone-discussion pm-last-col pm-sm-col-12">
                    <h3>{{text.discussions}}</h3>
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
            upComingMileStones () {
                
                

                return this.$store.state.milestones.filter(function(milestone) {

                    if ( milestone.status === 'complete' ) {
                        return false;
                    }
                    var due_date = milestone.achieve_date.date;

                    if ( !due_date ) {
                        return false;
                    }

                    due_date = new Date(due_date);
                    due_date = pm.Moment(due_date).format('YYYY-MM-DD');

                    if ( ! pm.Moment( due_date ).isValid() ) {
                        return false;
                    }

                    var today   = pm.Moment().format( 'YYYY-MM-DD' ),
                        due_day = pm.Moment( due_date ).format( 'YYYY-MM-DD' );

                    return pm.Moment(due_day).isAfter(today) ? milestone : false;
                });


            },
        }
	}
</script>

