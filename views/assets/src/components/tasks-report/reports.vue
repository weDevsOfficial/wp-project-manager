<template>
    <div class="pm-pro-my-task-reports">
        <div class="date-range">
            <div class="date-range">
                <label>{{ __( 'Date', 'wedevs-project-manager' ) }}</label>
                <input type="text" value="11/01/2022 - 11/30/2022" />
            </div>
        </div>
        <div class="clearfix" />

        <div class="user-reports-wrap">
            <div class="user-wrap">
                <h3>{{ __( 'User Name', 'wedevs-project-manager' ) }}</h3>
                <span class="user-name">{{ __( 'Nadim', 'wedevs-project-manager' ) }}</span>
            </div>

            <div class="pm-card pm-card-default pm-report-meta-panel pm-report-worker-panel">
                <div class="pm-report-panel-icon"><i class="flaticon-resume"></i></div>

                <div class="user-meta-data-wrap">
                    <div class="meta-item">
                        <div class="label">{{ __( 'Total Estimation Hours', 'wedevs-project-manager' ) }}</div>
                        <div class="value">00:00</div>
                    </div>
                    <div class="meta-item">
                        <div class="label">{{ __( 'Completed Task Count', 'wedevs-project-manager' ) }}</div>
                        <div class="value">0</div>
                    </div>
                    <div class="meta-item">
                        <div class="label">{{ __( 'Avg. Hour Per-task', 'wedevs-project-manager' ) }}</div>
                        <div class="value">00:00</div>
                    </div>
                    <div class="meta-item">
                        <div class="label">{{ __( 'Avg. Work Hour Per-day', 'wedevs-project-manager' ) }}</div>
                        <div class="value">00:00</div>
                    </div>
                    <div class="meta-item">
                        <div class="label">{{ __( 'Avg. Task Per-day', 'wedevs-project-manager' ) }}</div>
                        <div class="value">0</div>
                    </div>
                </div>
            </div>


            <div class="graph-wrap" style="width: 100%;">
                <div style="width: 33.333333%; padding-right: 10px;">
                    <div class="pm-pro-graph-wrap" style="width: 100%;">
                        <h3>{{ __( 'All Projects', 'wedevs-project-manager' ) }}</h3>
                        <img class="canvas" style="display: block; box-sizing: border-box; width: 385px; height: 189px;"
                          :src="getAssetUrl( 'images/chart.png' )" :alt="__( 'Canvas Image', 'wedevs-project-manager' )" />
                    </div>
                </div>

                <div style="width: 33.333333%; padding-right: 10px;">
                    <div class="pm-pro-graph-wrap" style="width: 100%;">
                        <h3>{{ __( 'Task Types', 'wedevs-project-manager' ) }}</h3>
                        <img class="canvas" style="display: block; box-sizing: border-box; width: 385px; height: 189px;"
                          :src="getAssetUrl( 'images/chart.png' )" :alt="__( 'Canvas Image', 'wedevs-project-manager' )" />
                    </div>
                </div>

                <div style="width: 33.333333%;">
                    <div class="pm-pro-graph-wrap" style="width: 100%;">
                        <h3>{{ __( 'Subtask Types', 'wedevs-project-manager' ) }}</h3>
                        <img class="canvas" style="display: block; box-sizing: border-box; width: 385px; height: 189px;"
                          :src="getAssetUrl( 'images/chart.png' )" :alt="__( 'Canvas Image', 'wedevs-project-manager' )" />
                    </div>
                </div>
            </div>

            <div class="table-wrap">
                <h3 style="margin-top: 0;" >
                    {{ __( 'Subtasks', 'wedevs-project-manager' ) }}
                    <i v-tooltip:top-center="__( 'Please add <mark>Estimation time</mark> for sub tasks to get the list !', 'wedevs-project-manager')" class="info-icon">
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" style="enable-background:new 0 0 111.577 111.577;"
                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.577 111.577"xml:space="preserve">
                            <g>
                                <path d="M78.962,99.536l-1.559,6.373c-4.677,1.846-8.413,3.251-11.195,4.217c-2.785,0.969-6.021,1.451-9.708,1.451 c-5.662,0-10.066-1.387-13.207-4.142c-3.141-2.766-4.712-6.271-4.712-10.523c0-1.646,0.114-3.339,0.351-5.064 c0.239-1.727,0.619-3.672,1.139-5.846l5.845-20.688c0.52-1.981,0.962-3.858,1.316-5.633c0.359-1.764,0.532-3.387,0.532-4.848 c0-2.642-0.547-4.49-1.636-5.529c-1.089-1.036-3.167-1.562-6.252-1.562c-1.511,0-3.064,0.242-4.647,0.71 c-1.59,0.47-2.949,0.924-4.09,1.346l1.563-6.378c3.829-1.559,7.489-2.894,10.99-4.002c3.501-1.111,6.809-1.667,9.938-1.667 c5.623,0,9.962,1.359,13.009,4.077c3.047,2.72,4.57,6.246,4.57,10.591c0,0.899-0.1,2.483-0.315,4.747 c-0.21,2.269-0.601,4.348-1.171,6.239l-5.82,20.605c-0.477,1.655-0.906,3.547-1.279,5.676c-0.385,2.115-0.569,3.731-0.569,4.815 c0,2.736,0.61,4.604,1.833,5.597c1.232,0.993,3.354,1.487,6.368,1.487c1.415,0,3.025-0.251,4.814-0.744 C76.854,100.348,78.155,99.915,78.962,99.536z M80.438,13.03c0,3.59-1.353,6.656-4.072,9.177c-2.712,2.53-5.98,3.796-9.803,3.796 c-3.835,0-7.111-1.266-9.854-3.796c-2.738-2.522-4.11-5.587-4.11-9.177c0-3.583,1.372-6.654,4.11-9.207 C59.447,1.274,62.729,0,66.563,0c3.822,0,7.091,1.277,9.803,3.823C79.087,6.376,80.438,9.448,80.438,13.03z"/>
                            </g>
                        </svg>
                    </i>
                </h3>

                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __( 'Completed At', 'wedevs-project-manager' ) }}</th>
                        <th class="task-title">{{ __( 'Task Title', 'wedevs-project-manager' ) }}</th>
                        <th class="task-title">{{ __( 'Subtask Title', 'wedevs-project-manager' ) }}</th>
                        <th class="project">{{ __( 'Project', 'wedevs-project-manager' ) }}</th>
                        <th class="type">{{ __( 'Type', 'wedevs-project-manager' ) }}</th>
                        <th class="hour">{{ __( 'Hour', 'wedevs-project-manager' ) }}</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5">{{ __( 'Total', 'wedevs-project-manager' ) }}</td>
                            <td>00:00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-wrap">
                <h3>{{ __( 'Projects', 'wedevs-project-manager' ) }}</h3>
            </div>

            <div class="table-wrap">
                <h3>{{ __( 'Task type', 'wedevs-project-manager' ) }}</h3>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __( 'Task type', 'wedevs-project-manager' ) }}</th>
                        <th class="task-title">
                            {{ __( 'Task', 'wedevs-project-manager' ) }}
                        </th>
                        <th class="project">{{ __( 'Est. Hour', 'wedevs-project-manager' ) }}</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ __( 'Total', 'wedevs-project-manager' ) }}</td>
                            <td>0</td>
                            <td>00:00</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="table-wrap">
                <h3>{{ __( 'Sub task type', 'wedevs-project-manager' ) }}</h3>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <th class="completed-at">{{ __( 'Sub task Type', 'wedevs-project-manager' ) }}</th>
                        <th class="task-title">{{ __( 'Subtask', 'wedevs-project-manager' ) }}</th>
                        <th class="project">{{ __( 'Est. Hour', 'wedevs-project-manager' ) }}</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ __( 'Total', 'wedevs-project-manager' ) }}</td>
                            <td>0</td>
                            <td>00:00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <UpgraderOverlay />
    </div>
</template>

<style lang="less" scoped>
    .pm-pro-my-task-reports {
        position: relative;

        &:hover {
            .pm-project-module-content-overlay {
                display: block;
            }
        }

        .date-range {
            float: right;

            input {
                width: 230px;
                padding: 18px 10px;
            }

            label {
                color: #23282d;
                font-weight: 600;
            }
        }

        .clearfix {
            &:after {
               content: "";
                clear: both;
                display: table;
            }
        }
    }
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

            .img {
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

        .working-hour,
        .estimated-hour {
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
    // import UserReportsTaskEstimation from './user-reports-task-estimation.vue'
    import UpgraderOverlay from '@components/upgrade/overlay';

    export default {
        data () {
            return {

            }
        },

        components: {
            UpgraderOverlay,
        },

        mounted: function(){
          pm.NProgress.done();
        },

        methods: {

        }
    }
</script>
