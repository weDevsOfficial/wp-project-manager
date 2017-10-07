import Vue from './../../vue/vue';

export default Vue.mixin({
	methods: {
		newCategory () {
			// Exit from this function, If submit button disabled 
	        if ( this.submit_disabled ) {
	            return;
	        }
	        
	        // Disable submit button for preventing multiple click
	        this.submit_disabled = true;

	        var self      = this,
	            form_data = {
	                title: this.title,
	                description: this.description,
	            };
	        
	        // Showing loading option 
	        this.show_spinner = true;

	        var request_data = {
	            url: self.base_url + '/cpm/v2/categories',
	            type: 'POST',
	            data: form_data,
	            
	            success (res) {
	            	
	           		self.show_spinner = false;

	                // Display a success toast, with a title
	                toastr.success(res.data.success);
	           
	                self.submit_disabled = false;

	                self.$store.commit('afterNewCategories', res.data);

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

		updateCategory () {

		},

		getCategories () {
			var self = this;
			
            var request_data = {
                url: self.base_url + '/cpm/v2/categories',
                success: function(res) {
                	res.data.map(function(category, index) {
                		self.addCategoryMeta(category);
                	});
                	
                    self.$store.commit('setCategories', res.data);
                }
            };

            self.httpRequest(request_data);
		},

		getCategory () {

		},

		addCategoryMeta (category) {
			category.edit_mode = false;
		},

		showHideCategoryEditForm (category) {
			category.edit_mode = category.edit_mode ? false : true;
		}
	},
});