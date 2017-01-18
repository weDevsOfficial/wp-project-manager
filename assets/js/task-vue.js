;(function($) {

	'use strict';

	// Task root object 
	var CPM_Task = new Vue({
		el: '#cpm-task-el',

		mixins: [CPM_Mixin],

		data: {
			project_id: CPM_Vars.project_id,
			loading: true,
			hide_list_form: true,
			lists: [],
			list: {},
			text: {
				new_todo: CPM_Vars.message.new_todo
			}
		},

		// Initial doing 
		created: function() {
			this.$on( 'cpm_task_hook', this.getTaskHook );
			this.getMilestone( this.project_id );
		},

		methods: {
			// New todo list
			newList: function() {
				this.hide_list_form = this.hide_list_form ? false : true;
			},

			// Get all hook from chiled components
			getTaskHook: function( hook, data, e ) {

				switch( hook ) {
					case 'hide_todo_list_form':
						this.hide_list_form = true;
						break;

					default:
						break;
				}
			}
		}
	});

})(jQuery);