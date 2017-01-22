// Global object for all components and root
var CPM_Mixin = {
	data: function() {
		return {
            mixin_milestones: []
        }
	}, 	

	methods: {
        //Set all hook for root object
        setTaskHook: function(id, data, event) {
            event = ( typeof event == 'undefined' ) ? false : event;
            data  = ( typeof data == 'undefined' ) ? false : data;
            
            this.$root.$emit( 'cpm_task_hook', id, data, event );
        },
        
        // Get all milestone
		getMilestone: function( project_id ) {
			var self = this,
                data = {
                    project_id: project_id,
                    action: 'cpm_get_milestones',
                    _wpnonce: CPM_Vars.nonce
                }

	        jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
	            if ( res.success ) {
	                self.mixin_milestones = res.data.milestones;
	            } 
	        });
		},
	}
}

// New todo list and update todo list form
Vue.component('todo-list-form', {
    template: '#tmpl-cpm-todo-list-form', 
    props: ['list', 'project_id', 'milestones', 'init'],

    mixins: [CPM_Mixin],

    created: function() {
        this.$root.$on( 'cpm_task_hook', this.getTaskHook );
    },

    data: function() {
    	return {
            privacy: this.list.private,
            submit_btn_text: this.list.ID ? CPM_Vars.message.update_todo : CPM_Vars.message.new_todo,
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            tasklist_name: this.list.post_title,
            tasklist_detail: this.list.post_content,
            show_spinner: false,
            error: [],
            success: ''
    	}
    },

    computed: {
        tdolist_view_private: function() {

            if ( ! this.init.hasOwnProperty('premissions')) {
                return true;
            }

            if ( this.init.premissions.hasOwnProperty('tdolist_view_private')) {
                return this.init.premissions.tdolist_view_private
            }

            return true;
        },
    },

    watch: {
        privacy: function( new_val ) {
            this.privacy = new_val;
        },

        list: {
            handler: function( new_val, old_val ) {

                this.tasklist_name   = new_val.post_title;
                this.tasklist_detail = new_val.post_content;
                this.tasklist_milestone  = new_val.milestone ? new_val.milestone : '-1';
                this.privacy         = new_val.private;
            },

            deep: true
        }
    },

    methods: {
        // Get all hook from chiled components
        getTaskHook: function( hook, data, e ) {
            switch( hook ) {
        
            }
        }, 

        taskFormClass: function( list ) {
            return list.ID ? 'cpm-todo-form-wrap cpm-form' : 'cpm-todo-list-form-wrap cpm-form';
        },

        hideTodoListForm: function() {
            this.setTaskHook( 'hide_todo_list_form' );
            this.show_spinner = false;
        },

        newTodoList: function() {
    
            var self = this,
                form_data = {
                    action: 'cpm_add_list',
                    tasklist_name: this.tasklist_name,
                    tasklist_detail: this.tasklist_detail,
                    tasklist_privacy: this.privacy,
                    project_id: this.project_id,
                    tasklist_milestone: this.tasklist_milestone,
                    list_id: typeof this.list == 'undefined' ? false : this.list.ID,
                    _wpnonce: CPM_Vars.nonce,
                }
            
            this.show_spinner = true;
            
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    self.privacy      = false;
                    self.tasklist_milestone    = '-1';
                    self.show_spinner = false;

                    // Display a success toast, with a title
                    toastr.success(res.data.success);
                    self.setTaskHook( 'update_todo_list',  res );


                } else {
                    self.show_spinner = false;
                    res.data.error.map(function(value, index) {
                        toastr.error(value);
                    });
                }
            });
        },
    }
});

// Milestone dropdown
// Vue.component('milestone-dropdown', {
//     mixins: [CPM_Mixin],
//     template: '#tmpl-cpm-milestone-dropdown', 
//     props: ['milestones', 'milestone'],

//     data: function() {
//         return {
//             // Default (when component loaded) set selected milestone from props
//             selected_milestone: this.milestone
//         }
//     },  

//     watch: {
//         // onChange milestone from dropdown and send it to others component by 'watch_milestone' hook
//         selected_milestone: function(new_val) {
//             this.setTaskHook( 'watch_milestone', { milestone_id: new_val });
//         },

//         // onchange props['milestone'] and set it to selected_milestone.  (when its change from others component) 
//         milestone: function( new_val ) {
//             this.selected_milestone = new_val;
//         }
//     }
// });

// Show todo lists
Vue.component('todo-list', {
    mixins: [CPM_Mixin],
    template: '#tmpl-cpm-todo-list', 
    props: ['lists', 'project_id', 'milestones', 'init'],

    data: function() {
        return {
            show_list_form: true
        }
    },

    methods: {
        updateTaskList: function( list, index ) {
            this.setTaskHook( 'update_todo_list_btn', { list: list, index: index });
        }
    }

});

