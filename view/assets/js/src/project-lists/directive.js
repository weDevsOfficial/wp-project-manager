import Vue from './../../vue/vue';

var Project = {
    coWorkerSearch: function(el, binding, vnode) {
        
        var $ = jQuery;
        var cpm_abort;
        var context = vnode.context;

        $( ".cpm-project-coworker" ).autocomplete( {
            minLength: 3,
            
            source: function( request, response ) {
                var data = {},
                    url = context.base_url + '/cpm/v2/users/search?query=' + request.term;
                
                if ( cpm_abort ) {
                    cpm_abort.abort();
                }

                cpm_abort = $.get( url, data, function( resp ) {
                    
                    if ( resp.data.length ) {
                        response( resp.data );
                    } else {
                        response({
                            value: '0',
                        });
                    }
                });
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
                if ( ui.item.value === '0' ) {
                    $( "form.cpm-user-create-form" ).find( 'input[type=text]' ).val( '' );
                    $( "#cpm-create-user-wrap" ).dialog( "open" );
                } else {

                    var has_user = context.selectedUsers.find(function(user) {
                        return ui.item.id === user.id ? true : false;
                    });
                    
                    if (!has_user) {
                        context.addUserMeta(ui.item);
                        // context.$root.$store.commit(
                        //     'setNewUser',
                        //     {
                        //         project_id: context.project_id,
                        //         user: ui.item
                        //     }
                        // );
                        context.$root.$store.commit('updateSeletedUser', ui.item);
                    }
                    
                    $( '.cpm-project-role>table' ).append( ui.item._user_meta );
                    $( "input.cpm-project-coworker" ).val( '' );
                }
                return false;
            }

        } ).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
            if ( item.email ) {
                return $( "<li>" )
                .append( '<a>'+item.display_name+'</a>' )
                .appendTo( ul );
            } else {
                return $( "<li>" )
                .append( '<a><div class="no-user-wrap"><p>No users found.</p> <span class="button-primary">Create a new user?</span></div></a>' )
                .appendTo( ul );
            }
            
        };
    }
}


// Register a global custom directive called v-pm-popup-box
Vue.directive('pm-users', {
	inserted: function (el, binding, vnode) { 
		Project.coWorkerSearch(el, binding, vnode);
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



