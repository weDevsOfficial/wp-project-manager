// Global object for all components and root
var CPM_Mixin = {
	data: function() {
		return {
            mixin_milestones: []
        }
	}, 	

	methods: {

        // Handel new todo list form show and hide
        showHideTodoListForm: function( list, list_index ) {

            if ( list.ID ) {
                this.$store.commit( 'showHideUpdatelistForm', { list: list, list_index: list_index } );
            } else {
                this.$store.commit( 'newTodoListForm' );
            }
            
        }
	}
}

// New todo list and update todo list form
Vue.component('todo-list-form', {
    template: '#tmpl-cpm-todo-list-form', 
    props: [ 'list', 'index' ],
    mixins: [CPM_Mixin],

    data: function() {
    	return {
            privacy: this.list.private == 'on' ? true : false,
            submit_btn_text: this.list.ID ? CPM_Vars.message.update_todo : CPM_Vars.message.new_todo,
            tasklist_milestone: this.list.milestone ? this.list.milestone : '-1',
            tasklist_name: this.list.post_title,
            tasklist_detail: this.list.post_content,
            show_spinner: false,
            error: [],
            success: '',
            submit_disabled: false
    	}
    },

    computed: {
        tdolist_view_private: function() {

            if ( ! this.$store.state.init.hasOwnProperty('premissions')) {
                return true;
            }

            if ( this.$store.state.init.premissions.hasOwnProperty('tdolist_view_private')) {
                return this.$store.state.init.premissions.tdolist_view_private
            }

            return true;
        },

        milestones: function() {
            return this.$store.state.milestones;
        },
    },

    watch: {
        privacy: function( new_val ) {
            this.privacy = new_val;
        },

        list: {
            handler: function( new_val, old_val ) {

                this.tasklist_name      = new_val.post_title;
                this.tasklist_detail    = new_val.post_content;
                this.tasklist_milestone = new_val.milestone ? new_val.milestone : '-1';
                this.privacy            = new_val.private;
            },

            deep: true
        }
    },

    methods: {

        taskFormClass: function( list ) {
            return list.ID ? 'cpm-todo-form-wrap cpm-form' : 'cpm-todo-list-form-wrap cpm-form';
        },

        newTodoList: function() {
            
            if ( this.submit_disabled ) {
                return;
            }

            this.submit_disabled = true;

            var self      = this,
                is_update = typeof this.list.ID == 'undefined' ? false : true,
                
                form_data = {
                    action: typeof this.list.ID == 'undefined' ? 'cpm_add_list' : 'cpm_update_list',
                    tasklist_name: this.tasklist_name,
                    tasklist_detail: this.tasklist_detail,
                    tasklist_privacy: this.privacy ? 'on' : 'no',
                    project_id: this.$store.state.project_id,
                    tasklist_milestone: this.tasklist_milestone,
                    list_id: typeof this.list.ID == 'undefined' ? false : this.list.ID,
                    _wpnonce: CPM_Vars.nonce,
                };
            
            this.show_spinner = true;
            
            jQuery.post( CPM_Vars.ajaxurl, form_data, function( res ) {

                if ( res.success ) {
                    self.privacy            = false;
                    self.tasklist_milestone = '-1';
                    self.show_spinner       = false;

                    if ( is_update ) {
                        var list = res.data.list;
                    } else {
                        var list = res.data.list.list;
                    }

                    // Display a success toast, with a title
                    toastr.success(res.data.success);

                    // Hide the todo list update form
                    self.showHideTodoListForm( self.list, self.index );
                    
                    // Update store lists array 
                    self.$store.commit( 'update_todo_list', { res_list: list, list: self.list, index: self.index, is_update: is_update } );
                
                } else {
                    self.show_spinner = false;

                    // Showing error
                    res.data.error.map(function(value, index) {
                        toastr.error(value);
                    });
                }

                this.submit_disabled = false;
            });
        },
    }
});

// Show todo lists
Vue.component('todo-list', {
    mixins: [CPM_Mixin],
    template: '#tmpl-cpm-todo-list', 

    data: function() {
        return {
            list: {},
            index: false
        }
    },

    computed: {
        lists: function () {
            return this.$store.state.lists;
        },

        milestones: function() {
            return this.$store.state.milestones;
        },

        project_id: function() {
            return this.$store.state.project_id;
        },

        init: function() {
            return this.$store.state.init;
        },
    }

});

// Default template for todo lists
Vue.component('todo-list-default-tmpl', {
    template: '#tmpl-todo-list-default',

    data: function() {
        return {
            list: {},
            index: false
        }
    },

    computed: {
        lists: function() {
            return this.$store.state.lists;
        },

        create_todolist: function() {
            if ( ! this.$store.state.init.hasOwnProperty( 'premissions' ) ) {
                return true;
            }

            return this.$store.state.init.premissions.create_todolist;
        },

        show_list_form: function() {
            return this.$store.state.show_list_form;
        }
    }
});

// Todo list btn 
Vue.component('todo-list-button', {
    template: '#tmpl-todo-list-button',

    mixins: [CPM_Mixin],

    data: function() {
        return {
            list: {},
            index: false,
            text: {
                new_todo: CPM_Vars.message.new_todo
            },
        }
    },

    computed: {
        show_list_form: function() {
            return this.$store.state.show_list_form;
        }
    }
});

