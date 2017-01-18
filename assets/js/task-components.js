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
		}
	}
}

// New todo list and update todo list form
Vue.component('todo-list-form', {
    template: '#tmpl-cpm-todo-list-form', 
    props: ['list', 'project_id', 'milestones'],

    mixins: [CPM_Mixin],

    created: function() {
        this.$root.$on( 'cpm_task_hook', this.getTaskHook );
    },

    data: function() {
    	return {
    		submit_btn_text: 'Add New',
    		selected_milestone: '',
            action: 'cpm_add_list',
            tasklist_name: '',
            tasklist_detail: '',
            tasklist_milestone: '',
    	}
    },

    methods: {
        // Get all hook from chiled components
        getTaskHook: function( hook, data, e ) {

            switch( hook ) {
                case 'milestone_dropdown':
                    this.tasklist_milestone = data.milestone_id;
                    break;

                default:
                    break;
            }
        }, 

        hideTodoListForm: function() {
            this.setTaskHook( 'hide_todo_list_form' );
        },

        newTodoList: function() {
            var form_data = {
                action: 'cpm_add_list',
                tasklist_name: this.tasklist_name,
                tasklist_detail: this.tasklist_detail,
                tasklist_milestone: this.tasklist_milestone,
                project_id: this.project_id,
                list_id: typeof this.list == 'undefined' ? false : this.list.ID
            }

            console.log(form_data);
        }
    }
});

// Milestone dropdown
Vue.component('milestone-dropdown', {
    mixins: [CPM_Mixin],
    template: '#tmpl-cpm-milestone-dropdown', 
    props: ['milestones', 'selected_milestone'],

    data: function() {
        return {
            milestone: ''
        }
    },

    created: function() {
        this.milestone = this.selected_milestone;
    },

    watch: {
        milestone: function( new_val ) {
            this.setTaskHook( 'milestone_dropdown', { milestone_id: new_val } );
        }
    }

});

