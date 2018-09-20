<template>
    <div class="pm-wrap pm pm-front-end todo-lists-wrap">
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

            <default-list-page v-if="is_blank_Template && !isActiveFilter"></default-list-page>
            
            <div v-if="is_list_Template" id="pm-task-el" class="pm-task-container">
                <div class="pm-inline-list-wrap">
                    <div class="pm-inline-list-element" v-if="can_create_list">
                        <new-task-list-btn></new-task-list-btn>
                        
                    </div>
                    <div class="pm-right-inline-list-element">
                        <div class="list-filter">

                            <a v-pm-tooltip :title="__('Filter', 'wedevs-project-manager')" @click.prevent="showFilter()" href="#"><span class="icon-pm-filter"></span></a>
                        </div>
                        <pm-do-action :hook="'pm-inline-list-button'"></pm-do-action>
                           
                    </div>
                    <!-- <div class="pm-clearfix"></div> -->
                </div>
                <transition name="slide" v-if="can_create_list">
                    <new-task-list-form section="lists" v-if="is_active_list_form" :list="{}"></new-task-list-form>
                </transition>
                
                <div class="pm-flex todo-lists">
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

                                        <!-- v-if="list.can_del_edit" -->
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

                    <div v-if="isActiveFilter && !filterResults">{{__('No Result Found!', 'wedevs-project-manager')}}</div>
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
                                <div>
                                    <a class="complete-btn" @click.prevent="changeFilterStatus('complete')" href="#">
                                        <span>{{__('Completed', 'wedevs-project-manager')}}</span>
                                    </a>
                                    <a class="on-going-btn" @click.prevent="changeFilterStatus('incomplete')" href="#">{{__('On-going', 'wedevs-project-manager')}}</a>
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
                            <input type="submit" class="button-primary" name="submit_todo" :value="__('Done', 'wedevs-project-manager')">
                        </form>
                    </div>
                </div>
                <pm-pagination 
                    :total_pages="total_list_page" 
                    :current_page_number="current_page_number" 
                    :component_name="$route.name + '_pagination'">
                    
                </pm-pagination> 
            </div>
            <router-view name="single-task"></router-view>
            
            
        </div>
        
    </div>
</template>
    
<style lang="less">
    .todo-lists-wrap {
        .todo-lists {
            position: relative;
            align-items: baseline !important;
            .pm-todolists {
                width: 100%;
                .list-right-action {
                    display: flex;
                    align-items: center;
                    a {
                        margin-right: 5px;
                    }
                }
            }
            .optimizeWidth {
                width: 80%;
            }
            .list-search-menu {
                width: 25%;
                padding: 10px;
                background: #fff;
                border-right: 1px solid #e5e5e5;
                border-top: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;

                .complete-btn {
                    padding: 6px 15px;
                    border-radius: 3px;
                    background: #f8f3f9;
                    color: #9B59CA;
                }

                .on-going-btn {
                    padding: 6px 15px;
                    border-radius: 3px;
                    background: #fdedf0;
                    color: #E9485E;
                }

                .margin-top {
                    margin-top: 20px;
                    color: #000;
                }

                .margin-title {
                    margin-bottom: 5px;
                }

                .filter-title {
                    display: flex;
                    align-items: center;

                    a {
                        margin-right: 7px;
                        color: #848484;
                    }

                    .task-filter {
                        color: #000;
                    }
                }
            }
        }
    }

    .pm-entry-detail {
        font-family: Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
    }
    .pm-inline-list-wrap .pm-right-inline-list-element {
        display: flex;
        align-items: center;
        .list-filter {
            a {
                background: #fff;
                border: 1px solid #ddd;
                border-right: none;
                padding: 2px 10px;
                color: #d5d5d5;

                &:hover {
                    .icon-pm-filter {
                        color: #423e3f;
                    }
                }
            }
        }

        .pm-action-wrap {
            display: flex;
            align-items: center;
        }
    }
    .pm-inline-list-wrap {
        width: 100%;
        display: flex;
        align-items: center;
    }
    .pm-inline-list-element {
        flex: 1;
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
    import date_picker from './date-picker.vue';

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
            'pm-datepickter': date_picker
            
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
                isActiveFilter: false,
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
                searchLists: [],
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

                if(project) {
                    project.assignees.data.splice(0, 1, {
                        id: 0,
                        display_name: this.__('All', 'wedevs-project-manager')
                    })
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
            }

        },

        created () {
            pmBus.$on('pm_before_destroy_single_task', this.updateSingleTask);
            pmBus.$on('pm_generate_task_url', this.generateTaskUrl);

            if(this.$route.query.filterTask == 'active') {
                this.filterRequent();
            } 
        },

        methods: {
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
                console.log(query);
                this.$router.push({
                    query: query
                });

                this.filterRequent();
            },

            filterRequent () {
                var self = this;
                console.log(self.$route.query);
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
