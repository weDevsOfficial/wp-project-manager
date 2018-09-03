<template>
    <div class="pm-dropdown" v-pm-click-outside="close">
        <a href="#" @click.prevent="openDropdown()" ><span class="fa fa-ellipsis-v"></span></a>
        <ul v-if="open">
            <pm-do-action hook="list-dropdown-menu" :actionData="list"></pm-do-action>
        </ul>
    </div>
</template>


<script>
    export default {
        props:  {
            list: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                open: false,
            }
        },
        computed: {
            
        },
        methods: {
           openDropdown () {
               this.open = !this.open;
           },
           close () {
                this.open = false;
            }
        }
    }
</script>


<style lang="css">
    .pm-dropdown {
        display: inline-block;
        padding: 0px 5px;
        position: relative;
    }
    .pm-dropdown ul {
        position: absolute;
        top: 27px;
        right: 0;
        background: #fff;
        text-align: left;
        display: block;
        min-width: 110px;
        padding: 5px;
        z-index: 100;
        font-size: 10px;
        line-height: 16px;
    }
    .pm-dropdown ul li a {
        padding: 3px !important;
        display: block;
    }
</style>