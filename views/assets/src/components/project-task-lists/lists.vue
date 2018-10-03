<template>
    <div class="pm-task-list-wrap">
        <pm-header></pm-header>
        <pm-menu></pm-menu>
        <div class="list-content-wrap">
            <div class="content">

                <div class="list-action-btn-wrap">
                    <div class="new-list-btn">
                        <a href="#" class="list-action-group add-list">
                            <span class="plus">+</span>
                            <span>{{ __('Add Task List', 'wedevs-project-manager') }}</span>
                        </a>
                    </div>
                    <pm-do-action :hook="'pm-inline-list-button'"></pm-do-action>
                    <div>
                        <a class="task-filter list-action-group" v-pm-tooltip :title="__('Task Filter', 'wedevs-project-manager')" @click.prevent="showFilter()" href="#">
                            <span class="icon-pm-filter"></span>
                            <span>{{__('Filter', 'wedevs-project-manager')}}</span>
                        </a>
                    </div>
                </div>
                
                <!-- <div class="todos-wrap no-task">
                    <span>{{ __( 'No result Found', 'wedevs-project-manager') }}</span>

                </div> -->
            </div>

            <div class="list-search-menu" v-if="isActiveFilter">
                <div class="filter-title">
                    <div>
                        <a @click.prevent="showFilter()" href="#" class="icon-pm-cross"></a>
                        <span class="task-filter">{{__('Task Filter', 'wedevs-project-manager')}}</span>
                    </div>
                </div>
                
                <div class="search-content">
                    <form @submit.prevent="taskFilter()">
                        <div class="margin-top">
                            <div class="margin-title">{{__('Task list name', 'wedevs-project-manager')}}</div>
                            <div>
                                <multiselect 
                                    v-model="defaultList" 
                                    :options="searchLists" 
                                    :show-labels="false"
                                    :searchable="true"
                                    :loading="asyncListLoading"
                                    :placeholder="'Type task list name'"
                                    @search-change="asyncFind($event)"
                                    label="title"
                                    track-by="id">
                                    <span slot="noResult">{{ __( 'No task list found.', 'pm-pro' ) }}</span>
                                        
                                </multiselect> 
                            
                            </div>
                        </div>
                        <div class="margin-top">
                            <div class="margin-title">{{__('Status', 'wedevs-project-manager')}}</div>
                            <div class="status-elements">
                                <a :class="'complete-btn ' + completeBoder()" @click.prevent="changeFilterStatus('complete')" href="#">
                                    {{__('Completed', 'wedevs-project-manager')}}
                                </a>
                                <a :class="'on-going-btn ' + onGoingBorder()" @click.prevent="changeFilterStatus('incomplete')" href="#">
                                    {{__('On-going', 'wedevs-project-manager')}}
                                </a>
                            </div>
                        </div>
                        <div class="margin-top">
                            <div class="margin-title">{{__('Assigned to', 'wedevs-project-manager')}}</div>
                            <div>
                                <multiselect 
                                    v-model="defaultUser" 
                                    :options="projectUsers" 
                                    :show-labels="false"
                                    :placeholder="'Type task list name'"
                                    label="display_name"
                                    track-by="id">
                                        
                                </multiselect>
                            </div>
                        </div>
                        <div class="margin-top">
                            <div class="margin-title">{{__('Due Date', 'wedevs-project-manager')}}</div>
                            <div>
                                <multiselect 
                                    v-model="dueDate" 
                                    :options="dueDates" 
                                    :show-labels="false"
                                    :placeholder="'Type task list name'"
                                    label="title"
                                    track-by="id">
                                        
                                </multiselect>
                            </div>
                        </div>
                        <div class="action">
                            <input  type="submit" class="pm-button pm-primary filter-submit-btn" name="submit_todo" :value="__('Done', 'wedevs-project-manager')">
                            <a @click.prevent="showFilter()" class="pm-button pm-secondary" href="#">{{__('Cancel', 'wedevs-project-manager')  }}</a>
                        </div>
                    </form>
                </div>
            </div>

        </div>
        <div @click.prevent="showFilter()">open filter</div>
        <!-- <div v-if="!isListFetch" class="pm-data-load-before" >
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
 -->
        <!-- <div v-if="listViewType && isListFetch">

            <default-list-page v-if="is_blank_Template && !isActiveFilter"></default-list-page>
            
            <div v-if="is_list_Template" id="pm-task-el" class="pm-task-container">
                <div class="pm-inline-list-wrap">
                    <div class="pm-inline-list-element" v-if="can_create_list">
                        <new-task-list-btn></new-task-list-btn>
                        
                    </div>
                    <div class="pm-right-inline-list-element">
                        <div class="list-filter">
                            <a v-pm-tooltip :title="__('Task Filter', 'wedevs-project-manager')" @click.prevent="showFilter()" href="#"><span class="icon-pm-filter"></span></a>
                        </div>
                        <pm-do-action :hook="'pm-inline-list-button'"></pm-do-action>
                           
                    </div>
                    
                </div>
                <transition name="slide" v-if="can_create_list">
                    <new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
                </transition>
                
                <div class="pm-task-list-flex todo-lists">
                    <ul v-if="hasSearchContent()" v-pm-list-sortable :class="filterActiveClass()+ ' pm-todolists'">
                    
                        <li  v-for="list in lists" :key="list.id" :data-id="list.id"  :class="'pm-list-sortable pm-fade-out-'+list.id">

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

                                        <div class="pm-right" v-if="can_edit_task_list(list)">
                                            <div class="list-right-action">
                                                <a href="#" v-pm-tooltip v-if="list.status == 'current'" @click.prevent="showEditForm(list)" class="" :title="__('Edit', 'wedevs-project-manager')"><span class="dashicons dashicons-edit"></span></a>
                                                <a href="#" v-pm-tooltip :title="__('Delete', 'wedevs-project-manager')" class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList( list )"><span class="dashicons dashicons-trash"></span></a>
                                                <a href="#" v-pm-tooltip :title="helpTextPrivate(list.meta.privacy)"  @click.prevent="listLockUnlock(list)" v-if="PM_Vars.is_pro && user_can('view_private_list') && list.status == 'current'"><span :class="privateClass( list.meta.privacy )"></span></a>
                                                <pm-do-action hook="list-action-menu" :actionData="list"></pm-do-action>
                                            </div>
                                        </div>
                                    </h3>

                                    <pre class="pm-entry-detail" v-html="list.description"></pre>
                                    
                                    <transition name="slide" v-if="can_edit_task_list(list)">
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
                        
                        </li>
                    </ul>

                    <div class="pm-demo-template" v-if="isActiveFilter && !filterResults">
                        <span>{{__('No Result Found!', 'wedevs-project-manager')}}</span>
                    </div>
                    <div class="list-search-menu" v-if="isActiveFilter">
                        <div class="filter-title">
                            <span><a @click.prevent="showFilter()" href="#">X</a></span>
                            <span class="task-filter">{{__('Task Filter', 'wedevs-project-manager')}}</span>
                        </div>
                        
                        <form @submit.prevent="taskFilter()">
                            <div class="margin-top">
                                <div class="margin-title">{{__('Task list name', 'wedevs-project-manager')}}</div>
                                <div>
                                    <multiselect 
                                        v-model="defaultList" 
                                        :options="searchLists" 
                                        :show-labels="false"
                                        :searchable="true"
                                        :loading="asyncListLoading"
                                        :placeholder="'Type task list name'"
                                        @search-change="asyncFind($event)"
                                        label="title"
                                        track-by="id">
                                        <span slot="noResult">{{ __( 'No task list found.', 'pm-pro' ) }}</span>
                                            
                                    </multiselect> 
                                
                                </div>
                            </div>
                            <div class="margin-top">
                                <div class="margin-title">{{__('Status', 'wedevs-project-manager')}}</div>
                                <div class="status-elements">
                                    <a :class="'complete-btn ' + completeBoder()" @click.prevent="changeFilterStatus('complete')" href="#">
                                        {{__('Completed', 'wedevs-project-manager')}}
                                    </a>
                                    <a :class="'on-going-btn ' + onGoingBorder()" @click.prevent="changeFilterStatus('incomplete')" href="#">
                                        {{__('On-going', 'wedevs-project-manager')}}
                                    </a>
                                </div>
                            </div>
                            <div class="margin-top">
                                <div class="margin-title">{{__('Assigned to', 'wedevs-project-manager')}}</div>
                                <div>
                                    <multiselect 
                                        v-model="defaultUser" 
                                        :options="projectUsers" 
                                        :show-labels="false"
                                        :placeholder="'Type task list name'"
                                        label="display_name"
                                        track-by="id">
                                            
                                    </multiselect>
                                </div>
                            </div>
                            <div class="margin-top">
                                <div class="margin-title">{{__('Due Date', 'wedevs-project-manager')}}</div>
                                <div>
                                    <multiselect 
                                        v-model="dueDate" 
                                        :options="dueDates" 
                                        :show-labels="false"
                                        :placeholder="'Type task list name'"
                                        label="title"
                                        track-by="id">
                                            
                                    </multiselect>
                                </div>
                            </div>
                            <input  type="submit" class="button-primary filter-submit-btn" name="submit_todo" :value="__('Done', 'wedevs-project-manager')">
                        </form>
                    </div>
                </div>
                <pm-pagination 
                    :total_pages="total_list_page" 
                    :current_page_number="current_page_number" 
                    :component_name="paginationComponent">
                    
                </pm-pagination> 
            </div>
            <router-view name="single-task"></router-view> 
        </div> -->
        
    </div>
</template>
    
<style lang="less">
    .pm-task-list-wrap {
        .list-content-wrap {
            display: flex;
            flex-wrap: wrap;
            background: #FAFAFA;

            .content {
                flex: 5;
                border: 1px solid #E5E4E4;
                border-top: none;

                .list-action-btn-wrap {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    flex-wrap: wrap;

                    .add-list {
                    }

                    .list-action-group {
                        height: 30px;
                        font-size: 12px;
                        padding: 0 13px;
                        border-radius: 3px;
                        white-space: nowrap;
                    }

                    .task-filter {
                        display: flex;
                        align-items: center;
                        background: #1A9ED4;
                        height: 30px;
                        color: #fff;
                        padding: 0 13px;
                        border-radius: 3px;
                        font-size: 12px;

                        .icon-pm-filter {
                            margin-right: 5px;
                        }
                    }

                    .pm-list-header-menu {
                        display: flex;
                        align-items: center;
                    }

                    .list-view-btn {
                        display: flex;
                        align-items: center;
                        background: #fff;
                        border: 1px solid #E2E2E2;
                        border-radius: 3px;
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                        color: #788383;
                        border-right-color: #fff;
                        white-space: nowrap;

                        &:hover {
                            border-color: #1A9ED4;
                            border-right: 1px solid #1A9ED4;
                            color: #1A9ED4;

                            .icon-pm-list-view {
                                &:before {
                                    color: #1A9ED4;
                                }
                            }
                        }

                        .icon-pm-list-view {
                            margin-right: 5px;

                            &:before {
                                vertical-align: middle;
                                color: #d7dee2;

                            }
                        }

                    }

                    .kanboard-btn {
                        display: flex;
                        align-items: center;
                        background: #fff;
                        border: 1px solid #E2E2E2;
                        border-radius: 3px;
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                        color: #788383;
                        white-space: nowrap;

                        &:hover {
                            border-color: #1A9ED4;
                            color: #1A9ED4;

                            .icon-pm-kanboard-view {
                                &:before {
                                    color: #1A9ED4;
                                }
                            }
                        }
                        

                        .icon-pm-kanboard-view {
                            margin-right: 5px;
                            &:before {
                                vertical-align: middle;
                            }
                        }
                    }

                    .new-list-btn {
                        flex: 1;
                        a {
                            height: 30px !important;
                            display: flex;
                            align-items: center;
                            width: 117px;
                            background: #1A9ED4;
                            height: 30px;
                            color: #fff;
                            padding: 0 13px;
                            border-radius: 3px;
                            font-size: 12px;

                        }
                        .plus {
                            margin-right: 5px;
                            font-size: 15px;
                        }
                    }
                    .pm-action-wrap {
                        display: flex;
                        align-items: center;
                        .archive-page-button {
                            margin: 0 15px;
                            a {
                                border: 1px solid #e4e5e5;
                                background: #fff;
                                display: flex;
                                align-items: center;
                                white-space: nowrap;
                                &:hover {
                                    border-color: #1A9ED4;
                                    border-right: 1px solid #1A9ED4;
                                    color: #1A9ED4;

                                    .icon-pm-archive {
                                        &:before {
                                            color: #1A9ED4;
                                        }
                                    }
                                }
                            }
                            .icon-pm-archive {
                                color: #788383;
                            } 
                        }
                    }
                }

                .todos-wrap {

                }

                .no-task {
                    margin: auto;
                    font-size: 15px;
                    color: #000;
                }
            }

            .list-search-menu {
                border-bottom: 1px solid #E5E4E4;
                border-right: 1px solid #E5E4E4;
                border-left: 1px solid #E5E4E4;
                font-size: 13px;
                color: #000;
                background: #fff;
                flex: 1.7;
                margin-left: -1px;

                .action {
                    display: flex;
                    align-items: center;
                    margin-top: 18px;
                    
                    .pm-primary {
                        margin-right: 10px !important;
                        padding: 0 20px 1px !important;
                    }
                }

                .margin-top {
                    margin-bottom: 10px;
                    .complete-btn {
                        padding: 6px 15px;
                        border-radius: 3px;
                        background: #f8f3f9;
                        color: #9B59CA;
                        margin-right: 20px;
                        border: 1px solid #fff;
                        white-space: nowrap;
                    }

                    .complete-status {
                        border: 1px solid #9B59CA;
                    }

                    .on-going-btn {
                        padding: 6px 15px;
                        border-radius: 3px;
                        background: #fdedf0;
                        color: #E9485E;
                        border: 1px solid #fff;
                        white-space: nowrap;
                    }
                    .incomplete-status {
                        border: 1px solid #E9485E;
                    }
                    .status-elements {
                        display: flex;
                        align-items: center;
                    }
                }

                .margin-title {
                    margin-bottom: 2px;
                }

                .multiselect__select {
                    position: absolute;
                    width: 26px;
                    height: 35px;
                    right: 5px;
                    top: -3px;
                    text-align: center;
                    transition: transform .2s ease;
                }

                .multiselect__tags {
                    padding: 1px 40px 0 1px !important;
                    min-height: auto !important;
                }

                .multiselect__single {
                    color: #999999;
                    font-size: 12px;
                }

                .multiselect__input {
                    border: none;
                    box-shadow: none;
                    margin: 0;
                    margin-top: -1px;
                    padding: 0;
                }


                .filter-title {
                    height: 51px;
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    padding-left: 15px;

                    .icon-pm-cross {
                        margin-right: 10px;
                        &:before {
                            color: #95A5A6;
                            font-size: 10px;
                        }
                    }
                }

                .search-content {
                    padding: 0 15px 15px 15px;
                }
            }
        }
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
    import date_picker from './date-picker.vue';
    import Menu from '@components/common/menu.vue';

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
            'default-list-page': default_page,
            'multiselect': pm.Multiselect.Multiselect,
            'pm-datepickter': date_picker,
            'pm-menu': Menu
            
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
                isActiveFilter: true,
                defaultList: {
                    id: 0,
                    title: this.__('All', 'wedevs-project-manager')
                },
                defaultUser: {
                    id: 0,
                    display_name: this.__('All', 'wedevs-project-manager')
                },
                filterDueDate: '',
                filterStatus: '',
                dueDates: [
                    {
                        'id': '0',
                        'title': this.__('All', 'wedevs-project-manager'),
                    },
                    {
                        'id': 'overdue',
                        'title': this.__('Over Due', 'wedevs-project-manager'),
                    },
                    {
                        'id': 'today',
                        'title': this.__('Today', 'wedevs-project-manager'),
                    },
                    {
                        'id': 'week',
                        'title': this.__('Less Than 1 week', 'wedevs-project-manager'),
                    }
                ],
                dueDate: {
                    'id': '0',
                    'title': this.__('All', 'wedevs-project-manager'),
                },
                searchLists: [
                    {
                        id: 0,
                        title: this.__('All', 'wedevs-project-manager')
                    }
                ],
                asyncListLoading: false
            }
        },

        watch: {
            '$route' (route) {
                if(route.query.filterTask == 'active') {
                    return;
                }

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

            listsForFilters () {
                var lists = this.$store.state.projectTaskLists.lists;
                var newLists = [{
                    id: 0,
                    title: this.__('All', 'wedevs-project-manager')
                }];

                lists.forEach(function(list) {
                    newLists.push({
                        id: list.id,
                        title: list.title
                    });
                });

                this.defaultList = newLists[0];
                return newLists;
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
            is_list_Template() {
                if(this.isActiveFilter) {
                    return true;
                }
                return this.$store.state.projectTaskLists.listTemplateStatus; 
            },
            isListFetch () {
                return this.$store.state.projectTaskLists.isListFetch; 
            },

            listViewType () { 
                if(this.$route.query.filterTask == 'active') {
                    return true;
                }
                
                let meta = this.$store.state.projectMeta; 
                var self = this;
                if(meta.hasOwnProperty('list_view_type') ) {
                    if (
                        !meta.list_view_type
                            ||
                        meta.list_view_type.meta_value == 'list'
                    ) {
                        if (self.$store.state.projectTaskLists.is_single_task) {
                            return true;
                        }

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
            },
            projectUsers () {
                let project = this.$store.state.project;

                if(project.assignees) {
                    project.assignees.data.splice(0, 1, {
                        id: 0,
                        display_name: this.__('All', 'wedevs-project-manager')
                    });

                    return project.assignees.data;
                }

                return [];
            },
            filterResults () {
                var lists = this.$store.state.projectTaskLists.lists;

                if(lists.length) {
                    return true;
                } else {
                    return false;
                }
            },
            paginationComponent () {
                return this.$route.name.indexOf('pagination') === -1 ? this.$route.name + '_pagination' : this.$route.name ;
            }

        },

        created () {
            pmBus.$on('pm_before_destroy_single_task', this.updateSingleTask);
            pmBus.$on('pm_generate_task_url', this.generateTaskUrl);
            pmBus.$on('pm_after_fetch_project', this.afterFetchProject);
            this.$store.state.projectTaskLists.isListFetch = false; 

            if(this.$route.query.filterTask == 'active') {
                this.setSearchData();
                this.isActiveFilter = true;
                this.filterRequent();
            } 
        },

        methods: {
            afterFetchProject (project) {

                //set filter search user
                if(this.$route.query.filterTask == 'active') {
                    let index = this.getIndex(this.projectUsers, this.$route.query.users, 'id');
                    this.defaultUser = project.assignees.data[index];
                } 
            },
            setSearchData () {
                var self = this;
                this.filterStatus = this.$route.query.status;
                var request = {
                    data: {

                    },
                    url: this.base_url + '/pm/v2/projects/'+this.project_id+'/task-lists',
                 
                    success (res) {
                        self.searchLists = res.data;
                        self.searchLists.splice(0, 1,    {
                            id: 0,
                            title: self.__('All', 'wedevs-project-manager')
                        });
                        let index = self.getIndex(self.searchLists, self.$route.query.lists, 'id');
                        self.defaultList = self.searchLists[index];
                    }
                }
                
                this.httpRequest(request);
                let duDateIndex = this.getIndex(this.dueDates, self.$route.query.dueDate, 'id');
                this.dueDate = this.dueDates[duDateIndex];
            },
            completeBoder () {
                return this.filterStatus == 'complete' ? 'complete-status' : '';
            },
            onGoingBorder () {
                return this.filterStatus == 'incomplete' ? 'incomplete-status' : '';
            },
            helpTextPrivate (privateList) {
                return privateList ? __('Make Visible', 'wedevs-project-manager') : __('Make Private', 'wedevs-project-manager');
            },
            setSearchLists (lists) {
                var newLists = [{
                    id: 0,
                    title: this.__('All', 'wedevs-project-manager')
                }];

                lists.forEach(function(list) {
                    newLists.push({
                        id: list.id,
                        title: list.title
                    });
                });

                this.defaultList = newLists[0];
                this.searchLists = newLists;
            },

            asyncFind (evt) {
                var self = this,
                timeout = 2000,
                timer;

                if(evt == '') {
                    //return;
                }

                clearTimeout(timer);
                self.asyncListLoading = true;

                timer = setTimeout(function () {
                    if (self.abort) {
                        self.abort.abort();
                    }

                    var requestData = {
                        type: 'GET',
                        url: self.base_url + '/pm/v2/projects/' + self.project_id + '/lists/search',
                        data: {
                            title: evt
                        },

                        success: function success(res) {
                            self.asyncListLoading = false;
                            self.setSearchLists( res.data );
                        }
                    };

                    self.abort = self.httpRequest(requestData);
                }, timeout);
            },
            hasSearchContent () {
                if( !this.isActiveFilter ) {
                    return true;
                } 

                if( !this.filterResults ) {
                    return false;
                }

                return true;
            },
            filterActiveClass () {
                return this.isActiveFilter ? 'optimizeWidth' : '';
            },
            showFilter () {
                this.isActiveFilter = this.isActiveFilter ? false : true;

                this.$store.commit( 'projectTaskLists/balankTemplateStatus', false);

                if(this.isActiveFilter == false) {
                    this.$router.push({
                        query: {}
                    });

                    this.getLists();
                }
            },
            generateTaskUrl (task) {
                var url = this.$router.resolve({
                    name: 'lists_single_task',
                    params: {
                        task_id: task.id,
                        project_id: task.project_id,
                        list_id: task.task_list.data.id
                    }
                }).href;
                var url = PM_Vars.project_page + url;
                //var url = PM_Vars.project_page + '#/projects/' + task.project_id + '/task-lists/tasks/' + task.id; 
                this.copy(url);
            },
            afterTaskDoneUndone (task) {

                this.$store.commit( 'projectTaskLists/afterTaskDoneUndone', {
                    status: task.status == 'complete' || task.status === true ? 1 : 0,
                    task: task,
                    list_id: task.task_list.data.id,
                    task_id: task.id
                });
            },
          
            updateSingleTask (task) {

                if(task.status == 'complete' || task.status === true) {
                    this.afterTaskDoneUndone(task);
                } else {
                    this.setTaskDefaultData(task);
                    this.$store.commit('projectTaskLists/afterUpdateTask', {
                        task: task,
                        list_id: task.task_list.data.id
                    });
                }

                this.$store.commit('projectTaskLists/updateSingleTaskActiveMode', false);
                
            },

            setTaskDefaultData (task) {
                var lists = this.$store.state.projectTaskLists.lists;
                var list_index = this.getIndex( lists, task.task_list.data.id, 'id' );
            
                if (list_index === false) {
                    return;
                }
                
                if ( task.status === 'incomplete' || task.status === false ) {
                    var task_index = this.getIndex( 
                            lists[list_index].incomplete_tasks.data, 
                            task.id, 
                            'id' 
                    );

                    var prevTask = lists[list_index].incomplete_tasks.data[task_index];
                    
                    if(prevTask) {
                        task.sub_task_content = prevTask.sub_task_content;
                        task.edit_mode = prevTask.edit_mode;
                    }
                }
            },
           
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
                        self.setSearchLists( this.$store.state.projectTaskLists.lists );
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
            },
            changeFilterStatus (status) {
                this.filterStatus = status;
            },

            taskFilter () {
                var self = this;

                var query = {
                    users: this.filterUsersId(this.defaultUser),
                    lists: this.filterListsId(this.defaultList),
                    dueDate: this.dueDate.id,
                    status: this.filterStatus,
                    filterTask: 'active'
                }

                //var queryPaprams = this.setQuery(query);
                
                this.$router.push({
                    query: query
                });

                this.filterRequent();
            },

            filterRequent () {
                var self = this;
                
                self.httpRequest({
                    url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/filter',
                    type: 'POST',
                    data: self.$route.query,
                    success (res) {

                        if(!res.data.length) {
                            pm.Toastr.success(self.__('No Result Found!', 'wedevs-project-manager'));
                            //return;
                        }
                        
                        res.data.map(function(list,index) {
                        self.addMetaList(list);

                        if ( typeof list.incomplete_tasks !== 'undefined' ) {
                            list.incomplete_tasks.data.map(function(task) {
                                self.addTaskMeta(task);
                            });
                        }

                        if ( typeof list.complete_tasks !== 'undefined' ) {
                                list.complete_tasks.data.map(function(task) {
                                    self.addTaskMeta(task);
                                });
                            }
                        });
                        self.$root.$store.state.projectTaskListLoaded = true;
                        self.$store.commit('projectTaskLists/setLists', res.data);
                        self.$store.commit('projectTaskLists/setListsMeta', res.meta.pagination);

                        self.$store.commit( 'projectTaskLists/balankTemplateStatus', false);
                        self.$store.commit( 'projectTaskLists/listTemplateStatus', true);
                    }
                });
            },

            filterUsersId (users) {
                var ids = [];

                ids.push(users.id);

                return ids;
            },

            filterListsId (lists) {
                var ids = [];

                ids.push(lists.id);

                return ids;
            }

        },

    }
</script>
