<template>
    <div class="pm-wrap pm-pro-capabilities pm-front-end" id="project-settings">
        <form @submit.prevent="saveCapabilities()" id="pm-settings" method="post">
            <table class="widefat pm-table">
                <thead>
                    <tr>
                        <th>{{ __( 'Co-worker', 'wedevs-project-manager' ) }}</th>
                        <th class="client">{{ __( 'Client', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="message"></tr>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="2">{{ __( 'Message: ', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="message">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="message">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="todo-list"></tr>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="2">{{ __( 'Todo List', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="todo-list">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="todo-list">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="todo">
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="2">{{ __( 'Todo', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="todo">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="todo">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="milestone">
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="2">{{ __( 'Milestone', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="milestone">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{  __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'Create', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="milestone">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox">
                                {{ __( 'View Private', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="files">
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th colspan="2">{{ __( 'Files', 'wedevs-project-manager' ) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="files">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'Upload or create doc', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'Upload or create doc', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                    <tr class="files">
                        <td>
                            <label>
                                <input type="checkbox" checked="checked">
                                {{ __( 'View Private files or docs', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                        <td class="client">
                            <label>
                                <input type="checkbox">
                                {{ __( 'View Private files or docs', 'wedevs-project-manager' ) }}
                            </label>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" class="submit"></td>
                    </tr>
                </tfoot>
            </table>

            <div class="pm-pro-settings-action">
                <span v-if="spinner" class="pm-spinner"></span>
                <input type="submit" class="button button-primary"  :value="__( 'Save Changes', 'wedevs-project-manager' )">
            </div>
        </form>
    </div>
</template>

<style lang="less">
    .pm-settings {
        margin-top: 10px;
    }
    #project-settings .pm-table thead,
    #project-settings .pm-table tfoot {
        background-color: #FFF;
    }

    #project-settings * {
        box-sizing: border-box;
    }

    .pm-pro-capabilities {
        table {
            thead tr th {
                font-weight: 600;
            }

            tbody tr td.client, thead tr th.client {
                text-align: left;
                transform: translate(50%, 0);
            }
        }

        .pm-pro-settings-action {
            .button-primary {
                float: right;
                margin: 28px 0 10px;
            }
        }
    }

    .pm-pro-settings {
        .pm-pro-settngs-wrap {
            position: relative;
            display: flex;
            border: 1px solid #E5E4E4;
            border-top: none;

            h2.nav-tab-wrap {
                flex: 1;
                border-bottom: none;
                padding: 0;
                margin: 0;
                background: #f1f1f1;
                border-right: 1px solid #E5E4E4;

                a {
                    float: none;
                    display: block;
                    margin: 0;
                    border: none;
                    padding: 13px;
                    background: #f1f1f1;
                    font-weight: 500;
                    border-bottom: 1px solid #E5E4E4;
                    transition-property: none;
                    transition: none;
                }

                .nav-tab-active {
                    background: #fafafa !important;
                    width: 110%;
                    color: #2e4453;
                    transition: none;
                    transition-property: none;
                }
            }

            .metabox-holder {
                padding-top: 10px;
                flex: 3;
                padding-left: 3%;
                padding-right: 10px;
                background: #fafafa;
            }
        }
    }

</style>

<script>
    export default {
        data () {
            return {
                spinner: false
            }
        },
        components: {

        },
        created () {

        },
        computed: {
            capabilities () {
                if ( typeof this.$store.state.project.capabilities == 'undefined') {
                    return false;
                }
                return this.$store.state.project.capabilities;
            },
        },
        mounted () {
            pm.NProgress.done();
        },
        methods: {

            checkPermission () {
                if ( ! this.is_manager() ) {
                    this.$router.push({
                        name: 'pm_overview',
                        params: {
                            project_id: this.project_id
                        }
                    })
                }
            },

            saveCapabilities () {
                var self = this;
                var args = {
                    'capabilities': this.capabilities,
                }

                this.spinner = true;
                this.saveSettings(args, this.project_id, function() {
                    self.spinner = false;
                });
            }
        }
    }
</script>
