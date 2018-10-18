
/**
 * Required jQuery methods 
 * 
 * @type Object
 */
var PM_Overview = {
    chart: function(el, binding, vnode) {
        var activity = vnode.context.__( 'Activity', 'wedevs-project-manager'),
            Task = vnode.context.__( 'Task', 'wedevs-project-manager')
        var data = {
            labels: PM_Overview.getLabels(vnode.context), //["Oct 05", "Oct 09", "Oct 15"],
            datasets: [
                {
                    label: activity,
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
                    label: Task,
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
        var pmChart = new pm.Chart(ctx, {
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
            graph_data = self.graph;
        
        graph_data.map(function(graph) {
            var date = PM_Overview.labelDateFormat(graph.date_time.date);
            labels.push(date);
        });

        return labels;
    },

    labelDateFormat: function(date) {
        date = new Date(date);
        return pm.Moment(date).format('MMM DD');
    },

    getActivities: function(self) {
        var activities = self.graph;
        var set_activities = [];

        activities.map(function(activity) {
            set_activities.push(activity.activities);
        });

        return set_activities;
    },

    getTasks: function(self) {
        var tasks = self.graph;
        var set_tasks = [];

        tasks.map(function(task) {
            set_tasks.push(task.tasks);
        });

        return set_tasks;
    }
}


// Register a global custom directive called v-pm-sortable
pm.Vue.directive('pm-overview-chart', {
    inserted: function (el, binding, vnode) {
        PM_Overview.chart(el, binding, vnode);
    },
    update: function (el, binding, vnode) {
        PM_Overview.chart(el, binding, vnode);
    }
});