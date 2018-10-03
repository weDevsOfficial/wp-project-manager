
export default {
     data () {
        return {

        }
    },
    methods: {
        can_create_message () {
            return this.user_can("create_message");
        },
        can_edit_message (message) {
            var user = PM_Vars.current_user;
            if (this.is_manager()) {
                return true;
            }

            if ( message.creator.data.id == user.ID ){
                return true;
            }

            return false;
        },
        showHideDiscussForm (status, discuss) {
            var discuss   = discuss || false,
                discuss   = jQuery.isEmptyObject(discuss) ? false : discuss;

            if ( discuss && typeof discuss.edit_mode != 'undefined' ) {
                if ( status === 'toggle' ) {
                    discuss.edit_mode = discuss.edit_mode ? false : true;
                } else {
                    discuss.edit_mode = status;
                }
            } else {
                this.$store.commit( 'projectDiscussions/showHideDiscussForm', status);
            }
        },

        showHideDiscussCommentForm (status, comment) {
            if ( status === 'toggle' ) {
                comment.edit_mode = comment.edit_mode ? false : true;
            } else {
                comment.edit_mode = status;
            }
        },

        getDiscussion (args) {
            var self = this;
            var pre_define = {
                    conditions: {
                        with: 'comments',
                        per_page: 20,
                        page: 1,
                    },
                    callback: false
                };

            var args       = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);
            
            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards?'+ conditions,
                success (res) {
                    res.data.map(function(discuss, index) {
                        self.addDiscussMeta(discuss);
                    });
                    self.$store.commit( 'projectDiscussions/setDiscussion', res.data );
                    self.$store.commit( 'projectDiscussions/setDiscussionMeta', res.meta );

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    } 
                }
            };
            self.httpRequest(request);
        },

        getDiscuss (args) {
            var self = this;
            var pre_define = {
                    conditions: {
                        with: 'comments',
                    },
                    callback: false
                };

            var args       = jQuery.extend(true, pre_define, args );
            var conditions = self.generateConditions(args.conditions);

            var request = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards/'+self.$route.params.discussion_id+'?'+conditions, ///with=comments',
                success (res) {
                    self.addDiscussMeta(res.data);
                    self.$store.commit( 'projectDiscussions/setDiscuss', res.data );

                    if(typeof args.callback === 'function' ) {
                        args.callback(res.data);
                    }
                }
            };
            self.httpRequest(request);
        },

        addDiscussMeta (discuss) {
            var self = this;
            discuss.edit_mode = false;

            if (typeof discuss.comments !== 'undefined' ) {
                discuss.comments.data.map(function(comment, index) {
                    self.addCommentMeta(comment);
                });
            }
        },

        setCurrentPageNumber () {
            var self = this;
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },

        /**
         * Insert and edit task
         * 
         * @return void
         */
        newDiscuss: function(args) {
            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                //return;
            }
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            
            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args );
            var data = new FormData();
                
            data.append('title', args.title);
            data.append('description', args.description);
            data.append('milestone', args.milestone_id);
            data.append('notify_users', args.notify_users);
            data.append('order', 0);
            
            args.deleted_files.map(function(del_file) {
                data.append('files_to_delete[]', del_file);
            });
           
            args.files.map(function(file) {
                if ( typeof file.attachment_id === 'undefined' ) {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append( 'files[]', decode );
                }
            });

            // Showing loading option 
            this.show_spinner = true;
            data = pm_apply_filters( 'before_discuss_save', data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) {

                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
                    self.submit_disabled = false;
                    self.show_spinner = false;
                    self.addDiscussMeta(res.data);
                    self.showHideDiscussForm(false);
                    self.$root.$emit( 'after_comment' );
                    self.$store.commit( 'projectDiscussions/newDiscuss', res.data );
                    self.$store.commit( 'projectDiscussions/updateMetaAfterNewDiscussion' );
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    self.$store.commit('updateProjectMeta', 'total_discussion_boards');


                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },

                error (res) {
                    self.show_spinner = false;
                    
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    self.submit_disabled = false;
                }
            }
            self.httpRequest(request_data);
        },

        updateDiscuss (args) {
            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                return;
            }

            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args );
            var data = new FormData();
            
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;

            data.append('title', args.title);
            data.append('description', args.description);
            data.append('milestone', args.milestone_id);
            data.append('notify_users', args.notify_users);
            data.append('order', 0);
            
            args.deleted_files.map(function(del_file) {
                data.append('files_to_delete[]', del_file);
            });
            

            args.files.map(function(file) {
                if ( typeof file.attachment_id === 'undefined' ) {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append( 'files[]', decode );
                }
            });

            // Showing loading option 
            this.show_spinner = true;
            data = pm_apply_filters( 'before_discuss_save', data );
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards/'+this.discuss.id,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) {
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
                    self.addDiscussMeta(res.data);
                    self.submit_disabled = false;

                    self.showHideDiscussForm(false, self.discuss);

                    self.$store.commit( 'projectDiscussions/updateDiscuss', res.data );
                    self.$root.$emit( 'after_comment' );
                    self.$store.commit('updateProjectMeta', 'total_activities');
                    
                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },

                error (res) {
                    self.show_spinner = false;
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    self.submit_disabled = false;
                }
            }
            self.httpRequest(request_data);
        },

        lockUnlock (discuss) {
            var self = this;
            var data = {
                is_private: discuss.meta.privacy == '0' ? 1 : 0
            }
            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards/privacy/'+discuss.id,
                type: 'POST',
                data: data,
                success (res) {
                  
                    if (typeof discuss.callback === 'function') {
                        discuss.callback(res.data);
                    }

                    self.$store.commit('projectDiscussions/updatePrivacy', {
                        privacy: data.is_private,
                        project_id: self.project_id,
                        discuss_id: discuss.id

                    });
                },

                error (res) {
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                  
                }
            }
            self.httpRequest(request_data);
        },

        newComment (args) {
            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                return;
            }
            
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            
            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args );
            var data = new FormData();

            data.append('content', args.content );
            data.append('mentioned_users', args.mentioned_users );
            data.append('commentable_id', args.commentable_id );
            data.append('commentable_type', args.commentable_type); //'discussion-board'
            data.append('notify_users', args.notify_users);

            args.files.map(function(file) {
                if ( typeof file.attachment_id === 'undefined' ) {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append( 'files[]', decode );
                }
            });
                        
            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments',
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) {
                    self.addCommentMeta(res.data);
                    self.files = [];
                    //self.getDiscuss(self);
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
               
                    self.submit_disabled = false;

                    self.showHideDiscussCommentForm(false, self.comment);
                    
                    //self.$root.$emit('after_comment');
                    
                    self.$store.commit( 'projectDiscussions/afterNewComment', 
                        {
                            'comment': res.data, 
                            'commentable_id': args.commentable_id
                        }
                    );

                    self.$store.commit('updateProjectMeta', 'total_activities');

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },

                error (res) {
                    self.show_spinner = false;
                    
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    self.submit_disabled = false;
                }
            }

            self.httpRequest(request_data);
        },

        updateComment (args) {
            // Exit from this function, If submit button disabled 
            if ( this.submit_disabled ) {
                return;
            }
            
            // Disable submit button for preventing multiple click
            this.submit_disabled = true;
            
            var self = this;
            var pre_define = {};
            var args = jQuery.extend(true, pre_define, args );
            var data = new FormData();

            data.append('content', args.content );
            data.append('mentioned_users', args.mentioned_users );
            data.append('commentable_id', args.commentable_id );
            data.append('commentable_type', args.commentable_type); //'discussion-board'
            data.append('notify_users', args.notify_users);
            
            args.deleted_files.map(function(del_file) {
                data.append('files_to_delete[]', del_file);
            });
            
            args.files.map(function(file) {
                if ( typeof file.attachment_id === 'undefined' ) {
                    var decode = self.dataURLtoFile(file.thumb, file.name);
                    data.append( 'files[]', decode );
                }
            });
                        
            // Showing loading option 
            this.show_spinner = true;

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/'+args.comment_id,
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                success (res) {
                    self.addCommentMeta(res.data);
                    self.files = [];
                    //self.getDiscuss(self);
                    self.show_spinner = false;
                    // Display a success toast, with a title
                    pm.Toastr.success(res.message);
               
                    self.submit_disabled = false;

                    self.showHideDiscussCommentForm(false, self.comment);
                    
                    //self.$root.$emit('after_comment', true);
                    
                    self.$store.commit(
                        'projectDiscussions/afterUpdateComment', 
                        {
                            'comment': res.data, 
                            'commentable_id': args.commentable_id,
                            'comment_id': args.comment_id
                        }
                    );
                    self.$store.commit('updateProjectMeta', 'total_activities');

                    if (typeof args.callback === 'function') {
                        args.callback(res.data);
                    }
                },

                error (res) {
                    self.show_spinner = false;
                    
                    // Showing error
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                    if ( res.status == 400 ) {
                        var params = res.responseJSON.data.params;
                        for ( var obj in params ){
                            pm.Toastr.error(params[obj][0]);
                        }
                    }
                    self.submit_disabled = false;
                }
            }

            self.httpRequest(request_data);
        },

        addCommentMeta (comment) {
            comment.edit_mode = false;
        },

        deleteDiscuss (args) {
            if ( ! confirm( this.__( 'Are you sure?', 'wedevs-project-manager') ) ) {
                return;
            }
            var self = this;
            var pre_define = {
                    discuss_id: false,
                    callback: false
                };

            var args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards/' + args.discuss_id+'/delete',
                type: 'POST',
                success (res) {
                    self.$store.commit('projectDiscussions/afterDeleteDiscuss', args.discuss_id);

                    if (!self.$store.state.projectDiscussions.discussion.length) {
                        self.$router.push({
                            name: 'discussions', 
                            params: { 
                                project_id: self.project_id 
                            }
                        });
                    } else {
                        self.getDiscussion();
                    }
                    self.$store.commit('decrementProjectMeta', 'total_discussion_boards');
                    self.$store.commit('updateProjectMeta', 'total_activities');
                
                    pm.Toastr.success(res.message);
                    if (typeof args.callback === 'function') {
                        args.callback();
                    } 
                },

                error ( res ) {
                    res.responseJSON.message.map( function( value, index ) {
                        pm.Toastr.error(value);
                    });
                }
            }
            
            self.httpRequest(request_data);
        },

        deleteComment(args){
            if ( ! confirm( this.__( 'Are you sure to delete this comment?', 'wedevs-project-manager') ) ) {
                return;
            }

            var self = this;
            var pre_define = {
                    comment_id: false,
                    callback: false,
                    commentable_id: false
                };

            var args = jQuery.extend(true, pre_define, args);

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/'+ args.comment_id+'/delete',
                type: 'POST',
                success: function(res) {
                    pm.Toastr.success(res.message);
                    self.$store.commit('projectDiscussions/afterDeleteComment', {
                        comment_id: args.comment_id,
                        commentable_id: args.commentable_id
                    } );
                    self.$store.commit('updateProjectMeta', 'total_activities');
                },
                error (res) {
                    if (res.status == 500 ) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
            }
            
            self.httpRequest(request_data);
        },

        viewAction (blank, discuss) {
            var blank = blank || false;
            var discuss = discuss || false;

            this.$store.commit('projectDiscussions/balankTemplateStatus', blank);
            this.$store.commit('projectDiscussions/discussTemplateStatus', discuss);
        },

        lazyAction() {
            var discussion = this.$store.state.projectDiscussions.discussion;
            
            if(discussion.length){
                this.viewAction(false, true);
            }

            if(!discussion.length){
                this.viewAction(true, false);
            }
        },
        privateClass ( discuss ){
            if( typeof discuss.meta.privacy !== 'undefined' ){
                if ( discuss.meta.privacy == 1 ){
                    return 'dashicons dashicons-lock'
                }else {
                    return 'dashicons dashicons-unlock'
                }
            }
        },

        getMatches(string, regex, index) {
            index || (index = 1);

            var matches = [];
            var match;
            while (match = regex.exec(string)) {
                matches.push(match[index]);
            }

            return matches;
        }

    },
};
