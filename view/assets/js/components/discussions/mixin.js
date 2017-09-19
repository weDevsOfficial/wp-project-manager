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

		getDiscuss (self) {
	        var request = {
	            url: self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards',
	            success (res) {
	            	self.addMeta(res.data);
	                self.$store.commit( 'setDiscuss', res.data );
	            }
	        };
	        self.httpRequest(request);
	    },

	    addMeta (discussion) {
	    	discussion.map(function(discuss, index) {
	    		discuss.edit_mode = false;
	    	});
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
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards/'+this.discuss.id+'?with=comments';
	            var type = 'PUT'; 
	        } else {
	            var url = self.base_url + '/cpm/v2/projects/'+self.project_id+'/discussion-boards?with=comments';
	            var type = 'POST';
	        }

	        var request_data = {
	            url: url,
	            type: type,
	            data: form_data,
	            success (res) {
	                self.getDiscuss(self);
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
	    }
	},
});