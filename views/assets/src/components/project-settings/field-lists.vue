<template>
    <div class="display-table-wrap">
        <table class="pm-table table-striped table-justified">
            <thead>
                <tr>
                    <th class="th-title">{{ __( 'Title', 'wedevs-project-manager' ) }}</th>
                    <th class="th-title">{{ __( 'Type', 'wedevs-project-manager' ) }}</th>
                    <th class="th-title">{{ __( 'Description', 'wedevs-project-manager' ) }}</th>
                    <th class="th-title">{{ __( 'Action', 'wedevs-project-manager' ) }}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colspan="4">{{ __( 'No field found!', 'wedevs-project-manager' ) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="less">
    .display-table-wrap {
        margin-top: 10px;
        font-size: 13px;
        border: 1px solid #eee;
        border-bottom: none;
        .th-title {
            font-weight: 500;
        }
        thead {
            tr {
                box-shadow: none !important;
            }
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
</style>

<script>
    export default {
        methods: {

        }
    }
</script>
