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

		beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getLists(vm);
                // vm.getRoles(vm);
                // vm.getCategory(vm);
            });
        }, 

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
	    data () {
	        return {
	            list: {},
	            index: false,
	            project_id: this.$route.params.project_id,
	            current_page_number: 1
	        }
	    },

	    watch: {
            '$route' (route) {
                this.current_page_number = route.params.current_page_number;
                this.getProjects(this);
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
	        lists () {
	            return this.$store.state.lists;
	        },

	        /**
	         * Get milestones from vuex store
	         * 
	         * @return array
	         */
	        milestones () {
	            return this.$store.state.milestones;
	        },

	        /**
	         * Get current project id from vuex store
	         * 
	         * @return int
	         */
	        project_id () {
	            return this.$store.state.project_id;
	        },

	        /**
	         * Get initial data from vuex store when this component loaded
	         * 
	         * @return obj
	         */
	        init () {
	            return this.$store.state.init;
	        },

	        /**
	         * Get task for single task popup
	         * 
	         * @return object
	         */
	        task () {
	            return this.$store.state.task;
	        },

	        total () {
	            return Math.ceil( this.$store.state.list_total / this.$store.state.todo_list_per_page );
	        },

	        limit () {
	            return this.$store.state.todo_list_per_page;
	        },

	        page_number () {
	            return this.$route.params.page_number ? this.$route.params.page_number : 1;
	        }
	    },

	    methods: {
	    	getLists () {
	    
	            var request = {
	             	url: this.base_url + '/cpm/v2/projects/'+this.project_id+'/task-lists?per_page=2&page='+ self.current_page_number,
	             	success (res) {
	             		console.log(res);
	             	}
	            };
	            this.httpRequest(request);
	    	}
	    }
	}
</script>




