<template>
    <div class="pm-blank-template todolist">
        <div class="pm-content" >
            <h3 class="pm-page-title">{{ __( 'Task Lists', 'pm' ) }}</h3>
            <p>
                {{ __( 'You can list all your Tasks in a single discussion using a Task list. Use these lists to divide a project into several sectors, assign co-workers and check progress.', 'pm' ) }}
            </p>

            <new-task-list-btn v-if="can_create_list"></new-task-list-btn>
            <transition name="slide" v-if="can_create_list">
                <new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
            </transition>
            <div class="pm-list-content">
                <h3 class="pm-why-for pm-page-title">{{ __( 'When to use Task Lists?', 'pm' )}}</h3>

                <ul class="pm-list">
                    <li>{{ __( 'To partition a project internals.', 'pm' )}}</li>
                    <li>{{ __( 'To mark milestone points.', 'pm' ) }}</li>
                    <li>{{ __( 'To assign people to tasks.', 'pm' ) }}</li>
                </ul>

            </div>

        </div>


    </div>
</template>

<script>
    import new_task_list_btn from './new-task-list-btn.vue';
    import new_task_list_form from './new-task-list-form.vue';

    export default {
        mixins: [PmMixin.projectTaskLists],
        components: {
            'new-task-list-btn': new_task_list_btn,
            'new-task-list-form': new_task_list_form,
        },

        computed: {
            is_active_list_form () {
                return this.$store.state.projectTaskLists.is_active_list_form;
            },
        }
    }
</script>