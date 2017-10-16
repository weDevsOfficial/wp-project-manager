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
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones?with=discussion_boards,task_lists&per_page=4&page='+ self.setCurrentPageNumber(self),
                success (res) {
                	res.data.map(function(milestone, index) {
			    		self.addMeta(milestone, index);
			    	});
                    self.$store.commit( 'setSelfMilestones', res.data );
                    self.$store.commit( 'setTotalMilestonePage', res.meta.pagination.total_pages );
                    NProgress.done();
                    self.loading = false;
                }
            };

            self.httpRequest(request);
        },

	    addMeta (milestone, index) {
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
	                achieve_date: this.due_date,
	                status: typeof this.milestone.status  === 'undefined' ? 'incomplete' : this.milestone.status,
	                order: '',
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
	    },
	   	/**
         * Get task completed percentage from todo list
         * 
         * @param  array tasks
         *  
         * @return float       
         */
        getProgressPercent: function( list ) {
            
            if (typeof list ==  'undefined') {
                return 0;
            }
            
            var total_tasks     = parseInt(list.meta.total_incomplete_tasks) + parseInt(list.meta.total_complete_tasks), //tasks.length,
                completed_tasks = list.meta.total_complete_tasks, //this.countCompletedTasks( list ),
                progress        = ( 100 * completed_tasks ) / total_tasks;

            return isNaN( progress ) ? 0 : progress.toFixed(0);
        },

        /**
         * Get task completed progress width
         * 
         * @param  array tasks 
         * 
         * @return obj       
         */
        getProgressStyle: function( list ) {
            if ( typeof list == 'undefined' ) {
                return 0;
            }
            var width = this.getProgressPercent( list );

            return { width: width+'%' };
        },

        deleteMilestone (milestone_id) {
        	if ( ! confirm( 'Are you sure!' ) ) {
                return;
            }
            var self = this;
            var request_data = {
                url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/milestones/' + milestone_id,
                type: 'DELETE',
                success: function(res) {
                    self.$store.commit('afterDeleteMilestone', milestone_id);

                    if (!self.$store.state.milestones.length) {
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
            }

            self.httpRequest(request_data);
        },

        humanDate (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                due_date = new Date(due_date),
                due_date = moment(due_date).format();

            return moment(due_date).fromNow(true);
        },
        momentFormat (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
                due_date = new Date(due_date),
                due_date = moment(due_date).format();

            return due_date;
        },
        getDueDate (milestone) {
            var due_date = milestone.achieve_date.date ? milestone.achieve_date.date : milestone.created_at.date;
            var due_date = this.dateFormat(due_date);

            return due_date;
        },

        milestoneMarkDone (milestone) {
        	milestone.status = 'complete';
        	this.newMilestone();
        },

        milestoneMarkUndone (milestone) {
        	milestone.status = 'incomplete';
        	this.newMilestone();
        }

	},
});

