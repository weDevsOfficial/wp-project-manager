<!--
Usage for this component
<triangle-box>
    this is my content

    <button slot="popoverButton">click me</button>
</triangle-box>
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
    .tooltip.popover .popover-inner {
        padding: .5rem .75rem;
        color: #212529;
        border: 1px solid rgba(0,0,0,.2);
    }

    .tooltip {
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
                top: 0;
                border-top: 7px solid #c7c7c7;
            }

            &:after {
                top: -1px;
                border-top: 6px solid #f9f9f9;
            }
        }

        &[x-placement="bottom"] .tooltip-arrow {
            bottom: 100% !important;
            &:before {
                bottom: 0;
                border-bottom: 7px solid #c7c7c7;
            }

            &:after {
                bottom: -1px;
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
