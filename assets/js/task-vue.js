;(function($) {

    'use strict';

    // Task root object 
    var CPM_Task = new Vue({
        el: '#cpm-task-el',
        
        store: Task_Store,

        mixins: [CPM_Mixin],

        data: {
            text: {
                new_todo: CPM_Vars.message.new_todo
            },
            list: {},
            index: false
        },

        computed: {
            lists: function () {
                return this.$store.state.lists;
            },

            loading: function() {
                return this.$store.state.loading;
            },

            show_list_form: function() {
                return this.$store.state.show_list_form;
            },

        },

        // Initial doing 
        created: function() {
            //this.$on( 'cpm_task_hook', this.getTaskHook );
            this.getInitialData( this.$store.state.project_id );
        },

        methods: {

            // Get all hook from chiled components
            getTaskHook: function( hook, data, e ) {

                switch( hook ) {
                    case 'hide_todo_list_form':
                        this.show_list_form = false;
                        break; 

                    case 'update_todo_list':
                        this.lists.splice( 0, 0, data.data.list.list );
                        this.show_list_form = false;
                        this.list = {};
                        break;

                    case 'update_todo_list_btn':
                        this.lists[data.index].edit_mode = this.lists[data.index].edit_mode ? false : true; 
                        break;

                    default:
                        break;
                }
            },

            // Get initial data for todo list page 
            getInitialData: function( project_id ) {
                var self = this,
                    data = {
                        project_id: project_id,
                        _wpnonce: CPM_Vars.nonce,
                        action: 'cpm_initial_todo_list'
                    }

                jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
                    if ( res.success ) {
                        self.$store.commit( 'setTaskInitData', res );
                        
                        //for (var key in res.data ) {
                        //  if ( res.data.hasOwnProperty( key ) ) {
                        //      self.$data[key] = res.data[key];
                        //  }
                        // }
                    } 
                    
                });
            },
        }
    });

})(jQuery);