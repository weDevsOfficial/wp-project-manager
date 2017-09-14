<template>
	
	<div :class="todolistFormClass(list)+' cpm-new-todolist-form'" style="display: none;">

	    <form v-on:submit.prevent="newTodoList()" action="" method="post">
	        <div class="item title">
	            <input type="text" required="required" name="tasklist_name" v-model="list.post_title" placeholder="Task list name">
	        </div>

	        <div class="item content">
	            <textarea name="tasklist_detail" id="" v-model="list.post_content" cols="40" rows="2" placeholder="Task list details"></textarea>
	        </div>

	        <div class="item milestone">
	            <select v-model="tasklist_milestone">
	                <option value="-1">
	                    - Milestone -
	                </option>
	                <option v-for="milestone in milestones" :value="milestone.ID">
	                    {{ milestone.post_title }}
	                </option>
	            </select>
	        </div>

	        <?php do_action( 'cpm_tasklist_form' ); ?>
	        
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

	    // created () {
	    // 	console.log('adlskjasdlfkj');
	    // },
	    
	    // Include global properties and methods
	    //mixins: cpm_todo_list_mixins( PM_Vars.todo_list_form ),

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
	                is_update = typeof this.list.ID == 'undefined' ? false : true;
	               
	            this.list_form_data.action = typeof this.list.ID == 'undefined' ? 'cpm_add_list' : 'cpm_update_list';
	            this.list_form_data.tasklist_name = this.list.post_title;
	            this.list_form_data.tasklist_detail = this.list.post_content;
	            this.list_form_data.project_id = this.$store.state.project_id;
	            this.list_form_data.tasklist_milestone = this.tasklist_milestone;
	            this.list_form_data.list_id = typeof this.list.ID == 'undefined' ? false : this.list.ID;
	            this.list_form_data._wpnonce = PM_Vars.nonce;
	                
	            
	            this.show_spinner = true;

	            // Seding request for insert or update todo list
	            jQuery.post( PM_Vars.ajaxurl, this.list_form_data, function( res ) {

	                if ( res.success ) {
	                    self.tasklist_milestone = '-1';
	                    self.show_spinner       = false;
	                    self.list.post_title    = '';
	                    self.list.post_content = '';

	                    if ( is_update ) {
	                        var list = res.data.list;
	                    } else {
	                        var list = res.data.list.list;
	                    }

	                    // Display a success message, with a title
	                    toastr.success(res.data.success);

	                    // Hide the todo list update form
	                    self.showHideTodoListForm( self.list, self.index );

	                    self.refreshTodoListPage();
	                    
	                } else {
	                    self.show_spinner = false;

	                    // Showing error
	                    res.data.error.map(function(value, index) {
	                        toastr.error(value);
	                    });
	                }

	                // Make enable submit button
	                self.submit_disabled = false;
	            });
	        },
	    }
	}
</script>