<template>
	<div id="cpm-task-el" class="cpm-task-container wrap">
		<new-task-list-btn></new-task-list-btn>
		<new-task-list-form :list="{}" :index="0"></new-task-list-form>
		
		<ul class="cpm-todolists">
        
        	<li v-for="list in lists" :key="list.ID"  :class="'cpm-fade-out-'+list.ID">
        	
	            <article class="cpm-todolist">
	                <header class="cpm-list-header">
	                    <h3>
	                    
	                        <router-link :to="{ name: 'single_list', params: { list_id: list.ID }}">{{ list.post_title }}</router-link>
	                        <span :class="privateClass(list)"></span>
	                        <div class="cpm-right" v-if="list.can_del_edit">
	                            <a href="#" @click.prevent="showHideTodoListForm( list, index )" class="" title="Edit this List"><span class="dashicons dashicons-edit"></span></a>
	                            <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.ID )" title="Delete this List" :data-list_id="list.ID" data-confirm="Are you sure to delete this task list?"><span class="dashicons dashicons-trash"></span></a>
	                        </div>
	                    </h3>

	                    <div class="cpm-entry-detail" >
	                        {{ list.post_content }}    
	                    </div>

	                    <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
	                    <div class="cpm-update-todolist-form" v-if="list.edit_mode">
	                        <!-- New Todo list form -->
	                        <!-- <todo-list-form :list="list" :index="index"></todo-list-form> -->
	                    </div>
	                </header>

	                <!-- Todos component -->
	              	<tasks :list="list" :index="index"></tasks>

	                <footer class="cpm-row cpm-list-footer">
	                    <div class="cpm-col-6">
	                        <div v-if="canUserCreateTask"><new-task-button :task="{}" :list="list" :list_index="index"></new-task-button></div>
	                       
	                        <div class="cpm-col-3 cpm-todo-complete">
	                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
	                                <span>{{ list.count_completed_tasks }}</span>  <!-- countCompletedTasks( list.tasks ) -->
	                                Completed
	                            </router-link>
	                        </div>
	                        <div  class="cpm-col-3 cpm-todo-incomplete">
	                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
	                                <span>{{ list.count_incompleted_tasks }}</span> <!-- countIncompletedTasks( list.tasks ) -->
	                                Incomplete
	                            </router-link>
	                        </div>
	                        <div  class="cpm-col-3 cpm-todo-comment">
	                            <router-link :to="{ name: 'list_single', params: { list_id: list.ID }}">
	                                <span>{{ list.comment_count }} Comments</span>
	                            </router-link>
	                        </div>
	                    </div>

	                    <div class="cpm-col-4 cpm-todo-prgress-bar">
	                        <div :style="getProgressStyle( list )" class="bar completed"></div>
	                    </div>
	                    <div class=" cpm-col-1 no-percent">{{ getProgressPercent( list ) }}%</div>
	                    <div class="clearfix"></div>
	                </footer>
	            </article>
        	
        	</li>
    	</ul>
    	<router-view name="lists_single_task"></router-view>
	</div>
</template>

<script>
	import new_task_list_btn from './new-task-list-btn.vue';
	import new_task_list_form from './new-task-list-form.vue';
	import tasks from './tasks.vue';
	
	export default {

		components: {
			'new-task-list-btn': new_task_list_btn,
			'new-task-list-form': new_task_list_form,
			'tasks': tasks
		},

		    // Assign template for this component
	    //template: '#tmpl-cpm-todo-list', 

	    // Include global properties and methods
	   // mixins: [CPM_Task_Mixin],

	    props: ['current_page_number'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            list: {},
	            index: false,
	        }
	    },

	    watch: {
	        current_page_number: function( page_number ) {
	            var per_page = this.$store.state.todo_list_per_page,
	                self     = this;
	            
	            for (var i = 0; i < per_page; i++) {
	                var request_data  = {
	                    per_page: per_page,
	                    current_page: page_number,
	                    project_id: CPM_Vars.project_id,
	                    _wpnonce: CPM_Vars.nonce,
	                };

	                wp.ajax.send('cpm_get_todo_lists', {
	                    data: request_data,
	                    success: function(res) {
	                        self.$store.commit( 'new_todo_list', res );
	                    }
	                });
	            }
	        }
	    },

	    created () {
	    	this.$store.state.is_single_list = false;
	    },

	    computed: {
	        /**
	         * Get lists from vuex store
	         * 
	         * @return array
	         */
	        lists: function () {
	            return this.$store.state.lists;
	        },

	        /**
	         * Get milestones from vuex store
	         * 
	         * @return array
	         */
	        milestones: function() {
	            return this.$store.state.milestones;
	        },

	        /**
	         * Get current project id from vuex store
	         * 
	         * @return int
	         */
	        project_id: function() {
	            return this.$store.state.project_id;
	        },

	        /**
	         * Get initial data from vuex store when this component loaded
	         * 
	         * @return obj
	         */
	        init: function() {
	            return this.$store.state.init;
	        },

	        /**
	         * Get task for single task popup
	         * 
	         * @return object
	         */
	        task: function() {
	            return this.$store.state.task;
	        },

	        total: function() {
	            return Math.ceil( this.$store.state.list_total / this.$store.state.todo_list_per_page );
	        },

	        limit: function() {
	            return this.$store.state.todo_list_per_page;
	        },

	        page_number: function() {
	            return this.$route.params.page_number ? this.$route.params.page_number : 1;
	        }
	    },
	}
</script>




