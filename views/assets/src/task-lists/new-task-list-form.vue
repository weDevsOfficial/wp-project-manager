<template>
	
	<div :class="todolistFormClass(list)+' pm-new-todolist-form'">

	    <form v-on:submit.prevent="newTodoList()" action="" method="post">
	        <div class="item title">
	            <input type="text" required="required" name="tasklist_name" v-model="list.title" :placeholder="text.task_list_name">
	        </div>

	        <div class="item content">
	            <textarea name="tasklist_detail" id="" v-model="list.description" cols="40" rows="2" :placeholder="text.task_list_details"></textarea>
	        </div>

	        <div class="item milestone">
	            <select v-model="milestone_id">
	                <option value="-1">
	                    {{text.milestones_select}}
	                </option>
	                <option v-for="milestone in milestones" :value="milestone.id">
	                    {{ milestone.title }}
	                </option>
	            </select>
	        </div>
	        
	        <div class="item submit">
	            <input v-if="list.edit_mode" type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="text.update_list">
	            <input v-if="!list.edit_mode" type="submit" class="button-primary" :disabled="submit_disabled" name="submit_todo" :value="text.add_list">
	            <a @click.prevent="showHideListForm(false, list)" class="button list-cancel" href="#">{{text.cancel}}</a>
	            <span v-show="show_spinner" class="pm-spinner"></span>
	        </div>
	    </form>
	</div>

</template>

<script>

	var pm_todo_list_mixins = function(mixins, mixin_parent) {
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
	    props: ['list', 'section'],

	    /**
	     * Initial data for this component
	     * 
	     * @return obj
	     */
	    data: function() {
	        return {
	            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
	            show_spinner: false,
	            error: [],
	            success: '',
	            submit_disabled: false,
	            project_id: this.$route.params.project_id,
	            milestone_id: '-1'
	        };
	    },

	    created () {
	    	if ( typeof this.list.milestone !== 'undefined' ) {
	    		this.milestone_id = this.list.milestone.data.id;
	    	}
	    },

	    computed: {
	    
	        /**
	         * Get current project milestones 
	         * 
	         * @return array
	         */
	        milestones: function() {
	            return this.$root.$store.state.milestones;
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
	            return list.ID ? 'pm-todo-form-wrap pm-form pm-slide-'+ list.ID : 'pm-todo-list-form-wrap pm-form pm-slide-list';
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
	            	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists/'+self.list.id;
	            	var data = 'title='+self.list.title+'&description='+self.list.description+'&milestone='+self.milestone_id+'&order'+5;
	            		
	            } else {
	            	var url = self.base_url + '/pm/v2/projects/'+self.project_id+'/task-lists';
	            	var type = 'POST';
	            	var data = {
	            		'title': self.list.title,
	            		'description': self.list.description,
	            		'milestone': self.milestone_id,
	            		'order': 5
	            	};
	            }
	            
	            var request_data = {
	            	url: url,
	            	data: data,
	            	type: type,
	            	success (res) {
						self.milestone_id   = '-1';
						self.show_spinner     = false;
						self.list.title       = '';
						self.list.description = '';

						self.addMetaList(res.data);
	                    // Display a success message, with a title
	                    pm.Toastr.success(res.data.success);
	                    self.submit_disabled = false;

	                    if (is_update) {
	                    	self.showHideListForm(false, self.list);
	                    } else {
	                    	self.showHideListForm(false);
	                    }
							
	                    self.afterNewList(self, res, is_update);

	            	},

	            	error (res) {
	            		
	            		self.show_spinner = false;
	            		self.submit_disabled = false;

	                    // Showing error
	                    res.data.error.map(function(value, index) {
	                        pm.Toastr.error(value);
	                    });
	            	},
	            }

	            self.httpRequest(request_data);
	        },

	        afterNewList (self, res, is_update) {
	        	if (is_update) {
					self.$store.commit('afterUpdateList', res.data);
	        	} else {
	        		self.$store.commit('afterNewList', res.data);
					self.$store.commit('afterNewListupdateListsMeta');
	        	}
	        },

	        singleAfterNewList (self, res, is_update) {
	        	if ( is_update ) {
	        		var condition = 'incomplete_tasks,complete_tasks,comments';
	        		self.getList(self, self.list.id, condition);
	        	}
	        }
	    }
	}
</script>