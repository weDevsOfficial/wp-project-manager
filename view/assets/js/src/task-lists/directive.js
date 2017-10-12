import Vue from './../../vue/vue';

/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var CPM_Task = {
    init: function() {
        this.datepicker();
        this.sortable();
    },

    sortable: function (el, binding, vnode) {
        var $ = jQuery;
        var component = vnode.context;
        

        $(el).sortable({
            cancel: '.nonsortable,form',
            placeholder: "ui-state-highlight",
            update: function(event, ui) {
                var newOrder = {},
                    orders = [],
                    ids = [],
                    send_data = [];
                    
                // finding new order sequence and old orders
                $(this).find('li.cpm-todo').each( function(e) {
                    var order = $(this).data('order'),
                        task_id = $(this).data('id');
                    
                    orders.push(order);
                    ids.push(task_id);
                   

                    var task_index = component.getIndex(component.list.incomplete_tasks.data, task_id,'id');
                    if (task_index === false) {
                        var task_index = component.getIndex(component.list.complete_tasks.data, task_id,'id');

                    }
                    
                    if (typeof component.list.incomplete_tasks !== 'undefined') {
                        component.list.incomplete_tasks.data[task_index].order = order;
                    }

                    if (typeof component.list.complete_tasks !== 'undefined') {
                        component.list.complete_tasks.data[task_index].order = order;
                    }

                }); 
              
                var after_revers_order = orders.sort(),
                    after_revers_order = after_revers_order.reverse();

                after_revers_order.forEach(function(order, key) {
                    send_data.push({
                        id: ids[key],
                        order: order
                    });
                });

                console.log(send_data, after_revers_order);

                var data = {
                    task_orders: send_data,
                    board_id: component.list.id,
                    board_type: 'task-list'
                }
                
                component.taskOrder(data);
            }
        });
    },

    datepicker: function(el, binding, vnode) {
        var $ = jQuery;
        $( '.cpm-date-field').datepicker({
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            yearRange: '-50:+5',
            onSelect: function(dateText) {
                vnode.context.$root.$emit( 'cpm_date_picker', { field: 'datepicker', date: dateText } );
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
                vnode.context.$root.$emit( 'cpm_date_picker', { field: 'datepicker_from', date: dateText, self: this } );
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
                vnode.context.$root.$emit( 'cpm_date_picker', { field: 'datepicker_to', date: dateText } );
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
    },

    disableLineBreak: function(element) {
        jQuery(element).on( 'keypress', function(e) {
            if ( e.keyCode == 13 && !e.shiftKey ) {
                e.preventDefault();
            }
        });
    }
}

//Register a global custom directive called v-cpm-datepicker
Vue.directive('cpm-datepicker', {
    inserted: function (el, binding, vnode) {
        CPM_Task.datepicker( el, binding, vnode );
    },
});

// Register a global custom directive called v-cpm-sortable
Vue.directive('cpm-sortable', {
    inserted: function (el, binding, vnode) {
        CPM_Task.sortable(el, binding, vnode);
    }
});

// Register a global custom directive called v-cpm-sortable
Vue.directive('cpm-tiptip', {

    update: function () {
        jQuery('.cpm-tiptip').tipTip();
    }
});

// Register a global custom directive called v-cpm-sortable
Vue.directive('prevent-line-break', {

    inserted: function (element) {
        CPM_Task.disableLineBreak(element);
    }
});
