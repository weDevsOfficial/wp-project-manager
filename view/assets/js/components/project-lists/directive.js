import Vue from './../../vue/vue';

var Project = {
    coWorkerSearch: function() {
        var $ = jQuery;
        var cpm_abort;

        $( ".cpm-project-coworker" ).autocomplete( {
            minLength: 3,
            source: function( request, response ) {
                var data = {
                    action: 'cpm_user_autocomplete',
                    term: request.term
                };
                if ( cpm_abort ) {
                    cpm_abort.abort();
                }

                cpm_abort = $.post( PM_Vars.ajaxurl, data, function( resp ) {

                    if ( resp.success ) {
                        var nme = eval( resp.data );
                        response( eval( resp.data ) );
                    } else {
                        response( '' );
                    }

                } );
            },
            search: function() {
                $( this ).addClass( 'cpm-spinner' );
            },
            open: function() {
                var self = $( this );
                self.autocomplete( 'widget' ).css( 'z-index', 999999 );
                self.removeClass( 'cpm-spinner' );
                return false;
            },
            select: function( event, ui ) {
                if ( ui.item.value == 'cpm_create_user' ) {
                    $( "form.cpm-user-create-form" ).find( 'input[type=text]' ).val( '' );
                    $( "#cpm-create-user-wrap" ).dialog( "open" );
                } else {
                    $( '.cpm-project-role>table' ).append( ui.item._user_meta );
                    $( "input.cpm-project-coworker" ).val( '' );
                }
                return false;
            }
        } ).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            return $( "<li>" )
                .append( '<a><div class="no-user-wrap"><p>No users found.</p> <span class="button-primary">Create a new user?</span></div></a>' )
                .appendTo( ul );
        };
    }
}


// Register a global custom directive called v-pm-popup-box
Vue.directive('pm-users', {
	inserted: function (el) { 
		Project.coWorkerSearch();
	}
});

// Register a global custom directive called v-pm-popup-box
Vue.directive('pm-popup-box', {
    inserted: function (el) {
        jQuery(el).dialog({
            autoOpen: false,
            modal: true,
            dialogClass: 'cpm-ui-dialog',
            width: 485,
            height: 'auto',
            position:['middle', 100],
        });
    }
});

// Register a global custom directive called v-pm-popup-box
Vue.directive('cpm-user-create-popup-box', {

    inserted: function (el) {
        jQuery(function($) {
            $(el).dialog({
                autoOpen: false,
                modal: true,
                dialogClass: 'cpm-ui-dialog cpm-user-ui-dialog',
                width: 400,
                height: 'auto',
                position:['middle', 100],
            });
        });
    }
});



