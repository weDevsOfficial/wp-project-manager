<template>
    <div class="pm-wrap pm-pro-task-label pm-front-end" id="project-settings">
        <div>
            <div v-if="isFormShow()">
                <a href="#" @click.prevent="showForm()" class="pm-create-label pm-button pm-primary">
                    {{ __( '+ Create label', 'wedevs-project-manager' ) }}
                </a>
                <div class="pm-clearfix"></div>
            </div>
            <div v-else class="new-label-form">
                <new-task-label-form :formAction="formAction" :taskLabels="taskLabels"></new-task-label-form>
            </div>
            <div v-if="labels.length" class="display-table-wrap">
                <table class="pm-table table-striped table-justified">
                    <thead>
                        <tr>
                            <th class="th-title">{{ __( 'Name', 'wedevs-project-manager' ) }}</th>
                            <th class="th-title">{{ __( 'Description', 'wedevs-project-manager' ) }}</th>
                            <th class="th-title">{{ __( 'Action', 'wedevs-project-manager' ) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(label, index) in labels">
                            <tr class="tr-wrap" v-if="!label.editMode" :key="label.id">
                                <td class="action-td">
                                    <div class="title" :style="'background:' + label.color ">{{ label.title }}</div>
                                </td>
                                <td>{{ label.description }}</td>
                                <td>
                                    <div class="action-wrap">
                                        <span><a @click.prevent="edit(label, index)" href="#">{{ __( 'Edit', 'wedevs-project-manager' ) }}</a></span>
                                        <span class="pipe">|</span>
                                        <span><a @click.prevent="selfRemove(label, index)" href="#">{{ __( 'Delete', 'wedevs-project-manager' ) }}</a></span>
                                    </div>
                                </td>
                            </tr>
                            <tr class="tr-wrap" v-if="label.editMode" :key="label.id">
                                <td colspan="3">
                                    <div class="new-label-form">
                                        <new-task-label-form :taskSingleLabel="label"></new-task-label-form>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<style lang="less">
    .pm-pro-task-label {
        .pm-table thead tr {
            box-shadow: none !important;
        }
        .display-table-wrap {

        }
        .pm-create-label {
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
        .new-label-form {

            .label-form {
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
                    .label-wrap {
                        margin: 0 0 6px;
                        font-size: 13px;
                    }
                }
            }
        }
    }

</style>

<script>
    import NewLabelForm from './create-task-label-form.vue'
    export default {

        data () {
            return {
                spinner: false,
                isFetchLabel: false,
                formAction: {
                    isClickNewForm: false,
                },

                label: {
                    color: '#00c2e0',
                    title: '',
                    description: ''
                },
                //taskLabels: []
                labels: []
            }
        },
        components: {
            'new-task-label-form': NewLabelForm
        },
        created () {
            pmBus.$on('pm_after_fetch_project', this.setLabelAfterFetchProject);
            this.setLabelFromSotre();
        },

        computed: {
            taskLabels () {
                var self = this;
                var project = this.$store.state.project;

                if( typeof project.labels === 'undefined') {
                    return [];
                }

                project.labels.data.forEach( function( label ) {
                    pm.Vue.set( label, 'editMode', false );
                });

                this.isFetchLabel = true;

                this.labels = [ ...project.labels.data ];

                return project.labels.data;
            }
        },

        methods: {
            showForm () {
                this.formAction.isClickNewForm = this.formAction.isClickNewForm ? false : true;
            },

            isFormShow () {
                if( this.labels.length && !this.formAction.isClickNewForm ) {
                    return true;
                }

                return false;
            },

            initialFormShowStatus () {
                if ( this.labels.length ) {
                    return false
                }
                return true;
            },

            edit ( label, index ) {
                label.editMode = true;
            },

            selfRemove ( label, labelIndex ) {
                if( !confirm(__('Are you sure!', 'wedevs-project-manager') ) ) {
                    return false;
                }
                var self = this;
                var args = {
                    data: {

                    },
                    labelId: label.id,
                    callback ( res ) {
                        let index = self.getIndex( self.labels, label.id, 'id' );

                        if( index !== false ) {
                            //self.labels.splice(index, 1);
                            self.$store.commit('proProSettings/removeLabel', {
                                'label_id'   : label.id,
                                'project_id' : self.project_id,
                            });

                            self.labels.splice( labelIndex, 1 );
                        }
                    }
                }

                this.remove( args );
            },

            remove ( args ) {
                const self  = this,
                    request = {
                    url  : self.base_url + 'pm-pro/v2/projects/' + self.project_id + '/settings/labels/' + args.labelId + '/delete',
                    data : args.data,
                    type : 'POST',
                    success ( res ) {
                        if( typeof args.callback === 'function' ) {
                            args.callback( res );
                        }
                    }
                };

                self.httpRequest( request );
            },

            setLabelAfterFetchProject (project) {
                this.setLabels(project);
            },

            setLabelFromSotre () {
                if ( typeof this.$store.state.project.labels === 'undefined' ) {
                    return;
                }

                this.setLabels( this.$store.state.project );
            },

            setLabels (project) {
                this.isFetchLabel = true;
            },
        }
    }
</script>
