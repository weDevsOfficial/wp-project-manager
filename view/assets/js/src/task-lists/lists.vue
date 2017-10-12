<template>
	<div>
		<pm-header></pm-header>
		
		<div v-if="lists.length" id="cpm-task-el" class="cpm-task-container wrap">
			
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
		                    <div class="cpm-footer-left">
		                    	<ul class="cpm-footer-left-ul">
			                    	<li v-if="isIncompleteLoadMoreActive(list)" class="cpm-todo-refresh">
			                            <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">More Tasks</a>
			                        </li>
			                        
			                        <li class="cpm-new-task-btn-li"><new-task-button :task="{}" :list="list"></new-task-button></li>
			                       
			                       
			                        <li class="cpm-todo-complete">
			                            <router-link :to="{ 
				                        	name: 'single_list', 
				                        	params: { 
				                        		list_id: list.id 
				                        	}}">
			                                <span>{{ list.meta.total_complete_tasks }}</span>  <!-- countCompletedTasks( list.tasks ) -->
			                                Completed
			                            </router-link>
			                        </li>
			                        <li  class="cpm-todo-incomplete">
			                            <router-link :to="{ 
				                        	name: 'single_list', 
				                        	params: { 
				                        		list_id: list.id 
				                        	}}">
			                                <span>{{ list.meta.total_incomplete_tasks }}</span> <!-- countIncompletedTasks( list.tasks ) -->
			                                Incomplete
			                            </router-link>
			                        </li>
			                        <li  class="cpm-todo-comment">
			                            <router-link :to="{ 
				                        	name: 'single_list', 
				                        	params: { 
				                        		list_id: list.id 
				                        	}}">
			                                <span>{{ list.meta.total_comments }} Comments</span>
			                            </router-link>
			                        </li>
		                    	</ul>
		                    </div>

		                    <div class="cpm-footer-right">
		                        <div class="cpm-todo-progress-bar">
		                        	<div :style="getProgressStyle( list )" class="bar completed"></div>
		                        </div>
		                        <div class="cpm-progress-percent">{{ getProgressPercent( list ) }}%</div>
		                    </div>
		                    
		                    <div class="cpm-clearfix"></div>
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
		<router-view v-if="lists.length" name="single-task"></router-view>

		<default-list-page v-if="!lists.length"></default-list-page>
	</div>
</template>
    
<style>
	.cpm-list-footer .cpm-new-task-btn-li {
		padding-left: 0 !important;
	}
	.cpm-list-footer .cpm-footer-left-ul li {
		display: inline-block;
		padding-left: 28px;
	    background-size: 20px;
	    background-repeat: no-repeat;
	    margin: 5px 0;
	    padding-bottom: 5px;
	    margin-right: 2%;
	}
	.cpm-list-footer .cpm-footer-left-ul li a {
		line-height: 150%;
    	font-size: 12px;
	}
	.cpm-list-footer .cpm-footer-left {
		width: 66%;
	}
	.cpm-list-footer .cpm-footer-right {
		width: 30%;
	}
	.cpm-list-footer .cpm-footer-left, .cpm-list-footer .cpm-footer-right {
		float: left;
	}
	.cpm-list-footer .cpm-todo-progress-bar, .cpm-list-footer .cpm-progress-percent {
		display: inline-block;
	}
	.cpm-list-footer .cpm-todo-progress-bar {
		width: 70%;
	}
	.cpm-list-footer .cpm-progress-percent {
		margin-left: 6px;
	}

</style>

<script>
	import new_task_list_btn from './new-task-list-btn.vue';
	import new_task_list_form from './new-task-list-form.vue';
	import new_task_button from './new-task-btn.vue';
	import pagination from './../pagination.vue';
	import header from './../header.vue';
	import tasks from './list-tasks.vue';
	import default_page from './default-list-page.vue';
	
	export default {

		beforeRouteEnter (to, from, next) {
            next(vm => {
            	vm.getSelfLists();
                vm.getMilestones();
            });
        }, 
    	components: {
			'new-task-list-btn': new_task_list_btn,
			'new-task-list-form': new_task_list_form,
			'new-task-button': new_task_button,
			'pm-pagination': pagination,
			'pm-header': header,
			'list-tasks': tasks,
			'default-list-page': default_page
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
                this.getSelfLists();
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
	    	},

	    	getSelfLists () {
	    		var condition = {
		    			with: 'incomplete_tasks',
		    			per_page: this.getSettings('list_per_page', 10),
		    			page: this.setCurrentPageNumber()
		    		},
		    		self = this;

	    		this.getLists(condition, function(res) {
	    			NProgress.done();
	    		});
	    	},
	    }
	}
</script>