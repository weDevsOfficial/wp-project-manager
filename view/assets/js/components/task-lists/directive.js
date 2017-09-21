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

    sortable: function () {
        var $ = jQuery;

        $('.cpm-todos').sortable({
            cancel: '.nonsortable,form',
            update: function(event, ui) {
                var newOrder = {},
                    oldOrder = [];

                // finding new order sequence and old orders
                $(this).find('li.cpm-todo').each( function(e) {
                    newOrder[$(this).attr('data-id')] = $(this).index() + 1;
                    oldOrder.push(parseInt($(this).attr('data-order')));
                });

                // setting new order
                for(var prop in newOrder) {
                    if(!newOrder.hasOwnProperty(prop)) continue;

                    newOrder[prop] = oldOrder[newOrder] ? oldOrder[newOrder] : newOrder[prop];
                }

                // prepare data for server
                var data = {
                    action: 'cpm_update_task_order',
                    orders: newOrder,
                    _wpnonce: CPM_Vars.nonce
                };

                // send data to the server
                $.post( CPM_Vars.ajaxurl, data, function( response ) {
                    if (response.success) {
                    }
                } );
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
    inserted: function () {
        CPM_Task.sortable();
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
