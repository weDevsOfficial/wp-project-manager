var CPM_Mixin = {
	data: {
		mixin_milestones: []
	}, 	

	methods: {
		getMilestone: function( project_id ) {
			var self = this,
                data = {
                    project_id: project_id,
                    action: 'cpm_get_milestones',
                    _wpnonce: CPM_Vars.nonce
                }

	        jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
	            if ( res.success ) {
	                self.mixin_milestones = res.data.milestones;
	            } 
	        });
		}
	}
}

Vue.component('todo-list-form', {
    template: '#tmpl-cpm-todo-list-form', 
    props: ['list', 'project_id', 'milestones'],


    data: function() {
    	return {
    		submit_btn_text: 'Add New',
    		selected_milestone: ''
    	}
    }
});

Vue.component('milestone-dropdown', {
    template: '#tmpl-cpm-milestone-dropdown', 
    props: ['milestones', 'selected_milestone'],

});

