
export default pm.Vue.mixin({
	methods: {
		showHideDiscussForm (status, discuss) {
			var discuss   = discuss || false,
			    discuss   = jQuery.isEmptyObject(discuss) ? false : discuss;

			if ( discuss ) {
			    if ( status === 'toggle' ) {
			        discuss.edit_mode = discuss.edit_mode ? false : true;
			    } else {
			        discuss.edit_mode = status;
			    }
			} else {
			    this.$store.commit('showHideDiscussForm', status);
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
	                    per_page: 2,
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
	                self.$store.commit( 'setDiscussion', res.data );
	                self.$store.commit( 'setDiscussionMeta', res.meta.pagination );

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
	                self.$store.commit( 'setDiscuss', res.data );

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

        dataURLtoFile (dataurl, filename) {
		    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		    while(n--){
		        u8arr[n] = bstr.charCodeAt(n);
		    }
		    return new File([u8arr], filename, {type:mime});
		},

	   	/**
	     * Insert and edit task
	     * 
	     * @return void
	     */
	    newDiscuss: function(args) {
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
	            
            data.append('title', args.title);
            data.append('description', args.description);
            data.append('milestone', args.milestone_id);
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

	        var request_data = {
	            url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards',
	            type: 'POST',
			    data: data,
			    cache: false,
        		contentType: false,
        		processData: false,
	            success (res) {

	                // Display a success toast, with a title
	                pm.Toastr.success(res.data.success);
	                self.submit_disabled = false;
	                self.show_spinner = false;
	           		self.addDiscussMeta(res.data);
	                self.showHideDiscussForm(false);
	                self.$root.$emit( 'after_comment' );
	                self.$store.commit( 'newDiscuss', res.data );
	                self.$store.commit('updateMetaAfterNewDiscussion');

	                if (typeof args.callback === 'function') {
	                	args.callback(res.data);
	                }
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    pm.Toastr.error(value);
	                });
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
	                pm.Toastr.success(res.data.success);
	           		self.addDiscussMeta(res.data);
	                self.submit_disabled = false;

	                self.showHideDiscussForm(false, self.discuss);

	                self.$store.commit( 'updateDiscuss', res.data );
	                self.$root.$emit( 'after_comment' );
	                
	                if (typeof args.callback === 'function') {
	                	args.callback(res.data);
	                }
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    pm.Toastr.error(value);
	                });
	                self.submit_disabled = false;
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
            data.append('commentable_id', args.commentable_id );
            data.append('commentable_type', args.commentable_type); //'discussion-board'

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
	                pm.Toastr.success(res.data.success);
	           
	                self.submit_disabled = false;

	                self.showHideCommentForm(false, self.comment);
	                self.$root.$emit('after_comment');
	                self.$store.commit(
	                	'afterNewComment', 
	                	{
	                		'comment': res.data, 
	                		'commentable_id': args.commentable_id
	                	}
	                );

	                if (typeof args.callback === 'function') {
	                	args.callback(res.data);
	                }
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    pm.Toastr.error(value);
	                });
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
            data.append('commentable_id', args.commentable_id );
            data.append('commentable_type', args.commentable_type); //'discussion-board'
            
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
	                pm.Toastr.success(res.data.success);
	           
	                self.submit_disabled = false;

	                self.showHideCommentForm(false, self.comment);
	                self.$root.$emit('after_comment');
	                self.$store.commit(
	                	'afterUpdateComment', 
	                	{
	                		'comment': res.data, 
	                		'commentable_id': args.commentable_id,
	                		'comment_id': args.comment_id
	                	}
	                );

	                if (typeof args.callback === 'function') {
	                	args.callback(res.data);
	                }
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    pm.Toastr.error(value);
	                });
	                self.submit_disabled = false;
	            }
	        }

	        self.httpRequest(request_data);
        },

        addCommentMeta (comment) {
        	comment.edit_mode = false;
        },

        deleteDiscuss (args) {
        	if ( ! confirm( this.text.are_you_sure ) ) {
                return;
            }
            var self = this;
			var pre_define = {
					discuss_id: false,
					callback: false
				};

			var args = jQuery.extend(true, pre_define, args );

            var request_data = {
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/discussion-boards/' + args.discuss_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteDiscuss', args.discuss_id);

                    if (!self.$store.state.discussion.length) {
                        self.$router.push({
                            name: 'discussions', 
                            params: { 
                                project_id: self.project_id 
                            }
                        });
                    } else {
                        self.getDiscussion();
                    }

                   	if (typeof args.callback === 'function') {
						args.callback();
					} 
                }
            }
            
            self.httpRequest(request_data);
        },

        deleteComment(args){
        	if ( ! confirm( this.text.delete_comment_conf ) ) {
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
                url: self.base_url + '/pm/v2/projects/'+self.project_id+'/comments/'+ args.comment_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteComment', {
                    	comment_id: args.comment_id,
                    	commentable_id: args.commentable_id
                    } ); 
                }
            }
            
            self.httpRequest(request_data);
        },

		viewAction (blank, discuss) {
			var blank = blank || false;
			var discuss = discuss || false;

			this.$store.commit('balankTemplateStatus', blank);
			this.$store.commit('discussTemplateStatus', discuss);
		},

	    lazyAction() {
            var discussion = this.$store.state.discussion;
            
            if(discussion.length){
                this.viewAction(false, true);
            }

            if(!discussion.length){
                this.viewAction(true, false);
            }
        }
	},
});