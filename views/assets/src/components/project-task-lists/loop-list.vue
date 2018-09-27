<template>
    <article class="pm-todolist">
        <header class="pm-list-header">
            <h3>
            
                <router-link :to="{ 
                    name: 'single_list', 
                    params: { 
                        list_id: list.id 
                    }}">
                {{ list.title }}
                
                </router-link>

                <!-- v-if="list.can_del_edit" -->
                <div class="pm-right" v-if="can_edit_task_list(list)">
                    <div class="list-right-action">
                        <a href="#" v-pm-tooltip @click.prevent="showEditForm(list)" class="" :title="__('Edit', 'wedevs-project-manager')"><span class="dashicons dashicons-edit"></span></a>
                        <a href="#" v-pm-tooltip :title="__('Delete', 'wedevs-project-manager')" class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList( list )"><span class="dashicons dashicons-trash"></span></a>
                        <a href="#" v-pm-tooltip :title="helpTextPrivate(list.meta.privacy)"  @click.prevent="listLockUnlock(list)" v-if="PM_Vars.is_pro && user_can('view_private_list')"><span :class="privateClass( list.meta.privacy )"></span></a>
                        <pm-do-action hook="list-action-menu" :actionData="list"></pm-do-action>
                    </div>
                </div>
            </h3>

            <pre class="pm-entry-detail" v-html="list.description"></pre>
            
            <transition name="slide" v-if="can_edit_task_list(list) || isArchvedList(list)">
                <div class="pm-update-todolist-form" v-if="list.edit_mode">
                    <new-task-list-form section="lists" :list="list" ></new-task-list-form>
                </div>
            </transition>
        </header>
        
        <list-tasks :list="list"></list-tasks>

        <footer class="pm-row pm-list-footer">
            <div class="pm-col-8 pm-sm-col-12">
                <ul class="pm-footer-left-ul">
                    <li v-if="isIncompleteLoadMoreActive(list)" class="pm-todo-refresh">
                        <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">{{ __( 'More Tasks', 'wedevs-project-manager') }}</a>
                    </li>
                    <transition name="slide" v-if="can_create_task">
                        <li class="pm-new-task-btn-li">
                            <new-task-button :task="{}" :list="list"></new-task-button>
                        </li>
                    </transition>
                    
                    <li class="pm-todo-complete">
                        <router-link :to="{ 
                            name: 'single_list', 
                            params: { 
                                list_id: list.id 
                            }}">
                            <span>{{ list.meta.total_complete_tasks }}</span>  
                            {{ __( 'Completed', 'wedevs-project-manager') }}
                        </router-link>
                    </li>
                    <li  class="pm-todo-incomplete">
                        <router-link :to="{ 
                            name: 'single_list', 
                            params: { 
                                list_id: list.id 
                            }}">
                            <span>{{ list.meta.total_incomplete_tasks }}</span> 
                            {{ __( 'Incomplete', 'wedevs-project-manager') }}
                        </router-link>
                    </li>
                    <li  class="pm-todo-comment">
                        <router-link :to="{ 
                            name: 'single_list', 
                            params: { 
                                list_id: list.id 
                            }}">
                            <span>{{ list.meta.total_comments }} {{ __( 'Comments', 'wedevs-project-manager') }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="pm-col-4">
                <div class="pm-todo-progress-bar">
                    <div :style="getProgressStyle( list )" class="bar completed"></div>
                </div>
                <div class="pm-progress-percent">{{ getProgressPercent( list ) }}%</div>
            </div>
            
            <div class="pm-clearfix"></div>
        </footer>
    </article>
</template>


<script>
export default {
    props: {
        list: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>


<style lang="css">
    
</style>