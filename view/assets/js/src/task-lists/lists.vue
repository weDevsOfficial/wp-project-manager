<template>
	<div>
		<pm-header></pm-header>
		<div id="cpm-task-el" class="cpm-task-container wrap">
			
			<new-task-list-btn></new-task-list-btn>
			<new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
			
			<ul class="cpm-todolists">
	        
	        	<li v-for="(list, index) in lists" :key="list.id"  :class="'cpm-fade-out-'+list.id">

		            <article class="cpm-todolist">
		                <header class="cpm-list-header">
		                    <h3>
		                    
		                        <router-link :to="{ 
		                        	name: 'single_list', 
		                        	params: { 
		                        		list_id: list.id 
		                        	}}">
		                    	{{ list.title }}
		                    	
		                    	</router-link>
		                        <span :class="privateClass(list)"></span>
		                        <!-- v-if="list.can_del_edit" -->
		                        <div class="cpm-right">
		                            <a href="#" @click.prevent="showEditForm(list)" class="" title="Edit this List"><span class="dashicons dashicons-edit"></span></a>
		                            <a href="#" class="cpm-btn cpm-btn-xs" @click.prevent="deleteList( list.id )" title="Delete this List" :data-list_id="list.ID" data-confirm="Are you sure to delete this task list?"><span class="dashicons dashicons-trash"></span></a>
		                        </div>
		                    </h3>

		                    <div class="cpm-entry-detail" >
		                        {{ list.description }}    
		                    </div>
		                    
		                    <!-- <div class="cpm-entry-detail">{{list.post_content}}</div> -->
		                    <div class="cpm-update-todolist-form" v-if="list.edit_mode">
		                        <!-- New Todo list form -->
		                        <new-task-list-form section="lists" :list="list"></new-task-list-form>
		                    </div>
		                </header>

		                <!-- Todos component -->
		              	<list-tasks :list="list"></list-tasks>

		                <footer class="cpm-row cpm-list-footer">
		                    <div class="cpm-col-6">
		                        <div>
		                        	<new-task-button :task="{}" :list="list"></new-task-button>
		                        </div>
		                       
		                        <div class="cpm-col-3 cpm-todo-complete">
		                            <router-link :to="{ 
			                        	name: 'single_list', 
			                        	params: { 
			                        		list_id: list.id 
			                        	}}">
		                                <span>{{ list.meta.total_complete_tasks }}</span>  <!-- countCompletedTasks( list.tasks ) -->
		                                Completed
		                            </router-link>
		                        </div>
		                        <div  class="cpm-col-3 cpm-todo-incomplete">
		                            <router-link :to="{ 
			                        	name: 'single_list', 
			                        	params: { 
			                        		list_id: list.id 
			                        	}}">
		                                <span>{{ list.meta.total_incomplete_tasks }}</span> <!-- countIncompletedTasks( list.tasks ) -->
		                                Incomplete
		                            </router-link>
		                        </div>
		                        <div  class="cpm-col-3 cpm-todo-comment">
		                            <router-link :to="{ 
			                        	name: 'single_list', 
			                        	params: { 
			                        		list_id: list.id 
			                        	}}">
		                                <span>{{ list.meta.total_comments }} Comments</span>
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
	    	<pm-pagination 
	            :total_pages="total_list_page" 
	            :current_page_number="current_page_number" 
	            component_name='list_pagination'>
	            
	        </pm-pagination> 
		</div>
		<router-view name="single-task"></router-view>
	</div>
</template>

<script>
	import new_task_list_btn from './new-task-list-btn.vue';
	import new_task_list_form from './new-task-list-form.vue';
	import new_task_button from './new-task-btn.vue';
	import pagination from './../pagination.vue';
	import header from './../header.vue';
	import tasks from './list-tasks.vue';
	
	export default {

		beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getLists(vm);
                vm.getMilestones(vm);
            });
        }, 
    	components: {
			'new-task-list-btn': new_task_list_btn,
			'new-task-list-form': new_task_list_form,
			'new-task-button': new_task_button,
			'pm-pagination': pagination,
			'pm-header': header,
			'list-tasks': tasks
		},

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
	            current_page_number: 1,
	        }
	    },

	    watch: {
            '$route' (route) {
                this.getLists(this);
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
	         * Get initial data from vuex store when this component loaded
	         * 
	         * @return obj
	         */
	        // init () {
	        //     return this.$store.state.init;
	        // },

	        /**
	         * Get task for single task popup
	         * 
	         * @return object
	         */
	        // task () {
	        //     return this.$store.state.task;
	        // },

	        // total () {
	        //     return Math.ceil( this.$store.state.list_total / this.$store.state.todo_list_per_page );
	        // },

	        // limit () {
	        //     return this.$store.state.todo_list_per_page;
	        // },

	        is_active_list_form () {
	        	return this.$store.state.is_active_list_form;
	        },

	        total_list_page () {
	        	return this.$store.state.lists_meta.total_pages;
	        }
	    },

	    methods: {

	    	showEditForm (list, index) {
	    		list.edit_mode = list.edit_mode ? false : true;
	    	}
	    }
	}
</script>