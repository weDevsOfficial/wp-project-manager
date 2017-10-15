import Vue from './../../vue/vue';

export default Vue.mixin({
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

		getDiscussion (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards?with=comments&per_page=2&page='+ self.setCurrentPageNumber(self),
	            success (res) {
	            	res.data.map(function(discuss, index) {
			    		self.addDiscussMeta(discuss);
			    	});
	                self.$store.commit( 'setDiscussion', res.data );
	                self.$store.commit( 'setDiscussionMeta', res.meta.pagination );

	                NProgress.done();
	            }
	        };
	        self.httpRequest(request);
	    },

	    getDiscuss (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/'+self.$route.params.discussion_id+'?with=comments',
	            success (res) {
	            	self.addDiscussMeta(res.data);
	                self.$store.commit( 'setDiscuss', res.data );
	                //self.$store.commit( 'setComments', res.data );
	                //self.$store.commit( 'setCommentsMeta', res.data );
	                
	                NProgress.done();
	            }
	        };
	        self.httpRequest(request);
	    },

	    addDiscussMeta (discuss) {
	    	discuss.edit_mode = false;

	    	discuss.comments.data.map(function(comment, index) {
	    		comment.edit_mode = false;
	    	});
	    },

	   	setCurrentPageNumber (self) {
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
	    newDiscuss: function() {
			// Exit from this function, If submit button disabled 
	        if ( this.submit_disabled ) {
	            return;
	        }
	        //console.log(new File( [this.files[0].thum], this.files[0].name, { type: 'image/png'} ), this.pfiles[0]);
			var data = new FormData();
			
	        // Disable submit button for preventing multiple click
	        this.submit_disabled = true;

	        var self      = this,
	            is_update = typeof this.discuss.id == 'undefined' ? false : true,
	            is_single = typeof self.$route.params.discussion_id === 'undefined' ? false : true;

	        this.discuss.description = typeof this.discuss.description === 'undefined' ? '' : this.discuss.description;
	            
            data.append('title', this.discuss.title);
            data.append('description', this.discuss.description);
            data.append('milestone', this.discuss.milestone_id);
            data.append('order', 0);
            
            this.deleted_files.map(function(del_file) {
            	data.append('files_to_delete[]', del_file);
            });
            

            this.files.map(function(file) {
            	if ( typeof file.attachment_id === 'undefined' ) {
            		var decode = self.dataURLtoFile(file.thumb, file.name);
					data.append( 'files[]', decode );
            	}
			});

	        // Showing loading option 
	        this.show_spinner = true;

	        if (is_update) {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/'+this.discuss.id;
	            var type = 'POST'; 
	        } else {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards';
	            var type = 'POST';
	        }

	        var request_data = {
	            url: url,
	            type: type,
			    data: data,
			    cache: false,
        		contentType: false,
        		processData: false,
	            success (res) {
	            	if ( is_single ) {
	            		self.getDiscuss(self);
	            	} else {
	            		self.getDiscussion(self);
	            	}
	                
	                self.show_spinner = false;

	                // Display a success toast, with a title
	                toastr.success(res.data.success);
	           
	                self.submit_disabled = false;
	                
	                if (is_update) {

	                	self.showHideDiscussForm(false, self.discuss);
	                } else {
	                	self.showHideDiscussForm(false);
	                }
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    toastr.error(value);
	                });
	                self.submit_disabled = false;
	            }
	        }
	        self.httpRequest(request_data);
	    },
        getMilestones (self) {
            var request = {
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones',
                success (res) {
                    self.$store.commit( 'setMilestones', res.data );
                }
            };
            self.httpRequest(request);
        },
        newComment () {
        	// Exit from this function, If submit button disabled 
	        if ( this.submit_disabled ) {
	            return;
	        }
	        
	        // Disable submit button for preventing multiple click
	        this.submit_disabled = true;
	        var self      = this,
	            is_update = typeof self.comment.id == 'undefined' ? false : true;

	            
            var data = new FormData();

            data.append('content', self.comment.content );
            data.append('commentable_id', self.discuss.id );
            data.append('commentable_type', 'discussion-board');

            this.deleted_files.map(function(del_file) {
            	data.append('files_to_delete[]', del_file);
            });
            

            this.files.map(function(file) {
            	if ( typeof file.attachment_id === 'undefined' ) {
            		var decode = self.dataURLtoFile(file.thumb, file.name);
					data.append( 'files[]', decode );
            	}
			});
	                    
	        // Showing loading option 
	        this.show_spinner = true;

	        if (is_update) {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments/'+this.comment.id;
	            var type = 'POST'; 
	        } else {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments';
	            var type = 'POST';
	        }

	        var request_data = {
	            url: url,
	            type: type,
	            data: data,
	            cache: false,
        		contentType: false,
        		processData: false,
	            success (res) {
	            	self.files = [];
	                self.getDiscuss(self);
	                self.show_spinner = false;
	                self.$root.$emit( 'after_comment' );

	                // Display a success toast, with a title
	                toastr.success(res.data.success);
	           
	                self.submit_disabled = false;

	                self.showHideCommentForm(false, self.comment);
	                self.$root.$emit( 'after_comment' );
	            },

	            error (res) {
	                self.show_spinner = false;
	                
	                // Showing error
	                res.data.error.map( function( value, index ) {
	                    toastr.error(value);
	                });
	                self.submit_disabled = false;
	            }
	        }

	        self.httpRequest(request_data);
        },

        deleteDiscuss (discuss_id) {
        	if ( ! confirm( 'Are you sure!' ) ) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/' + discuss_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteDiscuss', discuss_id);

                    if (!self.$store.state.discussion.length) {
                        self.$router.push({
                            name: 'discussions', 
                            params: { 
                                project_id: self.project_id 
                            }
                        });
                    } else {
                        self.getDiscussion(self);
                    }
                }
            }
            //self.$store.commit('afterDeleteDiscuss', discuss_id);
            self.httpRequest(request_data);
        },

        deleteComment(comment_id){
        	if ( ! confirm( 'Are you sure to delete this comment?' ) ) {
                return;
            }

            var self = this;
            var request_data = {
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/comments/'+ comment_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteComment', {
                    	comment_id: comment_id,
                    	discuss_id: self.discuss.id
                    } ); 
                }
            }
            //self.$store.commit('afterDeleteDiscuss', discuss_id);
            self.httpRequest(request_data);
        }
	},
});