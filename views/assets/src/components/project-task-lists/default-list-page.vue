<template>
    <div class="pm-blank-template todolist">
        <div class="pm-content" v-if="!is_archive_page" >
            <h3 class="pm-page-title">{{ __( 'Task Lists', 'wedevs-project-manager') }}</h3>
            <p>
                {{ __( 'You can list all your Tasks in a single discussion using a Task list. Use these lists to divide a project into several sectors, assign co-workers and check progress.', 'wedevs-project-manager') }}
            </p>

            <new-task-list-btn v-if="can_create_list"></new-task-list-btn>
            <transition name="slide" v-if="can_create_list">
                <new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
            </transition>
            <div class="pm-list-content">
                <h3 class="pm-why-for pm-page-title">{{ __( 'When to use Task Lists?', 'wedevs-project-manager')}}</h3>

                <ul class="pm-list">
                    <li>{{ __( 'To partition a project internals.', 'wedevs-project-manager')}}</li>
                    <li>{{ __( 'To mark milestone points.', 'wedevs-project-manager') }}</li>
                    <li>{{ __( 'To assign people to tasks.', 'wedevs-project-manager') }}</li>
                </ul>

            </div>

        </div>
        <div class="pm-content"  v-else>
            <h2 class="pm-page-title">{{ __( 'Archive Task Lists', 'wedevs-project-manager') }}</h2>
            <p>
                {{ __( 'No Archive list found', 'wedevs-project-manager') }}
            </p>
        </div>

    </div>
</template>

<script>
    import new_task_list_btn from './new-task-list-btn.vue';
    import new_task_list_form from './new-task-list-form.vue';
    import Mixins from './mixin';

    export default {
        mixins: [Mixins],
        components: {
            'new-task-list-btn': new_task_list_btn,
            'new-task-list-form': new_task_list_form,
        },

        computed: {
            is_active_list_form () {
                return this.$store.state.projectTaskLists.is_active_list_form;
            },
            is_archive_page () {
                return this.$route.name === 'task_lists_archive';
            }
        }
    }
</script>