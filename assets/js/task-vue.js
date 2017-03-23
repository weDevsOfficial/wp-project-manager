;(function($) {

    'use strict';

    /**
     * Required jQuery methods 
     * 
     * @type Object
     */
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

            $( ".cpm-date-time-picker-from" ).datetimepicker({
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-time-picker-to" ).datetimepicker( "option", "minDate", selectedDate );
                },
                onSelect: function(dateText) {
                    
                }
            });

            $( ".cpm-date-time-picker-to" ).datetimepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".cpm-date-time-picker-from" ).datetimepicker( "option", "maxDate", selectedDate );
                },
                onSelect: function(dateText) {
                   
                }
            });
        }
    }

    /**
     * Handeling global property only for todo list page
     */
    var Task_Store = new Vuex.Store(cpm_task_store);


    /**
     * Todo list router
     */
    var CPM_Task_Router = new VueRouter({

        routes: [
            // Default template. showing todolist and task
            { path: '/', component: CPM_Router_Init },

            // Todo list singe page
            { path: '/list/:list_id', component: CPM_List_Single, name: 'list_single' },

            // Todo list singe page
            { path: '/list/:list_id/task/:task_id', component: CPM_Task_Single, name: 'task_single' },

            // Pagination
            { path: '/page/:page_number', component: CPM_Router_Init, name: 'pagination' },
        ], 
    });



    // Register a global custom directive called v-cpm-datepicker
    Vue.directive('cpm-datepicker', {
        inserted: function (el) {
            CPM_Task.datepicker( el );
        }
    });

    /**
     * Todo list root or main instance
     * 
     * @type Vue
     */
    var CPM_Task_Vue = new Vue({
        
        store: Task_Store,

        router: CPM_Task_Router,

        mixins: [CPM_Task_Mixin],

    }).$mount('#cpm-task-el');



})(jQuery);
