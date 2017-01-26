;(function($) {

    'use strict';

    var CPM_Task = {
        init: function() {
            this.datepicker();
        },

        datepicker: function() {
            $( '.cpm-date-field').datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                yearRange: '-50:+5',
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker', date: dateText } );
                }
            });

            $( ".cpm-date-picker-from" ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-picker-to" ).datepicker( "option", "minDate", selectedDate );
                },
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker_from', date: dateText } );
                }
            });

            $( ".cpm-date-picker-to" ).datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-picker-from" ).datepicker( "option", "maxDate", selectedDate );
                },
                onSelect: function(dateText) {
                    CPM_Task_Vue.$emit( 'cpm_date_picker', { field: 'datepicker_to', date: dateText } );
                }
            });
        }
    }

    // Register a global custom directive called v-cpm-datepicker
    Vue.directive('cpm-datepicker', {
        inserted: function (el) {
            CPM_Task.datepicker( el );
        }
    });

    // Task root object 
    var CPM_Task_Vue = new Vue({
        el: '#cpm-task-el',
        
        store: Task_Store,

        mixins: [CPM_Mixin],

        data: {
            text: {
                new_todo: CPM_Vars.message.new_todo
            },
            list: {},
            index: false,
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

            hasTodoLists: function() {
                return this.$store.state.lists.length;
            }

        },

        // Initial doing 
        created: function() {
            this.getInitialData( this.$store.state.project_id );
        },

        methods: {

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
                    } 
                    
                });
            },
        }
    });

})(jQuery);