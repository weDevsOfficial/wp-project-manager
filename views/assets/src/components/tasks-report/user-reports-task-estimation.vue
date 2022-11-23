<template>
    <div class="user-reports-wrap">
        <div class="user-wrap" v-for="(user, id) in reports.users">
            <h3>{{ __('User Name', 'wedevs-project-manager') }}</h3>
            <span class="user-name">{{ ucfirst( user.display_name ) }}</span>
        </div>

        <div class="pm-card pm-card-default pm-report-meta-panel pm-report-worker-panel">
            <div class="pm-report-panel-icon"><i class="flaticon-resume"></i></div>

            <div class="user-meta-data-wrap" v-for="(meta, user_id) in reports.meta">
                <div class="meta-item">
                    <div class="label">
                        {{ __( 'Total Estimation Hours' ) }}
                    </div>

                    <div class="value">
                        {{ meta.total_estimation_tf }}
                    </div>
                </div>

                <div class="meta-item">
                    <div class="label">
                        {{ __( 'Completed Task Count' ) }}
                    </div>

                    <div class="value">
                        {{ meta.completed_tasks }}
                    </div>
                </div>

                <div class="meta-item">
                    <div class="label">
                        {{ __( 'Avg. Hour Per-task' ) }}
                    </div>

                    <div class="value">
                        {{ meta.avg_hour_task_tf }}
                    </div>
                </div>

                <div class="meta-item">
                    <div class="label">
                        {{ __( 'Avg. Work Hour Per-day' ) }}
                    </div>

                    <div class="value">
                        {{ meta.avg_work_hour_tf }}
                    </div>
                </div>

                <div class="meta-item">
                    <div class="label">
                        {{ __( 'Avg. Task Per-day' ) }}
                    </div>

                    <div class="value">
                        {{ meta.avg_task_day }}
                    </div>
                </div>
            </div>

        </div>


        <div v-if="grapVisibility" class="graph-wrap" style="width: 100%;">


            <div style="width: 33.333333%; padding-right: 10px;">
                <div class="pm-pro-graph-wrap" style="width: 100%;">
                    <h3>{{ __('All Projects', 'wedevs-project-manager') }}</h3>
                    <canvas v-user-report-projects-estimation width="100%" class="canvas"></canvas>
                </div>
            </div>

            <div style="width: 33.333333%; padding-right: 10px;">
                <div class="pm-pro-graph-wrap" style="width: 100%;">
                    <h3>{{ __('Task Types', 'wedevs-project-manager') }}</h3>
                    <canvas v-user-report-task-type-estimation width="100%" class="canvas"></canvas>
                </div>
            </div>

            <div style="width: 33.333333%;">
                <div class="pm-pro-graph-wrap" style="width: 100%;">
                    <h3>{{ __('Subtask Types', 'wedevs-project-manager') }}</h3>
                    <canvas v-user-report-sub-task-type-estimation width="100%" class="canvas"></canvas>
                </div>
            </div>
        </div>


        <div class="table-wrap">
            <h3 style="margin-top: 0;" v-if="reports.report_for == 'task'">{{ __('Tasks', 'wedevs-project-manager') }}</h3>
            <h3 style="margin-top: 0;" v-if="reports.report_for == 'sub_task'" >
                {{ __('Subtasks', 'wedevs-project-manager') }}
                <i v-tooltip:top-center="__( 'Please add <mark>Estimation time</mark> for sub tasks to get the list !', 'wedevs-project-manager')" class="info-icon">
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.577 111.577" style="enable-background:new 0 0 111.577 111.577;" xml:space="preserve"> <g> <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/> </g></svg>
                </i>
            </h3>

            <template v-for="(taskItems, user_id) in reports.tasks.data">

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __('Completed At', 'wedevs-project-manager') }}</th>
                        <th class="task-title">{{ __('Task Title', 'wedevs-project-manager') }}</th>
                        <th class="task-title" v-if="reports.report_for == 'sub_task'">{{ __('Subtask Title', 'wedevs-project-manager') }}</th>
                        <th class="project">{{ __('Project', 'wedevs-project-manager') }}</th>
                        <th class="type">{{ __('Type', 'wedevs-project-manager') }}</th>
                        <th class="hour">{{ __('Hour', 'wedevs-project-manager') }}</th>
                    </thead>
                    <tbody>

                        <template  v-for="(task, user_id) in taskItems.data">
                            <tr>
                                <td>{{ task.completed_at.date }}</td>

                                <td v-if="reports.report_for == 'sub_task'">
                                     {{ task.task ? task.task.data ? task.task.data.title : '--' : '--' }}
                                </td>
                                <td>{{ task.title }}</td>

                                <td>{{ task.project_title }}</td>
                                <td>{{ task.type.title ? task.type.title : '--' }}</td>
                                <td>{{ task.estimation_tf }}</td>
                            </tr>
                        </template>

                        <tr>
                            <td colspan="5" v-if="reports.report_for == 'sub_task'">{{ __( 'Total' ) }}</td>
                            <td colspan="4" v-if="reports.report_for == 'task'">{{ __( 'Total' ) }}</td>
                            <td>{{ reports.tasks.meta.total_hours_tf }}</td>
                        </tr>

                    </tbody>
                </table>

            </template>

            <h1 v-if="hasResults()">{{ __('No result found!', 'wedevs-project-manager') }}</h1>
        </div>

        <div class="table-wrap">
            <h3>{{ __('Projects', 'wedevs-project-manager') }}</h3>
            <template v-for="(projectItems, user_id) in reports.projects.data">

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __('Project Name', 'wedevs-project-manager') }}</th>
                        <th
                            class="task-title"
                            v-if="reports.report_for=='task'">
                            {{ __('Task', 'wedevs-project-manager') }}
                        </th>
                        <th
                            class="task-title"
                            v-if="reports.report_for=='sub_task'">
                            {{ __('Subtask', 'wedevs-project-manager') }}
                        </th>
                        <th class="project">{{ __('Est. Hour', 'wedevs-project-manager') }}</th>
                    </thead>
                    <tbody>

                        <template  v-for="(project, user_id) in filterNullEstProject( projectItems.data )">
                            <tr>
                                <td>{{ project.project.title }}</td>

                                <td v-if="reports.report_for=='sub_task'">{{ project.completed_sub_tasks }}</td>
                                <td v-if="reports.report_for=='task'">{{ project.completed_tasks }}</td>

                                <td v-if="reports.report_for=='task'">{{ project.estimated_task_hours_tf }}</td>
                                <td v-if="reports.report_for=='sub_task'">{{ project.estimated_sub_task_hours_tf }}</td>

                            </tr>
                        </template>

                            <tr>
                                <td>{{ __( 'Total' ) }}</td>

                                <td v-if="reports.report_for=='sub_task'">{{ reports.projects.meta.total_sub_tasks }}</td>
                                <td v-if="reports.report_for=='task'">{{ reports.projects.meta.total_tasks }}</td>

                                <td v-if="reports.report_for=='task'">{{ reports.projects.meta.total_task_estimation_tf }}</td>
                                <td v-if="reports.report_for=='sub_task'">{{ reports.projects.meta.total_sub_task_estimation_tf }}</td>

                            </tr>

                    </tbody>
                </table>

            </template>

            <h1 v-if="hasResults()">{{ __('No result found!', 'wedevs-project-manager') }}</h1>
        </div>

        <div class="table-wrap">
            <h3>{{ __('Task type', 'wedevs-project-manager') }}</h3>
            <template v-for="(items, user_id) in reports.task_types.data">

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __('Task Type', 'wedevs-project-manager') }}</th>
                        <th class="task-title">{{ __('Task', 'wedevs-project-manager') }}</th>
                        <th class="project">{{ __('Est. Hour', 'wedevs-project-manager') }}</th>
                    </thead>
                    <tbody>

                        <template  v-for="(type, index) in items.data">

                            <tr>
                                <td>{{ type.type.title }}</td>
                                <td>{{ type.completed }}</td>
                                <td>{{ type.estimated_hours_tf }}</td>
                            </tr>
                        </template>

                        <tr>
                            <td>{{ __( 'Total' ) }}</td>
                            <td>{{ reports.task_types.meta.total_tasks }}</td>
                            <td>{{ reports.task_types.meta.total_estimation_tf }}</td>
                        </tr>

                    </tbody>
                </table>

            </template>

            <h1 v-if="hasResults()">{{ __('No result found!', 'wedevs-project-manager') }}</h1>
        </div>

        <div>
            <h3>{{ __('Subtask type', 'wedevs-project-manager') }}</h3>
            <div v-for="(items, user_id) in reports.sub_task_types.data">

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __('Subtask Type', 'wedevs-project-manager') }}</th>
                        <th class="task-title">{{ __('Subtask', 'wedevs-project-manager') }}</th>
                        <th class="project">{{ __('Est. Hour', 'wedevs-project-manager') }}</th>
                    </thead>
                    <tbody>

                        <template  v-for="(type, user_id) in items.data">
                            <tr>
                                <td>{{ type.type.title }}</td>
                                <td>{{ type.completed }}</td>
                                <td>{{ type.estimated_hours_tf }}</td>
                            </tr>
                        </template>

                        <tr>
                            <td>{{ __( 'Total' ) }}</td>
                            <td>{{ reports.sub_task_types.meta.total_sub_tasks }}</td>
                            <td>{{ reports.sub_task_types.meta.total_estimation_tf }}</td>
                        </tr>

                    </tbody>
                </table>

            </div>

            <h1 v-if="hasResults()">{{ __('No result found!', 'wedevs-project-manager') }}</h1>
        </div>
    </div>
</template>

<style lang="less">
    .pm-pro-graph-wrap {
        background: #fff;
        margin-right: 10px;
        padding: 0 10px 10px 10px;
        margin-bottom: 1em;
        border: 1px solid #e5e5e5;

        &:last-child {
            margin-right: 0;
        }
    }
    .user-reports-wrap {
        .table-wrap {
            margin-bottom: 1em;
        }

        .pm-report-worker-panel {
            margin-bottom: 1em;
        }

        .graph-wrap {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            width: 100%;
            margin-bottom: .5em;

            .canvas {
                width: 33.33%;
                height: 400px;
            }
        }

        .user-meta-data-wrap {
            display: flex;
            align-items: center;
            flex-wrap: wrap;

            .meta-item {
                display: flex;
                align-items: center;
                padding: 10px 10px 10px 0;

                &:last-child {
                    padding-right: 0;
                }

                .label {
                    background: #3797a4;
                    padding: 0 5px;
                    color: #f9f9f9;
                    font-size: 12px;
                }

                .value {
                    background: #8ccbbe;
                    color: #555;
                    padding: 0 10px;
                    font-size: 12px;
                }
            }
        }

        .user-wrap {
            display: flex;
            align-items: center;

            .user-name {
                margin-left: 12px;
                background: #fff;
                border: 1px solid #E5E5E5;
                padding: 2px 10px;
            }
        }

        .title {
            width: 50%;
        }

        .working-hour, .estimated-hour {
            width: 25%;
        }

        .info-icon {
            padding: 0 6px;
            svg {
                height: 10px !important;
                width: 10px !important;
                fill: #858587;
            }
        }
    }
</style>

<script>
    /**
     * Required jQuery methods
     *
     * @type Object
     */
    var userReportsProjectsEstimation = {
        chart: function(el, binding, vnode) {
            var data = {
                labels: userReportsProjectsEstimation.getLabels(vnode.context),
                datasets: [
                    {
                        label: __('Est. Hours', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#f77726",
                        strokeColor: "#f77726",
                        pointColor: "#f77726",
                        pointStrokeColor: "#f77726",
                        pointHighlightFill: "#f77726",
                        pointHighlightStroke: "#f77726",
                        data: userReportsProjectsEstimation.getEstimatedHours(vnode.context),
                        backgroundColor: "#f77726",
                    },
                    {
                        label: vnode.context.reports.report_for == 'task' ? __('Completed Tasks', 'wedevs-project-manager') : __('Completed Subtasks', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#4bc0c0",
                        strokeColor: "#4bc0c0",
                        pointColor: "#4bc0c0",
                        pointStrokeColor: "#4bc0c0",
                        pointHighlightFill: "#4bc0c0",
                        pointHighlightStroke: "#4bc0c0",
                        data: userReportsProjectsEstimation.getCompletedTasks(vnode.context),
                        backgroundColor: "#4bc0c0",
                    }
                ]
            };

            Chart.defaults.responsive = true;
            var ctx = el.getContext("2d");
            // This will get the first returned node in the jQuery collection.

            // Destroy if canvas is already used.
            if ( window.pmMTUserReportProjectEst instanceof Chart ) window.pmMTUserReportProjectEst.destroy();

            window.pmMTUserReportProjectEst = new pm.Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                min: 0,
                                //stepSize: userReportsProjectsEstimation.getStepSize(vnode.context)
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        },

                        x: {
                            // Change here
                            barPercentage: 0.5
                        }
                    },

                    plugins: {
                        datalabels: {

                            anchor: function(context) {
                                return 'end';
                            },
                            align: function(context) {
                                return 'center';
                            },
                            backgroundColor: function(context) {
                                return context.dataset.backgroundColor;
                            },
                            borderColor: 'white',
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function(context) {
                                return 'white';
                            },
                            font: {
                                weight: 'normal'
                            },
                            formatter: Math.round
                        }
                    }
                },
                animationSteps: 60,
                tooltipTemplate: "<%= labels + sss %>%" ,
                animationEasing: "easeOutQuart"
            });

        },

        getLabels (self) {
            var labels = [];
            jQuery.each(self.reports.projects.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {

                    //Checking has estimation hour
                    if ( report.meta.report_for == 'tasks' ) {
                        if( parseFloat(data.estimated_task_hours) > 0 ) {
                            labels.push(data.project.title.replace(/ .*/,''));
                        }
                    } else {
                        if( parseFloat(data.estimated_sub_task_hours) > 0 ) {
                            labels.push(data.project.title.replace(/ .*/,''));
                        }
                    }

                });
            });

            return labels;
        },

        getCompletedTasks (self) {
            var completedTasks = [];

            jQuery.each(self.reports.projects.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {

                    //Checking has estimation hour
                    if ( report.meta.report_for == 'tasks' ) {
                        if( parseFloat(data.estimated_task_hours) > 0 ) {
                            completedTasks.push( data.completed_tasks );
                        }
                    } else {
                        if( parseFloat(data.estimated_sub_task_hours) > 0 ) {
                            completedTasks.push( data.completed_sub_tasks );
                        }
                    }
                });
            });

            return completedTasks;
        },

        getEstimatedHours (self) {
            var estimatedHours = [];

            jQuery.each(self.reports.projects.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {

                    //Checking has estimation hour
                    if ( report.meta.report_for == 'tasks' ) {
                        if( parseFloat(data.estimated_task_hours) > 0 ) {
                            estimatedHours.push( data.estimated_task_hours );
                        }
                    } else {
                        if( parseFloat(data.estimated_sub_task_hours) > 0 ) {
                            estimatedHours.push( data.estimated_sub_task_hours );
                        }
                    }

                });
            });

            return estimatedHours;
        }

    }

    // Register a global custom directive called v-pm-sortable
    pm.Vue.directive('user-report-projects-estimation', {
        inserted: function (el, binding, vnode) {
            userReportsProjectsEstimation.chart(el, binding, vnode);
        },

        // update: function (el, binding, vnode) {
        //     userReportsProjectsEstimation.chart(el, binding, vnode);
        // }
    });


        /**
     * Required jQuery methods
     *
     * @type Object
     */
    var userReportTaskTypeEstimation = {
        chart: function(el, binding, vnode) {
            var data = {
                labels: userReportTaskTypeEstimation.getLabels(vnode.context),
                datasets: [
                    {
                        label: __('Est. Hours', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#f77726",
                        strokeColor: "#f77726",
                        pointColor: "#f77726",
                        pointStrokeColor: "#f77726",
                        pointHighlightFill: "#f77726",
                        pointHighlightStroke: "#f77726",
                        data: userReportTaskTypeEstimation.getEstimatedHours(vnode.context),
                        backgroundColor: "#f77726",
                    },
                    {
                        label: __('Completed Tasks', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#4bc0c0",
                        strokeColor: "#4bc0c0",
                        pointColor: "#4bc0c0",
                        pointStrokeColor: "#4bc0c0",
                        pointHighlightFill: "#4bc0c0",
                        pointHighlightStroke: "#4bc0c0",
                        data: userReportTaskTypeEstimation.getCompletedTasks(vnode.context),
                        backgroundColor: "#4bc0c0",
                    }
                ]
            };

            Chart.defaults.responsive = true;
            var ctx = el.getContext("2d");
            // This will get the first returned node in the jQuery collection.

            // Destroy if canvas is already used.
            if ( window.pmMTUserReportTaskTypeEst instanceof Chart ) window.pmMTUserReportTaskTypeEst.destroy();

            window.pmMTUserReportTaskTypeEst = new pm.Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            ticks: {
                                min: 0,
                                //stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        },

                        x: {
                            // Change here
                            barPercentage: 0.5
                        }
                    },

                    plugins: {
                        datalabels: {

                            anchor: function(context) {
                                return 'end';
                            },
                            align: function(context) {
                                return 'center';
                            },
                            backgroundColor: function(context) {
                                return context.dataset.backgroundColor;
                            },
                            borderColor: 'white',
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function(context) {
                                return 'white';
                            },
                            font: {
                                weight: 'normal'
                            },
                            formatter: Math.round
                        }
                    }
                },
                pointDotRadius : 8,
                animationSteps: 60,
                tooltipTemplate: "<%= labels + sss %>%" ,
                animationEasing: "easeOutQuart"
            });

        },

        getLabels (self) {
            var labels = [];

            jQuery.each(self.reports.task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    labels.push(data.type.title);
                });
            });

            return labels;
        },

        getCompletedTasks (self) {
            var completedTasks = [];

            jQuery.each(self.reports.task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    completedTasks.push( data.completed );
                });
            });

            return completedTasks;
        },

        getEstimatedHours (self) {
            var estimatedHours = [];

            jQuery.each(self.reports.task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    estimatedHours.push( data.estimated_hours );
                });
            });

            return estimatedHours;
        }

    }


    // Register a global custom directive called v-pm-sortable
    pm.Vue.directive('user-report-task-type-estimation', {
        inserted: function (el, binding, vnode) {
            userReportTaskTypeEstimation.chart(el, binding, vnode);
        },

        // update: function (el, binding, vnode) {
        //     userReportTaskTypeEstimation.chart(el, binding, vnode);
        // }
    });


    /**
     * Required jQuery methods
     *
     * @type Object
     */
    var userReportSubTaskTypeEstimation = {
        chart: function(el, binding, vnode) {
            var data = {
                labels: userReportSubTaskTypeEstimation.getLabels(vnode.context),
                datasets: [
                    {
                        label: __('Est. Hours', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#f77726",
                        strokeColor: "#f77726",
                        pointColor: "#f77726",
                        pointStrokeColor: "#f77726",
                        pointHighlightFill: "#f77726",
                        pointHighlightStroke: "#f77726",
                        data: userReportSubTaskTypeEstimation.getEstimatedHours(vnode.context),
                        backgroundColor: "#f77726",
                    },
                    {
                        label: __('Completed Subtasks', 'wedevs-project-manager'),
                        borderWidth: 1,
                        fillColor: "#4bc0c0",
                        strokeColor: "#4bc0c0",
                        pointColor: "#4bc0c0",
                        pointStrokeColor: "#4bc0c0",
                        pointHighlightFill: "#4bc0c0",
                        pointHighlightStroke: "#4bc0c0",
                        data: userReportSubTaskTypeEstimation.getCompletedTasks(vnode.context),
                        backgroundColor: "#4bc0c0",
                    }
                ]
            };

            Chart.defaults.responsive = true;
            var ctx = el.getContext("2d");
            // This will get the first returned node in the jQuery collection.

            // Destroy if canvas is already used.
            if ( window.pmMTUserReportSubtaskTypeEst instanceof Chart ) window.pmMTUserReportSubtaskTypeEst.destroy();

            window.pmMTUserReportSubtaskTypeEst = new pm.Chart(ctx, {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            ticks: {
                                min: 0,
                                //stepSize: 1
                            },
                            scaleLabel: {
                                display: true,
                                labelString: ''
                            }
                        },

                        x: {
                            // Change here
                            barPercentage: 0.5
                        }
                    },
                    plugins: {
                        datalabels: {

                            anchor: function(context) {
                                return 'end';
                            },
                            align: function(context) {
                                return 'center';
                            },
                            backgroundColor: function(context) {
                                return context.dataset.backgroundColor;
                            },
                            borderColor: 'white',
                            borderRadius: 25,
                            borderWidth: 2,
                            color: function(context) {
                                return 'white';
                            },
                            font: {
                                weight: 'normal'
                            },
                            formatter: Math.round
                        }
                    }
                },
                pointDotRadius : 8,
                animationSteps: 60,
                tooltipTemplate: "<%= labels + sss %>%" ,
                animationEasing: "easeOutQuart"
            });

        },

        getLabels (self) {
            var labels = [];

            jQuery.each(self.reports.sub_task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    labels.push(data.type.title);
                });
            });

            return labels;
        },

        getCompletedTasks (self) {
            var completedTasks = [];

            jQuery.each(self.reports.sub_task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    completedTasks.push( data.completed );
                });
            });

            return completedTasks;
        },

        getEstimatedHours (self) {
            var estimatedHours = [];

            jQuery.each(self.reports.sub_task_types.data, function(key, report) {
                jQuery.each(report.data, function(key2, data) {
                    estimatedHours.push( data.estimated_hours );
                });
            });

            return estimatedHours;
        }

    }

    // Register a global custom directive called v-pm-sortable
    pm.Vue.directive('user-report-sub-task-type-estimation', {
        inserted: function (el, binding, vnode) {
            userReportSubTaskTypeEstimation.chart(el, binding, vnode);
        },

        // update: function (el, binding, vnode) {
        //     userReportSubTaskTypeEstimation.chart(el, binding, vnode);
        // }
    });


    export default {
        props: {
            reports: {
                type: [Object, Array],
                default () {
                    return {}
                }
            }
        },

        data () {
            return {
                grapVisibility: true
            }
        },

        watch: {
            reports: {
                handler (recent, old) {
                    this.grapVisibility = false;

                    setTimeout( () => {
                        this.grapVisibility = true;
                    }, 100 );
                },

                deep: true
            }
        },

        created () {
            this.getUsers();
        },

        computed: {
            users () {
                return this.$store.state.timeTracker.users
            }
        },

        methods: {
            hasResults () {
                return false;

            },

            hasLength (obj) {
                if(jQuery.isEmptyObject(obj)) {
                    return false;
                }
                return true;
            },

            secondToTime(second) {
               let time = this.secondsToHms(second);

               return time.hour+':'+time.minute;
            },

            timeGenerate(h,m) {
                let seconds = (parseInt(h)*3600)+(parseInt(m)*60);
                let time = this.secondsToHms(seconds);

                return time.hour+':'+time.minute+':'+time.second;
            },

            getUserName (user_id) {
                user_id = String(user_id);
                let index = this.getIndex( this.users, user_id, 'user_id' );

                if(index === false) {
                    return '';
                }
                return this.users[index].display_name;
            },

            filterNullEstProject ( project ) {
                var self = this;
                var filtered = [];

                jQuery.each(project, function(key, data) {

                    //Checking has estimation hour
                    if ( self.reports.report_for == 'tasks' ) {
                        if( parseFloat(data.estimated_task_hours) > 0 ) {
                            filtered.push( data );
                        }
                    } else {
                        if( parseFloat(data.estimated_sub_task_hours) > 0 ) {
                            filtered.push( data);
                        }
                    }
                });

                return filtered;
            },

            filterNullEstTaskType (  ) {

            }
        }
    }

</script>
