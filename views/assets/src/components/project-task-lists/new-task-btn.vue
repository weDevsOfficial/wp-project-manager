<template>
    <div :class="newTaskBtnClass() + ' pm-new-task-button-icon'">
        <a @click.prevent="showHideTaskFrom('toggle', list, false )" href="#">{{ __( 'Add Task', 'pm' ) }}</a>
    </div>
</template>

<style>
    
    .pm-new-task-button-icon {
        display: inline-block;
        padding-left: 28px;
        background-size: 20px;
        background-repeat: no-repeat;
    }
</style>

<script>
    import Mixins from './mixin';
    
    export default {
        // Get passing data for this component. Remember only array and objects are
        props: ['list', 'task'],

        mixins: [Mixins],

        methods: {
            /**
             * Select new todo-list button class for +,- icon
             * 
             * @return string
             */
            newTaskBtnClass: function() {
                return this.list.show_task_form ? 'pm-new-task-btn-minus' : 'pm-new-task-btn';
            },
        }
    }
</script>