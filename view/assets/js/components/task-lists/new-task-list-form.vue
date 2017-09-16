<template>
	
	<div :class="todolistFormClass(list)+' cpm-new-todolist-form'">

	    <form v-on:submit.prevent="newTodoList()" action="" method="post">
	        <div class="item title">
	            <input type="text" required="required" name="tasklist_name" v-model="list.title" placeholder="Task list name">
	        </div>

	        <div class="item content">
	            <textarea name="tasklist_detail" id="" v-model="list.description" cols="40" rows="2" placeholder="Task list details"></textarea>
	        </div>

	        <div class="item milestone">
	            <select v-model="list.milestone">
	                <option value="-1">
	                    - Milestone -
	                </option>
	                <option v-for="milestone in milestones" :value="milestone.id">
	                    {{ milestone.title }}
	                </option>
	            </select>
	        </div>
	        
	        <div class="item submit">
	            <span class="cpm-new-list-spinner"></span>
	            <input type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="submit_btn_text">
	            <a @click.prevent="showHideTodoListForm( list, index )" class="button list-cancel" href="#">Cancel</a>
	            <span v-show="show_spinner" class="cpm-spinner"></span>
	        </div>
	    </form>
	</div>

</template>

<script>

	var cpm_todo_list_mixins = function(mixins, mixin_parent) {
	    if (!mixins || !mixins.length) {
	        return [];
	    }
	    if (!mixin_parent) {
	        mixin_parent = window;
	    }
	    return mixins.map(function (mixin) {
	        return mixin_parent[mixin];
	    });
	};

	export default {
	    // Get passing data for this component. Remember only array and objects are 
	    props: ['list', 'index'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            submit_btn_text: 'Submit',
	            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
	            show_spinner: false,
	            error: [],
	            success: '',
	            submit_disabled: false,
	            project_id: this.$route.params.project_id,
	        };
	    },

	    computed: {
	    
	        /**
	         * Get current project milestones 
	         * 
	         * @return array
	         */
	        milestones: function() {
	            return this.$store.state.milestones;
	        },
	    },


	    methods: {

	        /**
	         * Get todo list form class
	         * 
	         * @param  obej list 
	         * 
	         * @return string     
	         */
	        todolistFormClass: function( list ) {
	            return list.ID ? 'cpm-todo-form-wrap cpm-form cpm-slide-'+ list.ID : 'cpm-todo-list-form-wrap cpm-form cpm-slide-list';
	        },

	        /**
	         * Insert and update todo list
	         * 
	         * @return void
	         */
	        newTodoList: function() {

	            // Prevent sending request when multiple click submit button 
	            if ( this.submit_disabled ) {
	                return;
	            }

	            // Make disable submit button
	            this.submit_disabled = true;

	            var self      = this,
	                is_update = typeof this.list.id == 'undefined' ? false : true;
	               
	            this.show_spinner = true;

	            if ( is_update ) {
	            	var type = 'PUT';
	            	var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/task-lists/'+self.list.id;
	            	var data = 'title='+self.list.title+'&description='+self.list.description+'&milestone='+self.list.milestone+'&order'+5;
	            		
	            } else {
	            	var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/task-lists';
	            	var type = 'POST';
	            	var data = {
	            		'title': self.list.title,
	            		'description': self.list.description,
	            		'milestone': self.list.milestone,
	            		'order': 5
	            	};
	            }
	            console.log(url, data, type);
	            var request_data = {
	            	url: url,
	            	data: data,
	            	type: type,
	            	success (res) {
						self.list.milestone   = '-1';
						self.show_spinner     = false;
						self.list.title       = '';
						self.list.description = '';

	                    if ( is_update ) {
	                        var list = res.data;
	                    } else {
	                        var list = res.data;
	                    }

	                    // Display a success message, with a title
	                    toastr.success(res.data.success);

	                    // Hide the todo list update form
	                    self.showHideTodoListForm( self.list, self.index );

            			// named route
						self.$router.push({ 
							name: 'task_lists', 
							params: { 
								project_id: self.project_id 
							}
						});

						self.submit_disabled = false;

	                    //self.refreshTodoListPage();
	            	},

	            	error (res) {
	            		
	            		self.show_spinner = false;
	            		self.submit_disabled = false;

	                    // Showing error
	                    res.data.error.map(function(value, index) {
	                        toastr.error(value);
	                    });
	            	},
	            }

	            self.httpRequest(request_data);
	        },
	    }
	}
</script>