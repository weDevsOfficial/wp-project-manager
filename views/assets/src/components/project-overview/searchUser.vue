<template>
    <div>
        <input type="text" class="pm-users-search" @keyup="" v-model="searchChar">
    </div>
    
</template>

<script>

    export default {

        data:function(){
          return {
              searchChar : ''
          }
        },

        created:function(){

        },
        mounted:function () {
            var self = this;
            var $ = jQuery;
            var pm_abort;
            $( ".pm-user-search" ).autocomplete( {
                minLength: 3,

                source: function( request, response ) {
                    var args = {
                        conditions: {
                            query : 'alm'
                        },
                        callback: function (res) {
                            if ( res.data.length ) {
                                response( res.data );
                            } else {
                                response({
                                    value: '0',
                                });
                            }
                        }
                    }

                    if ( pm_abort ) {
                        pm_abort.abort();
                    }
                    pm_abort = self.get_search_user(args);
                },

                search: function() {
                    $( this ).addClass( 'pm-spinner' );
                },

                open: function() {
                    var self = $( this );
                    self.autocomplete( 'widget' ).css( 'z-index', 999999 );
                    self.removeClass( 'pm-spinner' );
                    return false;
                },

                select: function( event, ui ) {
                    if ( ui.item.value === '0' ) {
                        $( "form.pm-user-create-form" ).find( 'input[type=text]' ).val( '' );
                        $( "#pm-create-user-wrap" ).dialog( "open" );
                    } else {

                        var has_user = this.selectedUsers.find(function(user) {
                            return ui.item.id === user.id ? true : false;
                        });

                        if (!has_user) {
                            this.addUserMeta(ui.item);
                            // this.$root.$store.commit(
                            //     'setNewUser',
                            //     {
                            //         project_id: this.project_id,
                            //         user: ui.item
                            //     }
                            // );
                            this.$store.commit('updateSeletedUser', {
                                item:  ui.item,
                                project_id: this.project_id
                            });
                        }

                        $( '.pm-project-role>table' ).append( ui.item._user_meta );
                        $( "input.pm-project-coworker" ).val( '' );
                    }
                    return false;
                }

            }).data(function(data){
                console.log(data);
            });
        },

        computed:{

        }
    }
</script>

<style scoped>

</style>
