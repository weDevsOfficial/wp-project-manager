;(function($) {

	'use strict';

	// Task root object for vue
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

		created: function() {
			this.getMilestone( this.project_id );
		},

		methods: {
			// New todo list
			newList: function() {
				this.hide_list_form = this.hide_list_form ? false : true;
			}
		}
	});

})(jQuery);