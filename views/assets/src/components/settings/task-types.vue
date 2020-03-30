<template>
    <div v-if="isFetchTaskTypes" class="pm-wrap pm-pro-task-type pm-front-end">
        <div>
            <div v-if="taskTypes.length">
                <a 
                    href="#" 
                    @click.prevent="setActiveForm()"
                    class="pm-create-type pm-button pm-primary">

                    {{ __('+ Create New Task Type', 'pm') }}
                </a>
                <div class="pm-clearfix"></div>
            </div>
            <div v-if="isTaskTypeFormVisible()" class="new-type-form">
                <new-task-type-form :taskType="type" :formVisibility="formAction"></new-task-type-form>
            </div>

            <div v-if="taskTypes.length" class="display-table-wrap">
                <table class="pm-table table-striped table-justified">
                    <thead>
                        <tr>
                            <th class="th-title">{{ __('Name', 'pm-pro') }}</th>
                            <th class="th-title">{{ __('Description', 'pm-pro') }}</th>
                            <th class="th-title">{{ __('Action', 'pm-pro') }}</th>
                        </tr>
                    </thead>

                    <tbody>
                        <template v-for="type in taskTypes">
                            <task-type-item :taskType="type"></task-type-item>
                        </template>
                    </tbody>

                </table>
            </div>

        </div>
    </div>
</template>



<script>
    import NewLabelForm from './new-task-type-form.vue'
    import taskTypeItem from './task-type-item.vue'
    
    export default {

        data () {
            return {
                spinner: false,
                isFetchTaskTypes: false,
                formAction: {
                    isClickNewForm: false,
                },

                type: {
                    title: '',
                    description: ''
                },
            }
        },
        components: {
            'new-task-type-form': NewLabelForm,
            'task-type-item': taskTypeItem
        },
        created () {
            this.getTaskTypes();
        },

        computed: {
            taskTypes () {
                return this.$store.state.settings.taskTypes;
            }
        },

        methods: {
            setActiveForm () {
                this.formAction.isClickNewForm = this.formAction.isClickNewForm ? false : true;
            },

            isTaskTypeFormVisible () {
                let status = true;

                if ( this.taskTypes.length ) {
                    status = false;
                }

                if ( this.formAction.isClickNewForm ) {
                    status = true;
                }

                return status;
            },

            getTaskTypes () {
                var self = this;
    
                var request = {
                    type: 'GET',
                    url: self.base_url + 'pm/v2/settings/task-types',
                    success (res) {
                        self.isFetchTaskTypes = true;
                        self.$store.commit( 'settings/setTaskTypes', res.data );
                        pm.NProgress.done();
                    }
                };

                self.httpRequest(request);
            },

            edit (type) {
                type.editMode = true;
            },



            setLabelAfterFetchProject (project) {
                this.setTypes(project);
            },

            setLabelFromSotre () {
                if( typeof this.$store.state.project.types === 'undefined') {
                    return;
                }
                this.setTypes(this.$store.state.project);
            },

            setTypes (project) {
                //var self = this;

                // project.types.data.forEach(function(type) {
                //     var newLabel = jQuery.extend( {}, type );
                //     pm.Vue.set(newLabel, 'editMode', false);
                //     self.taskTypes.push(newLabel);
                // });
                this.isFetchLabel = true;
            },
        }
    }
</script>

<style lang="less">
    .pm-pro-task-type {
        .pm-table thead tr {
            box-shadow: none !important;
        }
        .display-table-wrap {

        }
        .pm-create-type {
            float: right;
            margin-top: 5px !important;
        }
        .display-table-wrap {
            margin-top: 17px;
            font-size: 13px;
            border: 1px solid #eee;
            border-bottom: none;
            .th-title {
                font-weight: 500;
            }
            tbody {
                td {
                    padding: 10px 16px;
                }
            }
            .tr-wrap {
                .color-attribute {
                    display: inline-flex;
                    align-items: center;
                    justify-content: space-between;
                    .color-box {
                        margin-right: 10px;
                        height: 12px;
                        width: 12px;
                    }
                }
                &:hover {
                    .action-td {
                        .action-wrap {
                            position: static;
                        }
                    }
                }
                .action-td {
                    .title {
                        border-radius: 2px;
                        box-shadow: inset 0 -1px 0 rgba(27, 31, 35, 0.12);
                        padding: .3em 10px;
                        color: #fff;
                        white-space: nowrap;
                        font-weight: 400;
                        font-size: 12px;
                        display: inline-block;
                    }
                    .action-wrap {
                        position: relative;
                        left: -9999em;
                        padding-top: 2px;
                        color: #37aedf;
                        font-size: 12px;
                        font-weight: 400;
                        .pipe {
                            color: #ddd;
                        }
                    }
                }
            }

        }
        .new-type-form {

            .type-form {
                display: inline-flex;
                align-items: flex-end;
                justify-content: space-between;
                width: 100%;

                .form-group-wrap {
                    display: flex;

                    .form-control-color-picker {
                        position: relative;
                        z-index: 9;
                        .color-picker-container {
                            position: absolute;
                        }
                    }

                    .form-control {
                        background-color: #fff;
                        background-position: right 8px center;
                        background-repeat: no-repeat;
                        border: 1px solid #d1d5da;
                        border-radius: 3px;
                        box-shadow: inset 0 1px 2px rgba(27,31,35,.075);
                        color: #24292e;
                        line-height: 20px;
                        outline: none;
                        padding: 6px 8px;
                        vertical-align: middle;
                        font-size: 11px;

                        &:focus {
                            border-color: #2188ff;
                            box-shadow: inset 0 1px 2px rgba(27,31,35,.075), 0 0 0 0.2em rgba(3,102,214,.3);
                            outline: none;
                        };
                    }
                    .form-group {
                        margin-right: 10px;
                        .description-control {
                            width: 230px;
                        }
                    }
                    .type-wrap {
                        margin: 0 0 6px;
                        font-size: 13px;
                    }
                }
            }
        }
    }

</style>


