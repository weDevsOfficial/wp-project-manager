
var CPM_Vars = CPM_Vars ;
var CPM_CP = CPM_CP ;
var $ = jQuery ;
var single = new Vue ({
      el: '#single_discussion',
      date : {
           message :[] , 
           showsigle : true, 
           showform : false, 
           notifyUser : true 
      } , 
      methods : {
            showDetails: function( discussid ) {
                 single.$set('showform',false);
                 single.$set('showsigle',true);
                 
                 var data = {
                    //project_id: CPM_CP.current_project,
                    discussion_id: discussid,
                    action: 'cpm_get_discussion',
                    '_wpnonce': CPM_Vars.nonce
                };
                jQuery.post( CPM_Vars.ajaxurl, data, function ( result ) {
                      res = JSON.parse( result );
                    if( result.success !== false ) { 
                        single.$set( 'message', res ) ;
                    }else {
                         single.$set( 'message', "No Message exist, Please check....." ) ; 
                    };
                });
            },
           
            createDiscussion: function( e ) {
                var $ = jQuery; 
                tinyMCE.triggerSave(); 
                var form = $( ".cpm-message-form" ),
                data = form.serialize(),
                btn = form.find( 'input[name=create_message]' ),
                spnier = form.find( '.cpm-loading' );
                
                btn.attr( 'disabled', true );
                spnier.show();

                $.post( CPM_Vars.ajaxurl, data, function( res ) {

                    btn.attr( 'disabled', false );
                    spnier.hide();

                    res = $.parseJSON( res );

                    if( res.success ) {
                       var id = res.id; 
                      
                        discussion.getAllMessages() ;
                       //single.showDetails(id) ; 
                       
                    }

                    $( '.cpm-loading' ).remove();
                });
                
            }, 
            createComments: function(e) {
                e.preventDefault();
                tinyMCE.triggerSave(); 
                var form = $( ".cpm-discussion-comment-form" ),
                btn = form.find( 'input[name=cpm_new_comment]' ),
                spnier = form.find( '.cpm-loading' ),
                data = form.serialize();
                btn.attr( 'disabled', true );
                spnier.show();
                var did = $( 'input[name=parent_id]' ).val() ;  
                
                $.post(CPM_Vars.ajaxurl, data, function(res) {
                   btn.attr( 'disabled', false );
                   spnier.hide();
                   
                   res = JSON.parse(res);
                   if(res.success) {
                       //alert(res) ; 
                      single.showDetails(did) ;
                   }
                });
            },
            
            checkEDAccess: function ( autor, type ){
               var current_user  = CPM_Vars.current_login_user ,  autor = autor ,  type  = type; 
               if( autor === current_user && type === "" )
               {
                   return true; 
               }else {
                   return false; 
               }
            },
            
            delcomment: function( cid, mid ) {
                var cid = cid, mid = mid;
                if(confirm( CPM_Vars.message['delete_confirm'] )) {
                    var data = {
                        comment_id: cid,
                        action: 'cpm_comment_delete',
                        '_wpnonce': CPM_Vars.nonce
                    };
                    jQuery.post( CPM_Vars.ajaxurl, data, function ( result ) {
                          res = JSON.parse( result );
                        if(res.success === true ) { 
                            discussion.getAllMessages() ;
                              single.showDetails( mid ) ;
                        }else {
                              alert( 'unable to delete' ) ; 
                        } ;
                    });
                }
                
            }, 
            
            editcomment: function( mid, cid ) {
                $(".comment_"+cid).html('') ;
                // Show Comment Form
                    var data = {
                        project_id: CPM_CP.current_project,
                        object_id: mid,
                        comment_id: cid,
                        action: 'cpm_comment_edit_form',
                        '_wpnonce': CPM_Vars.nonce
                    };
                    jQuery.post( CPM_Vars.ajaxurl, data, function ( result ) {
                          res = JSON.parse( result );
                        if(res.success === true ) { 
                            $(".comment_"+cid).html(res.form) ;
                        }else {
                              alert( 'unable to edit, please try again' ) ; 
                        } ;
                    });
                
            }, 
            showAvatar: function (uid) {
              // alert(uid) ;
            }
      }
});


var discussion = new Vue({ 
                el: '#discussion_list',
                data: {
                   massage_list:[]
                },

                ready: function() {
                    this.getAllMessages();
                },

                methods: {
                    getAllMessages: function() {
                        
                        this.$set( 'massage_list',[] );
                        var data = {
                            project_id: CPM_CP.current_project,
                            action: 'cpm_get_all_discussion',
                            '_wpnonce': CPM_Vars.nonce
                        };
                        jQuery.post( CPM_Vars.ajaxurl, data, function ( res ) {
                            res = JSON.parse( res );
                            if(res.success !== false ) { 
                                 jQuery.each(res.data,  function( k, v ) {
                                     discussion.massage_list.push({
                                            discus_id : v.ID, 
                                            post_title: v.post_title, 
                                            avatar : v.avatar, 
                                            post_date : v.post_date, 
                                            post_content : v.post_content,
                                            comment_count : v.comment_count 
                                        } ) ; 
                                     
                                 });
                                 
                                var int_mid = res.data[0].ID ; 
                                var m = single.showDetails( int_mid ) ; 
                               
                            };
                            
                        });
                       
                        
                    },
                     
                     loadSingleDiscussion: function ( id ) {
                         single.showDetails( id );
                     },
                     
                    toggelForm: function() {
                          single.$set( 'showsigle',false );
                          single.$set( 'showform',true );
                          
                    } 
                    
                    
                     
                }
            });

