import Vue from './../../vue/vue';

/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Task = {

    disableLineBreak: function(element) {
        jQuery(element).on( 'keypress', function(e) {
            if ( e.keyCode == 13 && !e.shiftKey ) {
                e.preventDefault();
            }
        });
    }
}

// Register a global custom directive called v-cpm-sortable
Vue.directive('prevent-line-break', {

    inserted: function (element) {
        PM_Task.disableLineBreak(element);
    }
});