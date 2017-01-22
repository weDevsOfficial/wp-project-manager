;(function($) {

	'use strict';

	// Task root object 
	var CPM_Task = new Vue({
		el: '#cpm-task-el',

		mixins: [CPM_Mixin],

		data: {
			project_id: CPM_Vars.project_id,
			loading: true,
			show_list_form: false,
			lists: [],
			milestones: '',
			init: {},
			list: {},
			text: {
				new_todo: CPM_Vars.message.new_todo
			}
		},

		// Initial doing 
		created: function() {
			this.$on( 'cpm_task_hook', this.getTaskHook );
			this.getInitialData( this.project_id );
			//this.getMilestone( this.project_id );
		},

		methods: {
			// New todo list
			newList: function() {
				this.show_list_form = this.show_list_form ? false : true;
			},

			// Get all hook from chiled components
			getTaskHook: function( hook, data, e ) {

				switch( hook ) {
					case 'hide_todo_list_form':
						this.show_list_form = false;
						break; 

					case 'update_todo_list':
						this.lists.splice( 0, 0, data.data.list.list );
						this.show_list_form = false;
						this.list = {};
						break;

					case 'update_todo_list_btn':
						this.lists[data.index].edit_mode = this.lists[data.index].edit_mode ? false : true; 
						break;

					default:
						break;
				}
			},

			// Get initial data for todo list page 
			getInitialData: function( project_id ) {
				var self = this,
					data = {
						project_id: project_id,
						_wpnonce: CPM_Vars.nonce,
						action: 'cpm_initial_todo_list'
					}

				jQuery.post( CPM_Vars.ajaxurl, data, function( res ) {
	                if ( res.success ) {
	                    self.milestones = res.data.milestones;
	                    self.lists      = res.data.lists;
	                    self.tasks      = res.data.tasks;
	                    self.init       = res.data;
	                    
	                    if ( self.lists.length ) {
	                    	self.loading = false;
	                    }
	                    
	                    //for (var key in res.data ) {
						// 	if ( res.data.hasOwnProperty( key ) ) {
						// 		self.$data[key] = res.data[key];
						// 	}
						// }
	                } 
	                
	            });
			},
		}
	});

})(jQuery);