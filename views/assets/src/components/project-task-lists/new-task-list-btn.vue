<template>
    <div>
        <!-- New Todo list button -->
        <a  @click.prevent="showHideListForm('toggle')" href="#" class="pm-btn pm-btn-blue pm-margin-bottom add-tasklist pm-btn-uppercase">
            <i v-if="!show_list_form" class="fa fa-plus-circle" aria-hidden="true"></i>
            <i v-if="show_list_form" class="fa fa-minus-circle" aria-hidden="true"></i>
            {{ __( 'New Task List', 'wedevs-project-manager') }}
        </a>
    </div>
</template>

<script>
    import Mixins from './mixin';
    
    export default{
        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data: function() {
            return {
                list: {},
                index: false,
                permissions: this.$store.state.projectTaskLists.permissions,
            }
        },

        mixins: [Mixins],

        computed: {
            /**
             * Show new todo-list form
             * 
             * @return boolean
             */
            show_list_form: function() {
                return this.$store.state.projectTaskLists.show_list_form;
            },
        },

        methods: {
            
        }
    }   
</script>

