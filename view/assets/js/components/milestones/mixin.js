import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		showHideMilestoneForm (status, milestone) {
			var milestone   = milestone || false,
			    milestone   = jQuery.isEmptyObject(milestone) ? false : milestone;

			if ( milestone ) {
			    if ( status === 'toggle' ) {
			        milestone.edit_mode = milestone.edit_mode ? false : true;
			    } else {
			        milestone.edit_mode = status;
			    }
			} else {
			    this.$store.commit('showHideMilestoneForm', status);
			}
		},

		showHideCommentForm (status, comment) {
			if ( status === 'toggle' ) {
		        comment.edit_mode = comment.edit_mode ? false : true;
		    } else {
		        comment.edit_mode = status;
		    }
		},


	    getMilestone (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones/'+self.$route.params.discussion_id+'?with=discussion_boards,task_lists',
	            success (res) {
	            	self.addMeta(res.data);
	                self.$store.commit( 'setMilestone', res.data );
	            }
	        };
	        self.httpRequest(request);
	    },

	    getSelfMilestones (self) {
            var request = {
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones?with=discussion_boards,task_lists&per_page=2&page='+ self.setCurrentPageNumber(self),
                success (res) {
                	res.data.map(function(milestone, index) {
			    		self.addMeta(milestone);
			    	});
                    self.$store.commit( 'setSelfMilestones', res.data );
                    self.$store.commit( 'setTotalMilestonePage', res.meta.pagination.total_pages );
                }
            };

            self.httpRequest(request);
        },

	    addMeta (milestone) {
	    	milestone.edit_mode = false;
	    },

	    setCurrentPageNumber (self) {
            var current_page_number = self.$route.params.current_page_number ? self.$route.params.current_page_number : 1;
            self.current_page_number = current_page_number;
            return current_page_number;
        },

	    /**
	     * Insert and edit task
	     * 
	     * @return void
	     */
	    newMilestone: function() {
	        // Exit from this function, If submit button disabled 
	        if ( this.submit_disabled ) {
	            return;
	        }
	        
	        // Disable submit button for preventing multiple click
	        this.submit_disabled = true;

	        var self      = this,
	            is_update = typeof this.milestone.id == 'undefined' ? false : true,
	            form_data = {
	                title: this.milestone.title,
	                description: this.milestone.description,
	                order: '',
	                milestone: 4
	            };
	        
	        // Showing loading option 
	        this.show_spinner = true;

	        if (is_update) {
				var url  = self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones/'+this.milestone.id;
				var type = 'PUT'; 
	        } else {
				var url  = self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones';
				var type = 'POST';
	        }

	        var request_data = {
	            url: url,
	            type: type,
	            data: form_data,
	            success (res) {
	            	
	            	self.getSelfMilestones(self);
	            	
	                self.show_spinner = false;

	                // Display a success toast, with a title
	                toastr.success(res.data.success);
	           
	                self.submit_disabled = false;
	                
	                if (is_update) {

	                	self.showHideMilestoneForm(false, self.milestone);
	                } else {
	                	self.showHideMilestoneForm(false);
	                }

                	if ( self.section === 'milestones' ) {
                    	self.afterNewMilestone(self, res, is_update);
                    }

                    if ( self.section === 'single' ) {
                    	//self.afterNewSingleMilestone(self, res, is_update);
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

	    afterNewMilestone (self, res, is_update) {

			if ( self.$route.params.current_page_number > 1 ) {
				// named route
				self.$router.push({ 
					name: 'milestones', 
					params: { 
						project_id: self.project_id 
					}
				});
				
			} else {
				self.getSelfMilestones(self);
			}
	    }

	},
});

