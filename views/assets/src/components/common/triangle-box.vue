<!--
Usage for this component
<pm-triangle-box>
    this is my content

    <button slot="popoverButton">click me</button>
</pm-triangle-box>
-->
<template>

    <v-popover
        offset="10"
        :popoverClass="popoverClass"
    >
        <template slot="popover">
            <slot></slot>
        </template>

        <slot name="popoverButton"></slot>
    </v-popover>

</template>


<style lang="less">
    .pm-popover {
        padding: 0;
        border: 0;
        width: auto;
    }
    .pm-popover .popover-inner {
        padding: .5rem .75rem !important;
        color: #212529;
        border: 1px solid rgba(0,0,0,.2);
    }

    .pm-popover {
        .tooltip-arrow {
            border: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            bottom: initial !important;
            top: initial !important;
            margin-left: -3.5px !important;

            &:before,
            &:after {
                content: "";
                position: absolute;
                display: block;
                border: 5px solid transparent;
            }


        }
        &[x-placement="top"] .tooltip-arrow {
            &:before {
                top: -1px;
                border-top: 7px solid #c7c7c7;
            }

            &:after {
                top: -2px;
                border-top: 6px solid #f9f9f9;
            }
        }

        &[x-placement="bottom"] .tooltip-arrow {
            bottom: 100% !important;
            &:before {
                bottom: -1px;
                border-bottom: 7px solid #c7c7c7;
            }

            &:after {
                bottom: -2px;
                border-bottom: 6px solid #f9f9f9;
            }
        }

        &[x-placement="left"] .tooltip-arrow {

        }

        &[x-placement="right"] .tooltip-arrow {

        }
    }
</style>

<script>
    export default {
        props: {
            popoverClass: {
                type: [String],
                default () {
                    return 'pm-popover'
                }
            }
        },
        data () {
            return {

            }

        }
    }
</script>
