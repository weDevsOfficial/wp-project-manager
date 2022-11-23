<template>
    <div class="pm-pro-single-subtask-lists">
        <div class="subtask-title pm-h2">
          {{ __( 'Subtasks', 'wedevs-project-manager' ) }}
          <Badge />
        </div>
        <ul class="pm-subtsk-sortable">
            <li class="subtask-li">
                <div class="sub-task-content">
                    <div class="subtask-move pm-sub-task-handaler">
                        <span class="icon-pm-drag-drop"></span>
                    </div>
                    <div>
                        <input :disabled="true" class="checkbox pm-pro-subtask-uncomplete" @click.prevent="" type="checkbox" />
                    </div>
                    <div class="body">
                        <div class="header-wrap">
                            <div class="title">
                                <span class="pm-pro-subtask-todo-text"> {{ __( 'Content planing', 'wedevs-project-manger' ) }} </span>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="input-area">
            <input
                ref="subTaskTitle"
                type="text"
                class="input-field"
                :maxlength="200"
                :placeholder="__( 'Add new subtask (character limit 200)', 'wedevs-project-manager' )"
                @keypress.prevent=""
            />
        </div>
        <UpgraderOverlay />
    </div>
</template>

<style lang="less">
    .pm-pro-single-subtask-lists {
        position: relative;

        .pm-ui-state-highlight {
            background: none !important;
            border: 1px dashed #d7dee2 !important;
            min-height: 30px !important;
            margin: 0 21px 10px 3px !important;
        }
        .subtask-li {
            padding: 5px 0px !important;
            border: none !important;
            margin-bottom: 6px !important;

            &:hover {
                .icon-pm-pencil {
                    &:before {
                        color: #136e94 !important;
                    }
                }
                .icon-pm-delete {
                    &:before {
                        color: #e9485e !important;
                    }
                }
                .flaticon-pm-copy-files {
                    &:before {
                        color: #136e94 !important;
                    }
                }
                .sub-task-content {
                    .subtask-move {
                        .icon-pm-drag-drop {
                            &:before {
                                color: #b4b9be !important;
                            }
                        }
                    }
                }
            }
        }
        .subtask-title {
            color: #000;
            margin: 20px 0 5px 0;
            font-size: 14px;
            font-weight: bold;

            .pm-pro-badge {
                float: none;
                margin-left: 6px;
            }
        }
        .sub-task-content {
            display: flex;
            position: relative;

            .pm-pro-subtask-complete {
                background: #1ABC9C;
                border-color: #1ABC9C;
            }

            .subtask-move {
                position: absolute;
                left: -22px;
                top: -8px;
                padding: 10px;
                cursor: grab;

                .icon-pm-drag-drop {
                    &:before {
                        color: #fff;
                    }
                }
            }

            .body {
                margin-left: 10px;

                .copy-task {
                    margin-right: 8px !important;

                    .flaticon-pm-copy-files {
                        &:before {
                            font-size: 14px !important;
                            font-weight: 600 !important;
                        }
                    }
                }

                .header-wrap {

                    .estimation-time-wrap {
                        background: #0984e3;
                        white-space: nowrap;
                        font-size: 11px;
                        padding: 2px 4px;
                        border-radius: 2px;
                        color: #dfe6e9;
                        margin-right: 10px;
                        line-height: 12px;
                    }
                }
            }
            .checkbox {
                border-radius: 3px;
                height: 18px;
                width: 18px;
                box-shadow: none;
            }
            .complete-title {
                text-decoration: line-through;
            }
            .title {
                font-size: 13px;
                color: #525252;
                margin-right: 10px;
                word-wrap: break-word;
                word-break: break-all;
                hyphens: auto;
            }

            .description {
                font-size: 13px;
                color: #959595;
            }

            .title-meta {
                display: flex;
                align-items: baseline;

                .task-type {
                    margin-right: 10px;
                    font-size: 11px;
                    background: #00b894;
                    width: auto;
                    line-height: 1;
                    color: #fff;
                    padding: 3px 5px;
                    border-radius: 2px;
                    white-space: nowrap;

                    .type-title {
                        font-weight: 600;
                    }

                    .type-value {
                        font-style: italic;
                    }
                }

                .subtask-date-wrap {
                    white-space: nowrap;
                    -webkit-border-radius: 2px;
                    -moz-border-radius: 2px;
                    border-radius: 2px;
                    font-size: 11px;
                    line-height: 12px;
                    padding: 2px 4px;

                }

                .icon-pm-delete, .icon-pm-pencil, .flaticon-pm-copy-files {
                    cursor: pointer;
                    &:before {
                        color: #fff;
                    }
                }
                .meta-item {
                    margin-right: 10px;
                }

                .assigned-user-wrap {
                    display: flex;
                    align-items: center;

                    .assigned-user {
                        margin-right: 5px;
                        &:last-child {
                            margin-right: 0;
                        }
                        .user-anchor {
                            display: block;
                        }
                        img {
                            height: 16px;
                            width: 16px;
                            border-radius: 12px;
                            vertical-align: middle;
                        }
                    }
                }

            }
        }
        .input-area {
            border-radius: 3px;
            border: 1px solid #e5e4e4;

            .input-field {
                width: 100%;
                border: none !important;
                height: 35px;
                padding: 0 10px;
                outline: none;
                box-shadow: none !important;
                border-radius: 3px;
            }
        }

        .input-area,
        .pm-subtsk-sortable {
            &:hover {
                & ~ .pm-project-module-content-overlay {
                    width: 105%;
                    height: 120%;
                    display: block;
                    margin-top: -8px;
                    margin-left: -14px;
                    border-radius: 3px;

                    a.pro-button {
                        width: 150px;
                        padding: 8px 14px;
                        font-size: 12px;
                        line-height: 18px;

                        svg.crown-icon {
                            margin-left: 6px;
                        }
                    }
                }
            }

            & ~ .pm-project-module-content-overlay {
                &:hover {
                    width: 105%;
                    height: 120%;
                    display: block;
                    margin-top: -8px;
                    margin-left: -14px;
                    border-radius: 3px;

                    a.pro-button {
                        width: 150px;
                        padding: 8px 14px;
                        font-size: 12px;
                        line-height: 18px;

                        svg.crown-icon {
                            margin-left: 6px;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import Badge from '@components/upgrade/badge';
    import UpgraderOverlay from '@components/upgrade/overlay';

    export default {
        data () {
            return {

            }
        },


        components: {
            Badge,
            UpgraderOverlay,
        },

        computed: {

        },

        methods: {

        }
    }
</script>
