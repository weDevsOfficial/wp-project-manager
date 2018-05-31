<template>
    <div class="pm-wrap pm pm-front-end">
        <pm-header></pm-header>
        <div v-if="!isListFetch" class="pm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>

        <div v-if="listViewType && isListFetch">
            <default-list-page v-if="is_blank_Template"></default-list-page>
            
            <div v-if="is_list_Template" id="pm-task-el" class="pm-task-container">
                <div class="pm-inline-list-wrap">
                    <div class="pm-inline-list-element" v-if="can_create_list">
                        <new-task-list-btn></new-task-list-btn>
                    </div>
                    <div class="pm-right-inline-list-element">
                        
                        <pm-do-action :hook="'pm-inline-list-button'"></pm-do-action>
                           
                    </div>
                    <div class="pm-clearfix"></div>
                </div>
                <transition name="slide" v-if="can_create_list">
                    <new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
                </transition>
                
                
                <ul class="pm-todolists">
                
                    <li v-for="(list, index) in lists" :key="list.id"  :class="'pm-fade-out-'+list.id">

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
                                        <a href="#" @click.prevent="showEditForm(list)" class="" title="Edit this List"><span class="dashicons dashicons-edit"></span></a>
                                        <a href="#" class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList( list )"><span class="dashicons dashicons-trash"></span></a>
                                        <a href="#" @click.prevent="listLockUnlock(list)" v-if="PM_Vars.is_pro && user_can('view_private_list')"><span :class="privateClass( list.meta.privacy )"></span></a>
                                    </div>
                                </h3>

                                <div class="pm-entry-detail" >
                                    {{ list.description }}    
                                </div>
                                
                                <transition name="slide" v-if="can_edit_task_list(list)">
                                    <div class="pm-update-todolist-form" v-if="list.edit_mode">

                                        <new-task-list-form section="lists" :list="list" ></new-task-list-form>
                                    </div>
                                </transition>
                            </header>
                            <!-- Todos component -->
                            <list-tasks :list="list"></list-tasks>

                            <footer class="pm-row pm-list-footer">
                                <div class="pm-col-8 pm-sm-col-12">
                                    <ul class="pm-footer-left-ul">
                                        <li v-if="isIncompleteLoadMoreActive(list)" class="pm-todo-refresh">
                                            <a @click.prevent="loadMoreIncompleteTasks(list)" href="#">{{ __( 'More Tasks', 'pm' ) }}</a>
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
                                                {{ __( 'Completed', 'pm' ) }}
                                            </router-link>
                                        </li>
                                        <li  class="pm-todo-incomplete">
                                            <router-link :to="{ 
                                                name: 'single_list', 
                                                params: { 
                                                    list_id: list.id 
                                                }}">
                                                <span>{{ list.meta.total_incomplete_tasks }}</span> 
                                                {{ __( 'Incomplete', 'pm' ) }}
                                            </router-link>
                                        </li>
                                        <li  class="pm-todo-comment">
                                            <router-link :to="{ 
                                                name: 'single_list', 
                                                params: { 
                                                    list_id: list.id 
                                                }}">
                                                <span>{{ list.meta.total_comments }} {{ __( 'Comments', 'pm' ) }}</span>
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
                    
                    </li>
                </ul>
                <pm-pagination 
                    :total_pages="total_list_page" 
                    :current_page_number="current_page_number" 
                    component_name='list_pagination'>
                    
                </pm-pagination> 
            </div>
            <router-view name="lists_single_task"></router-view>
            <!-- v-if="lists.length" name="single-task" -->
            
        </div>
        
    </div>
</template>
    
<style>
    .pm-inline-list-wrap .pm-right-inline-list-element {
        float: right;
    }
    .pm-inline-list-wrap {
        width: 100%;
    }
    .pm-inline-list-element {
        float: left;
    }

    .pm-list-footer .pm-new-task-btn-li {
        padding-left: 0 !important;
    }
    .pm-list-footer .pm-footer-left-ul li {
        display: inline-block;
        padding-left: 28px;
        background-size: 20px;
        background-repeat: no-repeat;
        margin: 5px 0;
        padding-bottom: 5px;
        margin-right: 2%;
    }
    .pm-list-footer .pm-footer-left-ul li a {
        line-height: 150%;
        font-size: 12px;
    }
    .pm-list-footer .pm-footer-left {
        width: 66%;
    }
    .pm-list-footer .pm-footer-right {
        width: 30%;
    }
    .pm-list-footer .pm-footer-left, .pm-list-footer .pm-footer-right {
        float: left;
    }
    .pm-list-footer .pm-todo-progress-bar, .pm-list-footer .pm-progress-percent {
        display: inline-block;
    }
    .pm-list-footer .pm-todo-progress-bar {
        width: 70%;
    }
    .pm-list-footer .pm-progress-percent {
        margin-left: 6px;
    }

</style>

<script>
    import new_task_list_btn from './new-task-list-btn.vue';
    import new_task_list_form from './new-task-list-form.vue';
    import new_task_button from './new-task-btn.vue';
    import pagination from '@components/common/pagination.vue';
    import header from '@components/common/header.vue';
    import tasks from './list-tasks.vue';
    import default_page from './default-list-page.vue';
    import Mixins from './mixin';
    
    export default {

        beforeRouteEnter (to, from, next) {
            next(vm => {
                var self = vm;
                
               
            });
        }, 
        components: {
            'new-task-list-btn': new_task_list_btn,
            'new-task-list-form': new_task_list_form,
            'new-task-button': new_task_button,
            'pm-pagination': pagination,
            'pm-header': header,
            'list-tasks': tasks,
            'default-list-page': default_page
        },

        mixins: [Mixins],

        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data () {
            return {
                list: {},
                index: false,
                project_id: this.$route.params.project_id,
                current_page_number: this.$route.params.current_page_number || 1,
            }
        },

        watch: {
            '$route' (route) {
                if(
                    route.name != 'lists_single_task'
                    &&
                    this.current_page_number != route.params.current_page_number
                ) {
                    this.getSelfLists();
                }
                
                this.isSingleTask();
            }
        },

        computed: {
            /**
             * Get lists from vuex store
             * 
             * @return array
             */
            lists () {
                return this.$store.state.projectTaskLists.lists;
            },

            /**
             * Get milestones from vuex store
             * 
             * @return array
             */
            milestones () {
                return this.$store.state.projectTaskLists.milestones;
            },

            is_active_list_form () {
                return this.$store.state.projectTaskLists.is_active_list_form;
            },

            total_list_page () {
                return this.$store.state.projectTaskLists.lists_meta.total_pages;
            },

            is_blank_Template(){
                return this.$store.state.projectTaskLists.balankTemplateStatus;
            },
            is_list_Template(){
                return this.$store.state.projectTaskLists.listTemplateStatus; 
            },
            isListFetch () {
                return this.$store.state.projectTaskLists.isListFetch; 
            },

            listViewType () { 
                let meta = this.$store.state.projectMeta; 
                var self = this;
                if(meta.hasOwnProperty('list_view_type') ) {
                    if (
                        !meta.list_view_type
                            ||
                        meta.list_view_type.meta_value == 'list'
                    ) {
                        self.$store.state.projectTaskLists.is_single_list = false;
                        self.isSingleTask();
                        self.getSelfLists();
                        self.getGlobalMilestones();
                    } else {
                        self.$router.push({
                            name: 'kanboard'
                        });
                    }

                    return true;
                }

                return false;
            }

        },

        methods: {
            isSingleTask () {
                if ( this.$route.name == 'lists_single_task' ) {
                    this.$store.commit('isSigleTask', true);
                } else {
                    this.$store.commit('isSigleTask', false);
                }
            },

            showEditForm (list, index) {
                list.edit_mode = list.edit_mode ? false : true;
            },
            
            getSelfLists () {
                var self = this;
                var args = {
                        callback: function(res) {
                            pm.NProgress.done();
                        }
                    }
                this.getLists(args);
            },

            deleteSelfList ( list ) {
                var self = this;
                var hasCurrentPage = self.$route.params.current_page_number;
                var args = {
                    list_id: list.id,
                    callback: function ( res ) {
                        if (!self.$store.state.projectTaskLists.lists.length) {
                            self.$router.push({
                                name: 'task_lists', 
                                params: { 
                                    project_id: self.project_id 
                                }
                            });
                            if(hasCurrentPage) {
                               self.$store.commit( 'projectTaskLists/fetchListStatus', false ); 
                            }
                        } else {
                            self.getLists();
                        }   
                    }
                }
                this.deleteList(args);
            }
        }
    }
</script>