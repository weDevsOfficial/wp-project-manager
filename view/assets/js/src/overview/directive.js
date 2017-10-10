import Vue from './../../vue/vue';

/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Overview = {
	chart: function(el, binding, vnode) {
		var $ = jQuery;
		
		var data = {
		    labels: PM_Overview.getLabels(vnode.context), //["Oct 05", "Oct 09", "Oct 15"],
		    datasets: [
		        {
		            label: "Activity",
		            fillColor: "rgba(120,200, 223, 0.4)",
		            strokeColor: "#79C7DF",
		            pointColor: "#79C7DF",
		            pointStrokeColor: "#79C7DF",
		            pointHighlightFill: "#79C7DF",
		            pointHighlightStroke: "#79C7DF",
		            data: PM_Overview.getActivities(vnode.context),
		            backgroundColor: "rgba(120,200, 223, 0.4)",
		        },
		        {
		            label: "Task",
		            fillColor: "rgba(185, 114, 182,0.5)",
		            strokeColor: "#B972B6",
		            pointColor: "#B972B6",
		            pointStrokeColor: "#B972B6",
		            pointHighlightFill: "#B972B6",
		            pointHighlightStroke: "rgba(151,187,205,1)",
		            data: PM_Overview.getTasks(vnode.context),
		            backgroundColor: "rgba(185, 114, 182,0.5)",
		        }
		    ]
		};

		Chart.defaults.global.responsive = true;
		var ctx = el.getContext("2d");
		// This will get the first returned node in the jQuery collection.
		var cpmChart = new Chart(ctx, {
			type: 'line',
			data: data,
			pointDotRadius : 8,
			animationSteps: 60,
            tooltipTemplate: "<%= labels + sss %>%" ,
			animationEasing: "easeOutQuart"
		});

	},

	getLabels: function(self) {
		var labels = [],
			graph_data = self.$store.state.graph;
		
		graph_data.map(function(graph) {
			var date = PM_Overview.labelDateFormat(graph.date_time.date);
			labels.push(date);
		});

		return labels;
	},

	labelDateFormat: function(date) {
		date = new Date(date);
        return moment(date).format('MMM DD');
	},

	getActivities: function(self) {
		var activities = self.$store.state.graph;
		var set_activities = [];

		activities.map(function(activity) {
			set_activities.push(activity.activities);
		});

		return set_activities;
	},

	getTasks: function(self) {
		var tasks = self.$store.state.graph;
		var set_tasks = [];

		tasks.map(function(task) {
			set_tasks.push(task.tasks);
		});

		return set_tasks;
	}
}


// Register a global custom directive called v-cpm-sortable
Vue.directive('pm-overview-chart', {
    update: function (el, binding, vnode) {
        PM_Overview.chart(el, binding, vnode);
    }
});