<template>
    <div  class="pm-task-list-wrap">
        <pm-header></pm-header>
        <pm-menu></pm-menu>

        <div v-if="listViewType" class="list-content-wrap">
            <div class="list-content-body">
                <div class="content">
                    <div class="list-action-btn-wrap">
                        <div class="new-list-btn" >
                            <a v-if="can_create_list  && !isArchivedPage" @click.prevent="showHideListForm('toggle')" href="#" class="list-action-group add-list">
                                <span class="plus">+</span>
                                <span>{{ __('Add Task List', 'wedevs-project-manager') }}</span>
                            </a>

                            <new-task-list-form v-if="is_active_list_form && can_create_list  && !isArchivedPage"></new-task-list-form>
                            
                        </div>
                        
                        <pm-do-action :hook="'pm-inline-list-button'"></pm-do-action>
                        <div>
                            <a :class="isActiveTaskFilter() + ' list-action-group task-filter-btn'" v-pm-tooltip :title="__('Task Filter', 'wedevs-project-manager')" @click.prevent="showFilter()" href="#">
                                <span class="icon-pm-filter"></span>
                                <span>{{__('Filter', 'wedevs-project-manager')}}</span>
                            </a>
                        </div>
                    </div>

                    <div class="task-field" v-if="can_create_task && !isArchivedPage">
                        <new-task-form  :list="list" :focus="true"></new-task-form>
                    </div>

                    <div class="list-items">

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

                        <ul v-if="hasSearchContent() && isListFetch" v-pm-list-sortable :class="filterActiveClass()+ ' pm-todolists'">
                        
                            <li  v-for="list in lists" :key="list.id" :data-id="list.id"  :class="taskListClass(list.id)">

                                <div class="list-content">
                                    <div class="list-item-content">
                                        <div class="before-title">
                                            <span v-if="!isInbox(list.id)" class="pm-list-drag-handle icon-pm-drag-drop"></span>
                                            <span v-if="!list.expand" @click.prevent="listExpand(list)" :class="inboxClass(list) + ' icon-pm-down-arrow'"></span>
                                            <span v-if="list.expand" @click.prevent="listExpand(list)" :class="inboxClass(list) + ' icon-pm-up-arrow'"></span>
                                        </div>

                                        <div class="list-title">
                                            <span @click.prevent="listExpand(list)" class="list-title-anchor">{{ list.title }}</span>
                                        </div>
                                        <div class="after-title">
                                                <!-- v-pm-tooltip -->
                                                <div class="view-single-list"  :title="__('Single List', 'wedevs-project-manager')">
                                                    <span @click.prevent="goToSigleList(list)" class="icon-pm-eye"></span>
                                                </div>
                                                <div class="list-title-action progress-bar">
                                                    <div :style="getProgressStyle( list )" class="bar completed"></div>
                                                </div>
                                                   
                                                <!-- never remove <div class="pm-progress-percent">{{ getProgressPercent( list ) }}%</div> -->
                                                <div class="list-title-action task-count">
                                                    <span>{{ list.meta.total_complete_tasks }}</span>/<span>{{ getTotalTask(list.meta.total_complete_tasks, list.meta.total_incomplete_tasks) }}</span>
                                                </div>

                                                <div v-if="!isInbox(list.id) && PM_Vars.is_pro" class="list-title-action">
                                                    <span v-if="!parseInt(list.meta.privacy)" class="icon-pm-unlock"></span>
                                                    <span v-if="parseInt(list.meta.privacy)" class="icon-pm-private"></span>
                                                </div>
                                            
                                        </div>

                                        <div v-if="!isInbox(list.id) && can_edit_task_list(list)" :data-list_id="list.id" class="more-menu list-more-menu">

                                            <span @click="showHideMoreMenu(list)" class="icon-pm-more-options"></span>
                                            <div v-if="list.moreMenu && !list.edit_mode"  class="more-menu-ul-wrap">
                                                <ul>
                                                    <li class="first-li" v-if="!isArchivedList(list)">
                                                        <a @click.prevent="showEditForm(list)" class="li-a" href="#">
                                                            <span class="icon-pm-pencil"></span>
                                                            <span>{{ __('Edit', 'wedevs-project-manager') }}</span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a @click.prevent="deleteSelfList( list )" class="li-a" href="#">
                                                            <span class="icon-pm-delete"></span>
                                                            <span>{{ __('Delete', 'wedevs-project-manager') }}</span>
                                                        </a>
                                                    </li>
                                                    <pm-do-action hook="list-action-menu" :actionData="list"></pm-do-action>

                                                </ul>
                                            </div>

                                            <div v-if="list.edit_mode" class="list-update-warp">
                                                <new-task-list-form section="lists" :list="list" ></new-task-list-form>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="list.expand" class="list-description">
                                    <span v-if="!isInbox(list.id)" v-html="list.description"></span>
                                    <span v-if="isInbox(list.id)">{{ __('This is a system default task list. Any task without an assigned tasklist will appear here.', 'wedevs-project-manager') }}</span>
                                </div>

                                <list-tasks v-if="list.expand" :list="list"></list-tasks>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- <div class="todos-wrap no-task">
                        <span>{{ __( 'No result Found', 'wedevs-project-manager') }}</span>

                    </div> -->
                </div>

                <div class="list-search-menu" v-if="isActiveFilter">
                    <div class="filter-title">
                        <div>
                            <a @click.prevent="showFilter()" href="#" class="icon-pm-cross"></a>
                            <span class="active-task-filter">{{__('Task Filter', 'wedevs-project-manager')}}</span>
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
                                        :options="searchProjectUsers" 
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
        </div>
        <router-view name="single-task"></router-view> 
        <pm-pagination 
            :total_pages="total_list_page" 
            :current_page_number="current_page_number" 
            :component_name="paginationComponent">
            
        </pm-pagination> 
        
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
                                        

                                        </router-link>

                                        <div class="pm-right" v-if="can_edit_task_list(list)">
                                            <div class="list-right-action">
                                                <a href="#" v-pm-tooltip v-if="list.status == 'current'" @click.prevent="showEditForm(list)" class="" :title="__('Edit', 'wedevs-project-manager')"><span class="dashicons dashicons-edit"></span></a>
                                                <a href="#" v-pm-tooltip :title="__('Delete', 'wedevs-project-manager')" class="pm-btn pm-btn-xs" @click.prevent="deleteSelfList( list )"><span class="dashicons dashicons-trash"></span></a>
                                                <a href="#" v-pm-tooltip :title="helpTextPrivate(list.meta.privacy)"  @click.prevent="listLockUnlock(list)" v-if="PM_Vars.is_pro && user_can('view_private_list') && list.status == 'current'"><span :class="privateClass( list.meta.privacy )"></span></a>
                                                <pm-do-action hook="list-action-menu" :actionData="list"></pm-do-action>

                                            <router-link :to="{ 
                                                name: 'single_list', 
                                                params: { 
                                                    list_id: list.id 
                                                }}">
                                            {{ list.title }}
                                            
                                            </router-link>

                                            
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
                                        
                                        <transition name="slide" v-if="can_edit_task_list(list) || isArchivedList(list)">
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
                        <span>{{__('No results found.', 'wedevs-project-manager')}}</span>
                    </div>
                    <div class="list-search-menu" v-if="isActiveFilter">
                        <div class="filter-title">
                            <span><a @click.prevent="showFilter()" href="#">X</a></span>
                            <span class="active-task-filter">{{__('Task Filter', 'wedevs-project-manager')}}</span>
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
        .pm-ui-state-highlight {
            background: none !important;
            border: 1px dashed #d7dee2 !important;
            min-height: 50px !important;
            margin: 0 20px !important;
        }
        .list-content-body {
            display: flex;
            background: #FAFAFA;

            .content {
                flex: 5;
                border: 1px solid #E5E4E4;
                border-top: none;
                
                .pm-task-form {
                    .new-task-description {
                        width: 99.8%;
                    }
                    .mce-tinymce {
                        border-top: none;
                        box-shadow: none;
                    }
                    .update-button {
                        position: absolute;
                        right: 0;
                        top: 0px;
                        background: #fafafa !important;
                        color: #fff !important;
                        font-size: 12px;
                        font-weight: bolder;
                        padding: 5px 8px !important;
                        border: 1px solid #ddd;

                        &:hover {
                            background: #d7dee2 !important;
                        }

                        .icon-pm-check-circle {
                            &:before {
                                color: #999;
                            }
                        }
                    }
                }
                .task-field {
                    padding: 0 20px;
                    margin-top: 2px;

                    .task-input {
                        height: 35px;
                        width: 100%;
                        border-radius: 3px;
                        border: 1px solid #e5e4e4;

                        &::placeholder {
                            color: #B5C0C3;
                            font-size: 12px;
                            padding-left: 5px;
                            font-weight: 300;
                        }
                    }
                }

                .list-items {
                    margin-top: 15px;
                    margin-bottom: 20px;
                    .list-description {
                        margin-left: 50px;
                        margin-right: 20px;
                        font-style: italic;
                        font-weight: 300;
                        font-size: 12px;
                        word-wrap: break-word;
                        word-break: break-all;
                        hyphens: auto;
                    }
                    .list-li {
                        margin-bottom: 10px;
                    }

                    .task-group {
                        .complete-task-ul{
                            .pm-todo-wrap {
                                margin: 0 33px 0 52px !important;
                            }
                        }

                        .pm-todo-wrap {
                            margin: 0 36px !important;
                            margin-right: 32px !important;
                        }

                        .more-task-wrap { 
                            margin-left: 52px;
                        }
                        .list-task-form  {
                            margin: 0 20px 0 52px;
                        }
                    }

                    .list-li>.list-content {
                        &:hover {
                            border-top: 1px solid #e5e4e4;
                            border-bottom: 1px solid #e5e4e4;
                            background: #fff;

                            .list-more-menu {
                                .icon-pm-more-options {
                                    &:before {
                                        color: #d6d6d6;
                                    }
                                }
                            }
                        }
                    }
                    .list-content {
                        padding: 5px 0;
                        border-top: 1px solid #fafafa;
                        border-bottom: 1px solid #fafafa;
                        word-break: break-all;
                        word-wrap: break-word;
                        hyphens: auto;

                        .list-item-content {
                            display: flex;
                            align-items: baseline;
                            padding: 0 20px 0 0;

                            .before-title {
                                .inbox-list {
                                    padding: 0 26px;
                                    position: relative;
                                    top: -2px;
                                }
                                .icon-pm-drag-drop {
                                    cursor: grab;
                                    padding: 0 10px;
                                    
                                    &:before {
                                        color: #fafafa;
                                    }
                                }

                                .icon-pm-up-arrow, .icon-pm-down-arrow {
                                    width: 25px;
                                    cursor: pointer;
                                    display: flex;

                                    &:before {
                                        color: #047098;
                                        font-size: 7px;
                                        font-weight: bold;
                                    }
                                }
                            }

                            .before-title, .after-title {
                                display: flex;
                                align-items: center;
                                white-space: nowrap;
                            }
                            .after-title {
                                position: relative;
                                top: 2px;

                                .view-single-list {
                                    cursor: pointer;
                                    &:hover {
                                        .icon-pm-eye {
                                            &:before {
                                                color: #000;
                                            }
                                        }
                                    }
                                }

                                .icon-pm-unlock {
                                    &:before {
                                        color: #d7dee2;
                                    }
                                }
                                .icon-pm-private {
                                    &:before {
                                        color: #d7dee2;
                                    }
                                }
                                .list-title-action {
                                    margin-left: 12px;
                                }
                            }
                            .list-title {
                                cursor: pointer;
                            }
                            .more-menu {
                                padding: 0 12px;
                                position: relative;
                                display: flex;
                                flex: 1;
                                justify-content: flex-end;
                                position: relative;
                                top: 2px;

                                .icon-pm-more-options {
                                    padding: 0 10px;
                                    cursor: pointer;
                                    &:before {
                                        color: #fafafa;
                                    }
                                }

                                &:hover {
                                    .icon-pm-more-options {
                                        &:before {
                                            color: #6d6d6d;
                                        }
                                    }
                                }

                                .more-menu-ul-wrap, .list-update-warp {
                                    position: absolute;
                                    top: 31px;
                                    left: auto;
                                    right: -6px;
                                    z-index: 9999;
                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                                    border: 1px solid #DDDDDD;
                                    background: #fff;
                                    border-radius: 3px;
                                    box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                                    &:before {
                                        border-color: transparent transparent #DDDDDD transparent;
                                        position: absolute;
                                        border-style: solid;
                                        top: -9px;
                                        right: 11px;
                                        content: "";
                                        z-index: 9999;
                                        border-width: 0px 8px 8px 8px;
                                    }

                                    &:after {
                                        border-color: transparent transparent #ffffff transparent;
                                        position: absolute;
                                        border-style: solid;
                                        top: -7px;
                                        right: 11px;
                                        content: "";
                                        z-index: 9999;
                                        border-width: 0 8px 7px 8px;
                                    }
                                    .first-li {
                                        margin-top: 6px;
                                    }

                                    .li-a {
                                        display: inline-block;
                                        width: 100%;
                                        padding: 0 30px 0 12px;
                                        color: #7b7d7e;
                                        font-weight: 400;
                                        font-size: 12px;
                                        white-space: nowrap;
                                    }

                                    .icon-pm-pencil, .icon-pm-delete, .li-a-icon {
                                        display: inline-block;
                                        width: 20px;
                                    }
                                }

                                .more-menu-ul-wrap {
                                    right: 3px;
                                }

                                .list-update-warp {
                                    width: 300px;

                                    form {
                                        padding: 10px;

                                        .submit {
                                            padding: 0;
                                            margin: 0;
                                            display: flex;
                                            align-items: center;
                                            justify-content: flex-end;

                                            .list-cancel {
                                                width: auto !important;
                                            }
                                        }
                                        .pm-secondary {
                                            width: auto !important;
                                            margin-left: 10px !important;
                                        }
                                        .title-field, .description-field, .milestone-field, .pm-action-wrap {
                                            width: 100%;
                                            margin-bottom: 15px !important;
                                            border-radius: 3px;
                                            display: inline-block;
                                        }
                                        .pm-make-privacy {
                                            line-height: 0;
                                            label {
                                                line-height: 0;
                                            }
                                        }
                                        .content {
                                            border: none !important;
                                        }

                                    }
                                }

                            }
                        }

                        .progress-bar {
                            width: 52px;
                            background: #D7DEE2;
                            height: 5px;
                            border-radius: 3px;

                            .completed {
                                background: #1A9ED4;
                                height: 5px;
                                border-radius: 3px;
                            }
                        }
                        .task-count {
                            font-size: 12px;
                            color: #A5A5A5;
                        }
                        .list-title-anchor {
                            font-size: 14px;
                            color: #047098;
                            font-weight: 600;
                            margin-right: 40px;
                            position: relative;
                            top: 1px;
                        }

                        &:hover {
                            .list-item-content .icon-pm-drag-drop {
                                &:before {
                                    color: #bababa;
                                }

                            }
                        }
                    }
                }

                .list-action-btn-wrap {
                    display: flex;
                    align-items: center;
                    padding: 20px;
                    flex-wrap: wrap;

                    .list-action-group {
                        height: 30px;
                        font-size: 12px;
                        padding: 0 13px;
                        border-radius: 3px;
                        white-space: nowrap;
                    }

                    .active-task-filter {
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

                    .task-filter {
                        display: flex;
                        align-items: center;
                        height: 30px;
                        color: #788383;
                        padding: 0 13px;
                        border-radius: 3px;
                        font-size: 12px;
                        border: 1px solid #e4e5e5;
                        background: #fff;

                        &:hover {
                            border-color: #1A9ED4 !important;
                            color: #1A9ED4;

                            .icon-pm-filter {
                                color: #1A9ED4;
                            }
                        }

                        .icon-pm-filter {
                            margin-right: 5px;
                            color: #d4d6d6;
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
                        position: relative;
                        .list-form {
                            position: absolute;
                            top: 40px;
                            width: 50%;
                            left: auto;
                            z-index: 9999;
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                            border: 1px solid #DDDDDD;
                            background: #fff;
                            border-radius: 3px;
                            box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                            &:before {
                                border-color: transparent transparent #DDDDDD transparent;
                                position: absolute;
                                border-style: solid;
                                top: -9px;
                                left: 28px;
                                content: "";
                                z-index: 9999;
                                border-width: 0px 8px 8px 8px;
                            }

                            &:after {
                                border-color: transparent transparent #ffffff transparent;
                                position: absolute;
                                border-style: solid;
                                top: -7px;
                                left: 28px;
                                content: "";
                                z-index: 9999;
                                border-width: 0 8px 7px 8px;
                            }
                            form {
                                padding: 10px;

                                .submit {
                                    padding: 0;
                                    margin: 0;
                                    display: flex;
                                    align-items: center;
                                    justify-content: flex-end;
                                    
                                    .list-cancel {
                                        width: auto !important;
                                    }
                                }
                                .pm-secondary {
                                    width: auto !important;
                                    margin-left: 10px !important;
                                }
                                .title-field, .description-field, .milestone-field, .pm-action-wrap {
                                    width: 100%;
                                    margin-bottom: 15px;
                                    border-radius: 3px;
                                }
                                .pm-make-privacy {
                                    line-height: 0;
                                    label {
                                        line-height: 0;
                                    }
                                }
                                .content {
                                    border: none !important;
                                }
                            }
                        }
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
                            margin: 0 3px 0 15px;
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

                        .icon-pm-list-view {
                            margin-right: 5px;

                            &:before {
                                vertical-align: middle;
                                color: #d7dee2;

                            }
                        }

                        .active-list-header-btn {
                            border-color: #1A9ED4 !important;
                            color: #1A9ED4;

                            .icon-pm-archive {
                                &:before {
                                    color: #1A9ED4 !important;
                                }
                            }

                            .icon-pm-list-view {
                                &:before {
                                    color: #1A9ED4;
                                }
                            }
                        } 
                    }
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
        @media screen and (max-width: 480px) {
            .list-content-wrap {
                display: block;
                .list-content-body {
                    flex-direction: column-reverse;
                }

                .content {
                    .list-items {
                        .list-content {
                            .list-item-content {
                                .before-title  {
                                    .icon-pm-drag-drop {
                                        padding: 0 5px;
                                    }

                                    .inbox-list {
                                        padding: 0 26px 0 17px;
                                    }
                                }
                            }
                        }
                    } 
                    .list-action-btn-wrap {
                        padding: 20px 10px;
                        .list-action-wrap {
                            margin-top: 10px;
                        }
                        .task-filter-btn {
                            margin-top: 10px;
                        }
                        .pm-action-wrap {
                            margin-top: 10px;
                        }
                    } 
                    .task-field {
                        padding: 0 10px;
                    }
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
    import new_task_form from './new-task-form.vue';

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
            'pm-menu': Menu,
            'new-task-form': new_task_form,
        },

        mixins: [Mixins],

        /**
         * Initial data for this component
         * 
         * @return obj
         */
        data () {
            return {
                isActiveListForm: false,
                list: {},
                index: false,
                project_id: this.$route.params.project_id,
                current_page_number: this.$route.params.current_page_number || 1,
                isActiveFilter: false,
                defaultList: {
                    id: 0,
                    title: this.__('Any', 'wedevs-project-manager')
                },
                defaultUser: {
                    id: 0,
                    display_name: this.__('Any', 'wedevs-project-manager')
                },
                filterDueDate: '',
                filterStatus: '',
                dueDates: [
                    {
                        'id': '0',
                        'title': this.__('Any', 'wedevs-project-manager'),
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
                    'title': this.__('Any', 'wedevs-project-manager'),
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
                    } else if(  meta.list_view_type.meta_value == "kanboard") {
                        self.$router.push({
                            name: 'kanboard'
                        });
                    } else if(  meta.list_view_type.meta_value == "archive") {
                        self.getSelfLists();
                    }

                    return true;
                }

                return false;
            },
            projectUsers () {
                let project = this.$store.state.project;

                if(project.assignees) {

                    return project.assignees.data;
                }

                return [];
            },
            searchProjectUsers () {
                let project = this.$store.state.project;
                

                if(project.assignees) {
                    let assignees = project.assignees.data.slice();

                    if(assignees[0].display_name != 'All' ) {

                        assignees.unshift(
                            {
                                id: 0,
                                display_name: this.__('All', 'wedevs-project-manager')
                            }
                        );
                    }

                    return assignees;
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
            window.addEventListener('click', this.windowActivity);
            
            if(this.$route.query.filterTask == 'active') {
                this.setSearchData();
                this.isActiveFilter = true;
                this.filterRequent();
            } 
        },

        methods: {
            goToSigleList (list) {
                this.$router.push({
                    name: 'single_list',
                    params: { 
                        project_id: this.project_id,
                        list_id: list.id
                    }
                });
            },

            inboxClass (list) {
                return this.isInbox(list.id) ? 'inbox-list' : '';
            },
            isActiveTaskFilter () {
                return this.isActiveFilter ? 'active-task-filter' : 'task-filter';
            },
            showHideMoreMenu (list) {

                this.lists.forEach(function(taskList) {
                    if(taskList.id != list.id) {
                        taskList.moreMenu = false;
                    }
                });
                
                list.moreMenu = list.moreMenu ? false : true; 
            },
            windowActivity (el) {
                var listForm = jQuery(el.target).closest('.new-list-btn'),
                    listActionWrap = jQuery(el.target).closest('.list-more-menu');
                
                if(!listActionWrap.length) {
                    this.lists.forEach(function(list) {
                        list.moreMenu = false;
                    });
                }

                if(!listForm.length) {
                    this.showHideListForm(false);
                }
            },
            listExpand (list) {
                list.expand = list.expand ? false : true;
                this.$store.commit('projectTaskLists/expandList', list.id);
            },
            getTotalTask (incomplete, complete) {
                return parseInt(incomplete)+parseInt(complete);
            },
            taskListClass (list_id) {
                let listcalss = 'pm-list-sortable list-li pm-fade-out-' + list_id;

                if ( this.isInboxList( list_id ) ) {
                    listcalss += ' listindex'
                }
                return listcalss;
            },
            afterFetchProject (project) {

                //set filter search user
                if(this.$route.query.filterTask == 'active') {
                    let index = this.getIndex(this.projectUsers, this.$route.query.users, 'id');
                    if ( index  ) {
                        this.defaultUser = project.assignees.data[index];
                    }
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

                if(this.isActiveFilter == false && this.$route.query.hasOwnProperty('filterTask')) {
                    
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
                            pm.Toastr.success(self.__('No results found.', 'wedevs-project-manager'));
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
