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

		getDiscussion (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards?with=comments',
	            success (res) {
	            	res.data.map(function(discuss, index) {
			    		self.addMeta(discuss);
			    	});
	                self.$store.commit( 'setDiscussion', res.data );
	            }
	        };
	        self.httpRequest(request);
	    },

	    getDiscuss (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/'+self.$route.params.discussion_id+'?with=comments',
	            success (res) {
	            	self.addMeta(res.data);
	                self.$store.commit( 'setDiscuss', res.data );
	            }
	        };
	        self.httpRequest(request);
	    },

	    addMeta (discuss) {
	    	discuss.edit_mode = false;
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
	        
	        // Disable submit button for preventing multiple click
	        this.submit_disabled = true;

	        var self      = this,
	            is_update = typeof this.discuss.id == 'undefined' ? false : true,
	            
	            form_data = {
	                title: this.discuss.title,
	                description: this.discuss.description,
	                order: '',
	                milestone: 4
	            };
	        
	        // Showing loading option 
	        this.show_spinner = true;

	        if (is_update) {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/'+this.discuss.id;
	            var type = 'PUT'; 
	        } else {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards';
	            var type = 'POST';
	        }

	        var request_data = {
	            url: url,
	            type: type,
	            data: form_data,
	            success (res) {
	                self.getDiscussion(self);
	                self.show_spinner = false;

	                // Display a success toast, with a title
	                toastr.success(res.data.success);
	           
	                self.submit_disabled = false;
	                self.showHideDiscussForm(false);
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
	},
});