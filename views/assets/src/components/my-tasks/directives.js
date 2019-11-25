/**
 * my task chart
 */


var PM_mytask = {
    chart: function(el, binding, vnode) {
        // var activity = vnode.context.text.activity,
        //     Task = vnode.context.text.task
        var context = vnode.context;

        if( typeof context.$store.state.myTask.graph !== 'undefined') {
            var graph = context.$store.state.myTask.graph;
        }
        var data = {
            labels: PM_mytask.getLabels(graph), //["Oct 05", "Oct 09", "Oct 15"],
            datasets: [
                {
                    label: __( 'activity', 'wedevs-proejct-manager' ),
                    fillColor: "rgba(120,200, 223, 0.4)",
                    strokeColor: "#79C7DF",
                    pointColor: "#79C7DF",
                    pointStrokeColor: "#79C7DF",
                    pointHighlightFill: "#79C7DF",
                    pointHighlightStroke: "#79C7DF",
                    data: PM_mytask.getActivities(graph),
                    backgroundColor: "rgba(120,200, 223, 0.4)",
                },
                {
                    label: __( 'Completed Task', 'wedevs-proejct-manager' ),
                    fillColor: "rgba(0, 144, 217, 1)",
                    strokeColor: "#0090D9",
                    pointColor: "#0090D9",
                    pointStrokeColor: "#0090D9",
                    pointHighlightFill: "#0090D9",
                    pointHighlightStroke: "rgba(0, 144, 217, 1)",
                    data: PM_mytask.getCompletedTasks(graph),
                    backgroundColor: "rgba(0, 144, 217, 0.5)",
                },
                {
                    label: __( 'Assigned Task', 'wedevs-proejct-manager' ),
                    fillColor: "#590340",
                    strokeColor: "#590340",
                    pointColor: "#590340",
                    pointStrokeColor: "#590340",
                    pointHighlightFill: "#590340",
                    pointHighlightStroke: "rgba(89, 3, 64, 1)",
                    data: PM_mytask.getAssignedTasks(graph),
                    backgroundColor: "rgba(89, 3, 64, 0.5)",
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

    getLabels: function(graph) {
        var labels = [];
        graph.map(function(lebel) {
            var date = PM_mytask.labelDateFormat(lebel.date_time.date);
            labels.push(date);
        });      
        
        return labels;
    },

    labelDateFormat: function(date) {
        date = new Date(date);
        return pm.Moment(date).format('MMM DD');
    },

    getActivities: function(graph) {
        var set_activities = [];

        graph.map(function(activity) {
            set_activities.push(activity.activities);
        });

        return set_activities;
    },

    getCompletedTasks: function(graph) {
        var set_tasks = [];

        graph.map(function(task) {
            set_tasks.push(task.completed_tasks);
        });

        return set_tasks;
    },

    getAssignedTasks: function(graph) {
        var set_tasks = [];

        graph.map(function(task) {
            set_tasks.push(task.assigned_tasks);
        });

        return set_tasks;
    }
}

var PM_PI = {
    update (element, binding, vnode) {
        var self = this;
        var context = vnode.context;
        var meta = context.$store.state.myTask.user.meta;
        
        if( typeof meta !== 'undefined' ) {
            var config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [ meta.data.total_current_tasks , meta.data.total_complete_tasks, meta.data.total_outstanding_tasks],
                        backgroundColor: [ "#61BD4F", "#0090D9", "#EB5A46"],
                    }],
                    labels: [
                        "Current Task",
                        "Completed Task",
                        "Outstanding Task"
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                       display: false,
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true
                    }
                }
            };

        }

        var ctx = element.getContext("2d");
        var piChart= new Chart(ctx, config);
    }
}

pm.Vue.directive('pm-mytask-chart', {
    inserted: function (el, binding, vnode) {
        PM_mytask.chart(el, binding, vnode);
    },
    update: function (el, binding, vnode) {
        PM_mytask.chart(el, binding, vnode);
    }
});

pm.Vue.directive('pm-mytask-pichart', {
    inserted: function (element, binding, vnode){
        PM_PI.update( element, binding, vnode);
    },
    update: function (element, binding, vnode){
        PM_PI.update( element, binding, vnode);
    }
});
