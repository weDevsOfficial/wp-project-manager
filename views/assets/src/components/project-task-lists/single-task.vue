<template>
    <div id="pm-single-task-wrap" class="pm-single-task-wrap">
        <div class="nonsortable">

            <div v-if="loading" class="modal-mask half-modal pm-task-modal modal-transition">

                <div class="pm-data-load-before" >
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

            </div>

            <div v-else class="popup-mask">

                <div class="popup-container">
                    <span class="close-modal">
                        <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                    </span>

                    <div v-activity-load-more class="popup-body">
                        <div class="pm-single-task-header">

                            <div class="task-complete-incomplete" :class="{ 'disable': can_complete_task(task) }">
                                <a class="completed" v-if="task.status" href="#" @click.prevent="singleTaskDoneUndone()">
                                    <span class="icon-pm-completed pm-font-size-16" v-if="!show_spinner_status"></span>
                                    <span class="pm-spinner" v-if="show_spinner_status"></span>
                                    {{ __( 'Completed', 'wedevs-project-manager' ) }}
                                </a>

                                <a class="incomplete" v-if="!task.status" href="#" @click.prevent="singleTaskDoneUndone()">
                                    <span class="icon-pm-incomplete pm-font-size-16" v-if="!show_spinner_status"></span>
                                    <span class="pm-spinner" v-if="show_spinner_status"></span>
                                    {{ __( 'Mark Complete', 'wedevs-project-manager' ) }}
                                </a>

                            </div>

                            <div class="created-by">
                                <span class="pm-light-color">{{ __('Created by', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color">{{ ucfirst( task.creator.data.display_name ) }}</span>
                                <span class="pm-light-color">{{ __('on', 'wedevs-project-manager') }}</span>
                                <span class="pm-dark-color" :title="getFullDate(task.created_at.datetime)">{{ cratedDateFormat( task.created_at.date ) }}</span>
                            </div>

                            <div id="pm-action-menu" class="task-action">
                                <span style="font-size: 17px;" @click.prevent="showMenu()" class="icon-pm-more-options pm-font-size-16"></span>
                                <div  v-if="isActiveMenu" class="action-menu">
                                    <ul class="action-menu-ul">
                                        <li class="pm-dark-hover">
                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-copy pm-font-size-13" @click.prevent="copyUrl(task)" href="#">
                                                <span class="title-anchor-menu">{{ __('Copy Link', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>

                                        <li v-if="can_edit_task(task) || isArchivedTaskList(task)">

                                            <a class="pm-dark-hover title-anchor-menu-a icon-pm-delete pm-font-size-13" @click.prevent="selfDeleteTask({task: task, list: list})" href="#">
                                                <span class="action-menu-span title-anchor-menu">{{ __('Delete', 'wedevs-project-manager') }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                        
                        <div :class="singleTaskTitle(task) + ' task-title-wrap'">
                            <div class="task-title-text">

                                <span v-if="is_task_title_edit_mode && can_edit_task(task)">
                                    <input
                                        v-model="task.title"
                                        maxlength="200" 
                                        @blur="updateTaskTitle(task)"
                                        @keyup.enter="updateTaskTitle(task)"
                                        @keyup="warningTitleCharacterLimit()"
                                        class="pm-task-title-activity pm-task-title-field"
                                        type="text" 
                                    />
                                    <span class="pm-spinner" v-if="show_spinner"></span>
                                </span>

                                <span
                                    :class="lineThrough(task) + ' pm-task-title-activity pm-task-title-span'"
                                    v-if="!is_task_title_edit_mode"
                                    @click.prevent="isTaskTitleEditMode()">
                                    {{ ucfirst(task.title) }}
                                </span>

                            </div>
                        </div>

                        <div class="task-list-title-wrap" v-if="task.task_list.data">
                            <div class="task-list-title-text">
                                <span >
                                    {{ __("Task List:", 'wedevs-project-manager' ) }}
                                </span>
                                <strong class="list-title">
                                    {{ task.task_list.data.title }}
                                </strong>
                            </div>
                        </div>

                        <div class="pm-flex options-wrap actions-wrap">
                            <div class="assigne-users context">
                                <h3 class="label">{{ __( 'Members', 'wedevs-project-manager' ) }}</h3>
                               <!--  <div 
                                    v-if="task.assignees.data.length" 
                                    class='pm-assigned-user' 
                                    v-for="user in task.assignees.data" 
                                    :key="user.id"
                                >

                                    <a :href="userTaskProfileUrl(user.id)" :title="user.display_name">
                                        <img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                    </a>
                                </div> -->
                                
                                <div 
                                    :class="classnames({
                                        ['process-1']: !task.assignees.data.length,
                                        ['data-active']: task.assignees.data.length
                                    })"
                                >
                                    <div 
                                        class="process-results user-images" 
                                        v-if="task.assignees.data.length"
                                    >
                                        <div 
                                            v-pm-tooltip 
                                            :title="user.display_name" 
                                            class="image" 
                                            v-for="user in task.assignees.data"
                                            @click.prevent="deleteUser(user)"
                                        >

                                            <span class="cross"><i><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 241.171 241.171" style="enable-background:new 0 0 241.171 241.171;" xml:space="preserve"><path id="Close" d="M138.138,120.754l99.118-98.576c4.752-4.704,4.752-12.319,0-17.011c-4.74-4.704-12.439-4.704-17.179,0 l-99.033,98.492L21.095,3.699c-4.74-4.752-12.439-4.752-17.179,0c-4.74,4.764-4.74,12.475,0,17.227l99.876,99.888L3.555,220.497 c-4.74,4.704-4.74,12.319,0,17.011c4.74,4.704,12.439,4.704,17.179,0l100.152-99.599l99.551,99.563 c4.74,4.752,12.439,4.752,17.179,0c4.74-4.764,4.74-12.475,0-17.227L138.138,120.754z"/></svg></i></span>
                                            
                                            <img 
                                                :title="user.display_name"
                                                :src="user.avatar_url"
                                            />
                                        </div>
                                    </div>

                                    <pm-popper 
                                        trigger="click" 
                                        :options="popperOptions()"
                                        v-if="has_task_permission()"
                                    >
                                        <div class="pm-popper popper">
                                            <div class="pm-multiselect-top pm-multiselect-subtask-task">
                                                <div class="pm-multiselect-content">
                                                    <multiselect
                                                        ref="assingTask"
                                                        id="assingTask"
                                                        v-model="task_assign"
                                                        :options="project_users"
                                                        :multiple="true"
                                                        :close-on-select="false"
                                                        :clear-on-select="true"
                                                        :show-labels="true"
                                                        :searchable="true"
                                                        :placeholder="__('Search User', 'wedevs-project-manager')"
                                                        select-label=""
                                                        selected-label="selected"
                                                        deselect-label=""
                                                        label="display_name"
                                                        track-by="id"
                                                        :allow-empty="true">


                                                        <template slot="option" slot-scope="props">
                                                            <img class="option__image" :src="props.option.avatar_url">
                                                            <div class="option__desc">
                                                                <span class="option__title">{{ props.option.display_name }}</span>
                                                            </div>
                                                        </template>
                                                    </multiselect>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <!-- popper trigger element -->
                                        <div class="process-text-wrap" slot="reference"> 
                                            <a 
                                                class="display-flex process-btn"
                                                href="#"  
                                                @click.prevent="isEnableMultiSelect()"
                                            >
                                                <i>
                                                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="598.769px" height="598.77px" viewBox="0 0 598.769 598.77" style="enable-background:new 0 0 598.769 598.77;" xml:space="preserve"> <g> <g> <path d="M161.196,253.695c16.274,6.884,33.538,10.374,51.31,10.374s35.035-3.49,51.31-10.374 c15.698-6.64,29.787-16.136,41.876-28.225c12.089-12.089,21.585-26.179,28.225-41.876c6.884-16.275,10.374-33.538,10.374-51.309 c0-17.772-3.49-35.035-10.374-51.31c-6.64-15.698-16.136-29.787-28.225-41.876c-12.089-12.089-26.178-21.585-41.876-28.225 C247.541,3.99,230.278,0.5,212.506,0.5s-35.035,3.49-51.31,10.374c-15.698,6.64-29.787,16.136-41.876,28.225 c-12.089,12.089-21.585,26.178-28.224,41.876c-6.884,16.275-10.374,33.538-10.374,51.31c0,17.771,3.49,35.035,10.374,51.309 c6.639,15.698,16.135,29.788,28.224,41.876C131.409,237.559,145.499,247.055,161.196,253.695z M212.506,43.34 c49.123,0,88.945,39.822,88.945,88.945c0,49.123-39.822,88.944-88.945,88.944s-88.944-39.822-88.944-88.944 C123.562,83.162,163.383,43.34,212.506,43.34z"/> <path d="M212.506,264.569c-17.84,0-35.168-3.503-51.504-10.414c-15.757-6.665-29.9-16.197-42.035-28.332 c-12.135-12.134-21.667-26.277-28.331-42.035c-6.91-16.336-10.414-33.664-10.414-51.504c0-17.839,3.503-35.167,10.414-51.504 c6.664-15.757,16.195-29.899,28.331-42.035c12.135-12.135,26.278-21.667,42.035-28.332C177.338,3.503,194.667,0,212.506,0 s35.168,3.503,51.504,10.414c15.757,6.664,29.899,16.197,42.035,28.332c12.135,12.134,21.667,26.277,28.332,42.035 c6.909,16.336,10.413,33.665,10.413,51.504c0,17.839-3.504,35.167-10.413,51.504c-6.666,15.758-16.198,29.901-28.332,42.035 c-12.135,12.135-26.278,21.667-42.035,28.332C247.674,261.065,230.346,264.569,212.506,264.569z M212.506,1 c-17.705,0-34.902,3.477-51.115,10.334c-15.638,6.614-29.674,16.075-41.718,28.118c-12.044,12.044-21.504,26.08-28.117,41.717 c-6.857,16.213-10.334,33.41-10.334,51.115c0,17.705,3.477,34.902,10.334,51.114c6.614,15.639,16.074,29.675,28.117,41.718 c12.043,12.043,26.08,21.503,41.718,28.118c16.212,6.857,33.41,10.334,51.115,10.334s34.902-3.477,51.115-10.334 c15.638-6.615,29.674-16.075,41.718-28.118c12.043-12.042,21.503-26.079,28.117-41.718c6.858-16.213,10.335-33.41,10.335-51.114 c0-17.705-3.477-34.902-10.335-51.115c-6.614-15.639-16.074-29.674-28.117-41.717c-12.044-12.044-26.08-21.504-41.718-28.118 C247.408,4.477,230.211,1,212.506,1z M212.506,221.729c-49.32,0-89.444-40.125-89.444-89.444s40.125-89.445,89.444-89.445 s89.445,40.125,89.445,89.445S261.826,221.729,212.506,221.729z M212.506,43.84c-48.769,0-88.444,39.676-88.444,88.445 s39.676,88.444,88.444,88.444s88.445-39.676,88.445-88.444S261.274,43.84,212.506,43.84z"/> </g> <g> <path d="M586.081,404.607c-7.023-16.604-17.067-31.506-29.855-44.293c-12.787-12.789-27.689-22.834-44.294-29.855 c-17.213-7.281-35.472-10.973-54.271-10.973s-37.059,3.693-54.271,10.973c-6.161,2.605-12.086,5.629-17.758,9.053 c-2.294-2.627-4.679-5.186-7.162-7.67c-14.042-14.043-30.405-25.072-48.636-32.782c-18.896-7.993-38.944-12.045-59.586-12.045 H154.764c-20.642,0-40.69,4.053-59.586,12.045c-18.23,7.71-34.593,18.739-48.635,32.782 c-14.042,14.041-25.071,30.404-32.781,48.635C5.769,399.373,1.716,419.42,1.716,440.062v73.625 c0,34.471,28.044,62.516,62.514,62.516h296.552c6.157,0,12.108-0.9,17.733-2.566c7.775,5.369,16.084,9.943,24.874,13.662 c17.213,7.279,35.473,10.971,54.271,10.971s37.059-3.691,54.271-10.971c16.604-7.023,31.507-17.068,44.294-29.855 c12.789-12.789,22.833-27.691,29.855-44.295c7.28-17.213,10.972-35.473,10.972-54.271S593.362,421.82,586.081,404.607z M457.661,555.43c-15.448,0-30.046-3.633-42.993-10.084c-6.449-3.213-12.487-7.123-18.017-11.637 c-6.143-5.014-11.659-10.766-16.408-17.127c-12.019-16.098-19.135-36.068-19.135-57.703c0-18.727,5.338-36.205,14.566-51.008 c4.422-7.092,9.737-13.57,15.791-19.273c5.317-5.01,11.202-9.422,17.55-13.133c14.285-8.348,30.905-13.137,48.646-13.137 c53.324,0,96.552,43.227,96.552,96.551S510.985,555.43,457.661,555.43z M64.23,533.363c-10.866,0-19.674-8.809-19.674-19.674 v-73.627c0-60.865,49.342-110.207,110.208-110.207h115.484c32.859,0,62.354,14.385,82.545,37.195 c-9.821,11.193-17.729,23.789-23.553,37.557c-7.28,17.213-10.972,35.473-10.972,54.271s3.69,37.059,10.972,54.271 c2.984,7.057,6.521,13.803,10.576,20.213H64.23z"/> <path d="M457.662,598.77c-18.865,0-37.19-3.704-54.466-11.01c-8.677-3.671-17.008-8.237-24.768-13.576 c-5.725,1.672-11.66,2.52-17.646,2.52H64.23c-34.746,0-63.014-28.269-63.014-63.016v-73.625c0-20.709,4.066-40.822,12.085-59.78 c7.735-18.29,18.8-34.706,32.888-48.794c14.088-14.089,30.505-25.154,48.794-32.889c18.958-8.019,39.072-12.084,59.781-12.084 h115.483c20.712,0,40.825,4.066,59.78,12.084c18.291,7.735,34.707,18.8,48.795,32.889c2.35,2.351,4.672,4.831,6.909,7.38 c5.578-3.345,11.451-6.328,17.463-8.87c17.278-7.307,35.604-11.012,54.466-11.012c18.866,0,37.191,3.705,54.465,11.012 c16.664,7.047,31.62,17.128,44.453,29.963c12.832,12.831,22.913,27.787,29.962,44.452c7.308,17.273,11.013,35.598,11.013,54.464 s-3.705,37.191-11.011,54.466c-7.048,16.664-17.129,31.62-29.963,44.454c-12.833,12.833-27.789,22.914-44.453,29.962 C494.852,595.065,476.528,598.77,457.662,598.77z M378.603,573.09l0.197,0.136c7.759,5.357,16.098,9.938,24.785,13.612 c17.151,7.254,35.345,10.932,54.076,10.932s36.925-3.678,54.076-10.932c16.544-6.997,31.393-17.007,44.135-29.748 c12.742-12.742,22.751-27.592,29.748-44.136c7.255-17.151,10.933-35.346,10.933-54.077s-3.679-36.925-10.934-54.075 c-6.998-16.545-17.007-31.394-29.748-44.134c-12.742-12.743-27.591-22.752-44.135-29.748 c-17.15-7.255-35.345-10.934-54.076-10.934c-18.728,0-36.922,3.679-54.077,10.934c-6.096,2.578-12.049,5.612-17.693,9.02 l-0.359,0.217l-0.276-0.315c-2.307-2.642-4.709-5.214-7.139-7.646c-13.996-13.997-30.306-24.99-48.477-32.675 c-18.832-7.966-38.814-12.005-59.392-12.005H154.764c-20.575,0-40.557,4.039-59.391,12.005 c-18.17,7.684-34.48,18.678-48.477,32.675c-13.997,13.996-24.99,30.306-32.674,48.476c-7.966,18.835-12.006,38.817-12.006,59.392 v73.625c0,34.195,27.819,62.016,62.014,62.016h296.552c5.97,0,11.888-0.856,17.592-2.546L378.603,573.09z M457.661,555.93 c-15.177,0-29.717-3.41-43.216-10.137c-6.438-3.207-12.531-7.143-18.11-11.696c-6.184-5.048-11.732-10.84-16.492-17.216 c-12.583-16.854-19.234-36.91-19.234-58.002c0-18.178,5.063-35.907,14.642-51.272c4.433-7.107,9.772-13.626,15.873-19.373 c5.359-5.049,11.294-9.49,17.641-13.2c14.783-8.639,31.691-13.205,48.897-13.205c53.515,0,97.052,43.537,97.052,97.051 S511.175,555.93,457.661,555.93z M457.661,362.828c-17.028,0-33.763,4.519-48.394,13.068c-6.28,3.672-12.154,8.067-17.459,13.065 c-6.038,5.688-11.323,12.139-15.71,19.174c-9.479,15.206-14.49,32.753-14.49,50.743c0,20.874,6.582,40.725,19.035,57.404 c4.711,6.31,10.203,12.043,16.324,17.038c5.521,4.508,11.552,8.402,17.923,11.577c13.359,6.656,27.749,10.031,42.771,10.031 c52.963,0,96.052-43.088,96.052-96.051S510.624,362.828,457.661,362.828z M340.725,533.863H64.23 c-11.124,0-20.174-9.05-20.174-20.174v-73.627c0-61.044,49.663-110.707,110.708-110.707h115.484 c31.678,0,61.901,13.618,82.919,37.364l0.292,0.33l-0.29,0.331c-9.788,11.154-17.684,23.745-23.468,37.421 c-7.255,17.151-10.933,35.346-10.933,54.077c0,18.734,3.678,36.928,10.932,54.077c2.949,6.973,6.495,13.749,10.539,20.14 L340.725,533.863z M154.764,330.355c-60.493,0-109.708,49.215-109.708,109.707v73.627c0,10.572,8.602,19.174,19.174,19.174 h274.682c-3.873-6.212-7.28-12.773-10.133-19.519c-7.306-17.272-11.011-35.597-11.011-54.466c0-18.866,3.705-37.191,11.011-54.466 c5.77-13.64,13.623-26.206,23.347-37.359c-20.816-23.329-50.632-36.698-81.878-36.698H154.764z"/> </g> <g> <path d="M504.745,437.459h-25.664v-25.664c0-11.83-9.591-21.42-21.42-21.42c-11.83,0-21.42,9.59-21.42,21.42v25.664h-12.977 h-12.688c-3.103,0-6.048,0.664-8.709,1.852c-7.487,3.338-12.711,10.84-12.711,19.568c0,8.73,5.227,16.236,12.72,19.572 c2.659,1.184,5.601,1.848,8.7,1.848h12.72h12.944v25.664c0,11.83,9.59,21.42,21.42,21.42c11.829,0,21.42-9.59,21.42-21.42v-25.664 h25.664c11.83,0,21.42-9.59,21.42-21.42S516.575,437.459,504.745,437.459z"/> <path d="M457.661,527.883c-12.087,0-21.92-9.833-21.92-21.92v-25.164h-25.164c-3.089,0-6.085-0.636-8.903-1.891 c-7.907-3.521-13.017-11.383-13.017-20.029c0-8.643,5.105-16.502,13.008-20.025c2.817-1.257,5.815-1.895,8.912-1.895h25.164 v-25.164c0-12.087,9.833-21.92,21.92-21.92s21.92,9.833,21.92,21.92v25.164h25.164c12.087,0,21.92,9.833,21.92,21.92 s-9.833,21.92-21.92,21.92h-25.164v25.164C479.581,518.05,469.748,527.883,457.661,527.883z M410.577,437.959 c-2.955,0-5.816,0.608-8.505,1.809c-7.542,3.361-12.415,10.863-12.415,19.111c0,8.252,4.876,15.756,12.423,19.115 c2.69,1.197,5.549,1.805,8.497,1.805h26.164v26.164c0,11.535,9.385,20.92,20.92,20.92s20.92-9.385,20.92-20.92v-26.164h26.164 c11.535,0,20.92-9.385,20.92-20.92s-9.385-20.92-20.92-20.92h-26.164v-26.164c0-11.535-9.385-20.92-20.92-20.92 s-20.92,9.385-20.92,20.92v26.164H410.577z"/> </g> </g> </svg>
                                                </i>
                                                
                                            </a>
                                            <div v-if="!task.assignees.data.length" class="helper-text">{{ __( 'Add New Member +', 'wedevs-project-manager' ) }}</div>
                                        </div>
                                    </pm-popper>

                                    <!-- <div v-if="task.assignees.data.length" class='pm-assigned-user' v-for="user in task.assignees.data" :key="user.id">

                                        <a :href="userTaskProfileUrl(user.id)" :title="user.display_name">
                                            <img :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                        </a>
                                    </div> -->

                                </div>
                                


                                
                                <!-- <div v-if="has_task_permission()" id="pm-multiselect-single-task" >
                                    <div v-show="is_enable_multi_select"  class="pm-multiselect pm-multiselect-single-task">
                                        <div class="pm-multiselect-content">
                                            

                                        </div>
                                    </div>
                                </div> -->
                            </div>

                            
                            <div class="pm-flex option-icon-groups">
                                <do-action :hook="'single_task_action'" :actionData="task"></do-action>
                                
                                <span v-if="PM_Vars.is_pro && can_edit_task(task) && user_can('view_private_task')">
                                    <span 
                                        v-if="typeof task.meta.privacy === 'undefined' || parseInt(task.meta.privacy)==0" 
                                        @click.prevent="singleTaskLockUnlock(task)" 
                                        :title="__('Task is visible for co-worker', 'wedevs-project-manager')" 
                                        class="icon-pm-unlock pm-dark-hover pm-font-size-16"
                                    />
                                    <span 
                                        v-if="parseInt(task.meta.privacy)==1" 
                                        @click.prevent="singleTaskLockUnlock(task)" 
                                        class="icon-pm-private pm-dark-hover pm-font-size-16"
                                    />
                                </span>

                                <span id="pm-calendar-wrap"  v-pm-tooltip :title="__('Date', 'wedevs-project-manager')" @click.prevent="isTaskDateEditMode()" class="individual-group-icon calendar-group icon-pm-calendar pm-font-size-16">
                                    <span v-if="(task.start_at.date || task.due_date.date )" :class="taskDateWrap(task.due_date.date) + ' pm-task-date-wrap pm-date-window'">

                                        <span :title="getFullDate(task.start_at.datetime)" v-if="task_start_field">
                                            {{ dateFormat( task.start_at.date ) }}
                                        </span>

                                        <span v-if="task_start_field && task.start_at.date && task.due_date.date">&ndash;</span>
                                        <span :title="getFullDate(task.due_date.datetime)" v-if="task.due_date">

                                            {{ dateFormat( task.due_date.date ) }}
                                        </span>
                                    </span>

                                    <span v-if="(!task.start_at.date && !task.due_date.date)" class="pm-task-date-wrap pm-date-window">
                                        <span
                                            @click.prevent="isTaskDateEditMode()"
                                            v-bind:class="task.status ? completedTaskWrap(task.start_at.date, task.due_date.date) : taskDateWrap( task.start_at.date, task.due_date.date)">
                                        </span>
                                    </span>
                                    <div v-if="is_task_date_edit_mode && can_edit_task(task)" class="task-date">
                                        <pm-content-datepicker
                                            v-if="task_start_field"
                                            v-model="task.start_at.date"
                                            :callback="callBackDatePickerForm"
                                            dependency="pm-datepickter-to"
                                            class="pm-datepicker-from pm-inline-date-picker-from">

                                        </pm-content-datepicker>
                                        <pm-content-datepicker
                                            v-model="task.due_date.date"
                                            dependency="pm-datepickter-from"
                                            :callback="callBackDatePickerTo"
                                            class="pm-datepicker-to pm-inline-date-picker-to">

                                        </pm-content-datepicker>

                                    </div>
                                </span>
                                <do-action :hook="'single_task_inline'" :actionData="doActionData"></do-action>
                            </div>
                        </div>
                        <do-action :hook="'before_single_task_description'" :actionData="doActionData"></do-action>
                        <!-- v-if="has_task_permission()" -->
                        <div id="description-wrap" class="description-wrap">
                            <div v-if="showdescriptionfield && has_task_permission()" @click.prevent="isTaskDetailsEditMode()"  class="action-content pm-flex">
                                <span>
                                    <span class="icon-pm-align-left"></span>
                                    <span class="task-description">{{ __( 'Description', 'wedevs-project-manager' ) }}</span>
                                </span>
                                <span class="icon-pm-pencil"></span>
                            </div>

                            <div v-else class="task-details">

                                <div class="pm-des-area pm-desc-content" v-if="!is_task_details_edit_mode">

                                    <div v-if="task.description.content != ''" class="pm-task-description" v-html="task.description.html"></div>

                                    <a class="task-description-edit-icon" @click.prevent="isTaskDetailsEditMode()" :title="update_description" v-if="can_edit_task(task) && !isArchivedTaskList(task)">
                                        <i style="font-size: 16px;"  class="fa fa-pencil" aria-hidden="true"></i>

                                    </a>
                                </div>

                                <div v-if="is_task_details_edit_mode && can_edit_task(task) && !isArchivedTaskList(task)" class="item detail">
                                    <text-editor v-if="is_task_details_edit_mode" :editor_id="'task-description-editor'" :content="content"></text-editor>
                                    <div class="task-description-action">
                                        <a @click.prevent="submitDescription(task)" href="#" class="pm-button pm-primary">{{ __( 'Update', 'wedevs-project-manager' ) }}</a>
                                        <a @click.prevent="closeDescriptionEditor(task)" href="#" class="pm-button pm-secondary">{{ __( 'Cancel', 'wedevs-project-manager' ) }}</a>
                                        <span v-if="description_show_spinner" class="pm-spinner"></span>
                                    </div>
                                </div>

                                <div class="clearfix pm-clear"></div>
                                <do-action :hook="'aftre_single_task_details'" :actionData="doActionData"></do-action>
                            </div>
                        </div>

                        <do-action :hook="'aftre_single_task_content'" :actionData="doActionData"></do-action>

                        <div class="discuss-wrap">
                            <task-comments :task="task" :comments="task.comments.data"></task-comments>
                        </div>

                        <div class="task-activities">
                            <span  class="activity-title pm-h2">{{ __('Activity', 'wedevs-project-manager') }}</span>
                            <ul class="single-task-activity-ul">
                                <li v-for="activity in task.activities.data" :key="activity.id">
                                    <div class="activity-li-content">
                                        <div class="activity-actor">
                                            <img class="activity-author-image" :src="activity.actor.data.avatar_url">
                                        </div>
                                        <div class="activity-content">

                                            <activity-parser :activity="activity"></activity-parser>
                                            <span class="activity-watch-wrap">
                                                <span class="activity-watch-icon icon-pm-watch"></span>
                                                <span :title="getFullDate( activity.committed_at.datetime )" class="activity-form-now">{{ relativeDate(activity.committed_at.datetime) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div v-if="activityLoading" class="pm-data-load-before" >
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
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </div>

</template>

<style lang="less">
    .actions-wrap {
        .label {
            font-size: 13px;
            font-weight: bold;
        }

        .context {
            .display-flex {
                display: flex;
                align-items: center;
            }

            .process-1 {
                display: flex;
                align-items: center;
                margin-top: 18px;

                .process-text-wrap {
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                    .process-btn {
                        background: transparent;
                        height: 28px;
                        width: 28px;
                        border-radius: 50%;
                        justify-content: center;
                        // transition: all 1s ease-out;

                        svg {
                            height: 16px;
                            width: 16px; 
                            fill: #7f7f7f;   
                        }
                    }

                    .helper-text {
                        font-size: 13px;
                        margin-left: 5px;
                        font-weight: 300;
                    }
                }

                &:hover {
                    //background: #f7f7f7;
                    color: #000;

                    .process-btn {
                        background: #007cba;

                        svg {
                            fill: #fff;   
                        }
                    }
                }
            }

            .data-active {
                display: flex;
                align-items: center;
                margin-top: 18px;

                .process-text-wrap {
                    display: flex;
                    align-items: center;
                    cursor: pointer;

                     &:hover {
                        //background: #f7f7f7;
                        color: #000;

                        .process-btn {
                            background: #007cba;

                            svg {
                                fill: #fff;   
                            }
                        }
                    }

                    .process-btn {
                        background: transparent;
                        height: 28px;
                        width: 28px;
                        border-radius: 50%;
                        justify-content: center;
                        // transition: all 1s ease-out;

                        svg {
                            height: 16px;
                            width: 16px; 
                            fill: #7f7f7f;   
                        }
                    }
                }
                
                &:hover {
                    background: transparent;
                }
            }

            .process-results.user-images {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;

                .image {
                    height: 30px;
                    width: 30px;
                    border-radius: 50%;
                    background: #f1f1f1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #e5e5e5;
                    cursor: pointer;
                    position: relative;
                    margin-right: 3px;

                    &:last-child {
                        margin-right: 6px;
                    }

                    &:hover {
                       > .cross {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        } 
                    }
                    
                    .cross {
                        display: none;
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        width: 100%;
                        background-color: #e46c6c;
                        border-radius: 50%;

                        svg {
                            height: 8px;
                            width: 8px;
                            fill: #fff;
                        }
                    }

                    img {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                    }
                }
            }

            .process-results {

            }
        }
        
    }

    .task-list-title-wrap {
        .list-title {
            font-size: 12px;
            text-transform: uppercase;
        }
    }

    .pm-single-task-wrap {
        .option-icon-groups {
            .pm-action-wrap {
                display: flex;
                align-items: center;
            }
        }
    }

</style>

<script>
    import comments from './task-comments.vue';
    import DoAction from './../common/do-action.vue';
    import Mixins from './mixin';
    import Multiselect from 'vue-multiselect';
    import ActivityParser from '@components/common/activity-parser.vue';
    import editor from '@components/common/text-editor.vue';

    Vue.directive('activity-load-more', {
        bind: function(el, binding, vnode) {
            var self = this;

            jQuery(el).bind('scroll', function() {

                if( jQuery(this).scrollTop() + jQuery(this).innerHeight()>=jQuery(this)[0].scrollHeight ) {

                    vnode.context.loadMoreActivity(vnode.context);
                }
            })
        }

    });

    export default {
        props: {
            taskId: {
                type: [Number, Boolean, String],
                default () {
                    return false
                }
            },
            projectId: {
                type: [Number, Boolean, String],
                default () {
                    return false
                }
            }
        },
        data() {
            return {
                loading: true,
                is_task_title_edit_mode: false,
                is_task_details_edit_mode: false,
                is_task_date_edit_mode: false,
                is_enable_multi_select: false,
                task_description: '',
                update_description: __( 'Update Description', 'wedevs-project-manager'),
                task_id: this.$route.params.task_id,
                list: {},
                task: {},
                assigned_to: [],
                isActiveMenu: false,
                activityPage: 2,
                activityLoading: false,
                allActivityLoaded: false,
                content: {
                    html: ''
                },
                description_show_spinner: false,
                show_spinner_status: false,
                show_spinner: false,
                taskUpdating: false,
                truckTitleUpdate: ''
            }
        },

        mixins: [Mixins],
        computed: {
            doActionData () {
                return {
                    task: this.task,
                    assignees : this.project_users ,
                    list: this.list,
                    is_single_task_open: true,
                }
            },

            project_users () {
                this.$root.$store.state.project_users.forEach(function(user) {
                    pm.Vue.set(user, 'img');
                });
                return this.$root.$store.state.project_users;
            },
            task_users () {
                if (jQuery.isEmptyObject(this.$store.state.projectTaskLists.task)) {
                    return [];
                }
                return this.$store.state.projectTaskLists.task.assignees.data;
            },

            /**
             * Get and Set task users
             */
            task_assign: {
                /**
                 * Filter only current task assgin user from vuex state project_users
                 *
                 * @return array
                 */
                get () {
                    this.assigned_to = this.task.assignees.data.map(function (user) {
                        return user.id;
                    });
                    return typeof this.task.assignees === 'undefined' ? [] : this.task.assignees.data;
                },

                /**
                 * Set selected users at task insert or edit time
                 *
                 * @param array selected_users
                 */
                set ( selected_users ) {
                    if(this.show_spinner) {
                        return;
                    }
                    var self = this;
                    this.assigned_to = selected_users.map(function (user) {
                        return user.id;
                    });

                    this.task.assignees.data = selected_users;

                    this.updateTaskElement(this.task, function(res) {
                        
                        pmBus.$emit('after_update_single_task_user', {
                            beforeUpdate: self.task, 
                            afterUpdate: res.data
                        });

                        self.task.assignees.data = res.data.assignees.data; 
                    });
                }
            },
            isTaskLock () {
                return PM_Vars.is_pro && this.can_edit_task(this.task) && this.user_can('view_private_task') && this.task.meta.privacy=='0';
            },
            isTaskUnlock () {
                return PM_Vars.is_pro && this.can_edit_task(this.task) && this.user_can('view_private_task') && this.task.meta.privacy=='1';
            },
            showdescriptionfield () {
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                return !this.task.description.content && !this.is_task_details_edit_mode;
            }
        },

        components: {
            'task-comments': comments,
            'multiselect': Multiselect,
            'do-action': DoAction,
            'activity-parser': ActivityParser,
            'text-editor': editor,
        },

        created() {
            var self = this;
            this.getSelfTask();
            this.getGloabalProject(this.projectId);
            window.addEventListener('click', this.windowActivity);
            //this.$root.$on('pm_date_picker', this.fromDate);
            this.$store.commit('isSigleTask', true);
            pm.Vue.nextTick(function() {
                jQuery('body').addClass('pm-block-content');
            });

            jQuery(document).keyup(function(e) {
                if (e.keyCode === 27) {
                    var subtaskInput = jQuery(e.target).closest('.new-subtask-form').find('.input-area');
                    var mainBody = jQuery(e.target).closest('#pm-single-task-wrap');

                    if(!subtaskInput.length && !mainBody.length) {

                       self.closePopup();
                    }
                }
            });
        },
        destroyed () {
            this.task = {};
            this.list = {};
        },

        methods: {
            deleteUser (user) {
                let index = this.getIndex( this.task.assignees.data, user.id, 'id' );

                if( index !== false ) {
                    this.task.assignees.data.splice( index, 1 );
                }
            },
            // popper options
            popperOptions () {
                return {
                    placement: 'bottom-end',
                    modifiers: { offset: { offset: '0, 3px' } },
                }
            },

            warningTitleCharacterLimit () {
                if(this.task.title.length >= 200) {
                    pm.Toastr.warning(__('Maxmim character limit 200', 'wedevs-project-manager'));
                }
            },

            updateTaskTitle (task) {
                if(task.title.length >= 200) {
                    pm.Toastr.warning(__('Maxmim character limit 200', 'wedevs-project-manager'));
                    return;
                }
                if(this.truckTitleUpdate == task.title) {
                    return;
                }
                this.updateTaskElement(task);
            },

            callBackDatePickerForm (date) {

                let dateFrom = {
                    id: 'singleTask',
                    field: 'datepicker_from',
                    date: date
                }

                this.fromDate(dateFrom);
            },

            callBackDatePickerTo (date) {

                let dateTo = {
                    id: 'singleTask',
                    field: 'datepicker_to',
                    date: date
                }

                this.fromDate(dateTo);
            },

            submitDescription (task) {
                task.description.content = this.content.html.trim();
                this.description_show_spinner = true;
                this.updateTaskElement(task);
            },

            closeDescriptionEditor () {
                this.description_show_spinner = false;
                this.is_task_details_edit_mode = false;
                tinymce.execCommand( 'mceRemoveEditor', false, 'task-description-editor' );
            },

            loadMoreActivity (self) {

                if(this.allActivityLoaded) {
                    return;
                }

                if( this.activityLoading ) {
                    return;
                }

                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+self.project_id+'/tasks/'+self.task.id+ '/activity',
                    type: 'POST',
                    data: {
                        activityPage: this.activityPage
                    },
                    success (res) {
                        self.activityLoading = false;
                        self.activityPage = self.activityPage + 1;

                        if(typeof self.task.activities == 'undefined') {
                            pm.Vue.set(self.task, 'activities', {});
                            pm.Vue.set(self.task.activities, 'data', res.data);
                        } else {
                            self.task.activities.data = self.task.activities.data.concat(res.data);
                        }

                        if(!res.data.length) {
                            self.allActivityLoaded = true;
                        }
                    },

                    error (res) {

                    }
                }

                this.activityLoading = true;
                self.httpRequest(request_data);
            },

            showMenu (status) {

                if(typeof status != 'undefined') {
                    this.isActiveMenu = status;
                } else {
                   this.isActiveMenu = this.isActiveMenu ? false : true;
                }

            },

            selfDeleteTask() {
                var self = this;
                this.deleteTask({
                    task: this.task,
                    list: this.task.task_list.data,
                    callback (data) {
                        self.closePopup();
                         if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(data.activity.data);
                        } else {
                            self.task.activities = { data: [data.activity.data] };
                        }

                    }
                });
            },

            copyUrl (task) {
                pmBus.$emit('pm_generate_task_url', task);
                pm.Toastr.success(this.__('Copied!', 'wedevs-project-manager'));
                this.isActiveMenu = false;
            },

            lineThrough (task) {
                if ( task.status ) {
                    return 'pm-line-through';
                }
            },

            singleTaskDoneUndone () {
                if (this.isArchivedTaskList(this.task)) {
                    return;
                }
                if (this.can_complete_task(this.task)) {
                    return;
                }

                var self = this,
                    status = this.task.status ? 0 : 1;

                    this.show_spinner_status = true;

                var args = {
                    data: {
                        task_id: this.task.id ? this.task.id : this.taskId,
                        status : status,
                        project_id: this.task.project_id,
                    },
                    callback (res) {
                        if( status == '1' ) {
                            self.task.status = true;
                        } else {
                            self.task.status = false;
                        }

                        if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(res.activity.data);
                        } else {
                            self.task.activities = { data: [res.activity.data] };
                        }
                        self.show_spinner_status = false
                        pmBus.$emit('pm_after_task_doneUndone', res);
                    }
                }

                this.taskDoneUndone( args );

            },

            getSelfTask (){
                var self = this;
                var args = {
                    condition : {
                        with: 'boards,comments,activities',
                    },
                    task_id : self.task_id ? self.task_id : this.taskId,
                    project_id: self.projectId ? self.projectId : self.project_id,
                    callback  (res) {
                        if (typeof res.data === 'undefined' ) {
                            pm.Toastr.error(res.message);
                            self.$router.go(-1);
                            return;
                        } else {
                            self.content.html = res.data.description.html;
                            self.addMeta(res.data);
                            self.task = res.data;
                            self.truckTitleUpdate = res.data.title;

                            self.loading = false;
                        }
                    }
                }

                this.getTask(args);

            },

            addMeta (task) {
                task.edit_mode = false;

                if (task.status === 'complete') {
                    task.status = true;
                } else {
                    task.status = false;
                }

                task.comments.data.map(function(comment) {
                    comment.edit_mode = false;
                });
            },


            has_task_permission(){
               var permission =  this.can_edit_task(this.task) ;
               return permission ;
            },

            isEnableMultiSelect () {
                if (this.isArchivedTaskList(this.task)) {
                    return false;
                }
                if ( !this.can_edit_task(this.task)){
                    return false;
                }

                this.is_enable_multi_select = this.is_enable_multi_select ? false : true;
                
                pm.Vue.nextTick(() => {
                    this.$refs.assingTask.$el.focus();

                });
            },

            fromDate (date) {
                if ( date.id == 'singleTask' && date.field == 'datepicker_from' ) {

                    if (this.task.due_date.date) {
                        var start = new Date(date.date);
                        var end  = new Date(this.task.due_date.date);
                        var compare = pm.Moment(end).isBefore(start);

                        if(this.task_start_field && compare) {
                            pm.Toastr.error('Invalid date range!');
                            return;
                        }
                    }

                    this.task.start_at.date = date.date;

                    this.updateTaskElement(this.task);
                }

                if ( date.id == 'singleTask' && date.field == 'datepicker_to' ) {

                    if(this.task.start_at.date) {
                        var start = new Date(this.task.start_at.date);
                        var end  = new Date(date.date);
                        var compare = pm.Moment(end).isBefore(start);

                        if(this.task_start_field && compare) {
                            pm.Toastr.error('Invalid date range!');
                            return;
                        }
                    }

                    var task = this.task;

                    var start = new Date( task.start_at ),
                        due = new Date( date.date );

                    if ( !this.$store.state.projectTaskLists.permissions.task_start_field ) {
                        task.due_date.date = date.date;
                        this.updateTaskElement(task);
                    } else if ( start <= due ) {
                        task.due_date.date = date.date;
                        this.updateTaskElement(task);
                    }
                }
            },

            updateTaskPrivacy (task, status) {
                task.task_privacy = status;
                this.updateTaskElement(task);
            },

            isTaskDetailsEditMode () {
                if (this.isArchivedTaskList(this.task)) {
                     this.is_task_details_edit_mode = false;
                }

                if ( !this.can_edit_task(this.task) ) {
                    this.is_task_details_edit_mode = false;
                }else {
                    this.task_description  = this.task.description.content;
                    this.is_task_details_edit_mode = true;
                }

                pm.Vue.nextTick(function() {
                    jQuery('.pm-desc-field').focus();
                });
            },

            updateDescription (task, event) {
                if ( event.keyCode == 13 && event.shiftKey ) {
                    return;
                }

                if ( this.task_description.trim() == task.description.content) {
                    return;
                }
                task.description.content = this.task_description.trim();
                this.is_task_details_edit_mode = false,
                this.updateTaskElement(task);
            },

            closePopup () {
                pmBus.$emit('pm_after_close_single_task_modal');
                return;
                this.$router.go(-1);
                return;
                const history = this.$store.state.history;

                if (! history.from.name) {
                    this.$router.push({
                        name: 'task_lists',
                        params: {
                            project_id: this.$route.params.project_id
                        }
                    });
                } else {
                    this.$router.push(history.from);
                }
            },

            singleTaskTitle (task) {
                return task.completed ? 'pm-task-complete' : 'pm-task-incomplete';
            },

            updateTaskElement (task, callback) {
                if (this.isArchivedTaskList(this.task)) {
                    return;
                }
                var start = new Date(task.start_at.date);
                var end  = new Date(task.due_date.date);
                var compare = pm.Moment(end).isBefore(start);
                var project_id = this.project_id ? this.project_id : task.project_id;

                if(
                    task.start_at.date
                        &&
                    task.due_date.date
                        &&
                    this.task_start_field
                        &&
                    compare
                ) {
                    pm.Toastr.error(__('Invalid date range!', 'wedevs-project-manager'));
                    return;
                }
                

                var update_data  = {
                        'title': task.title,
                        'description': task.description.content,
                        'estimation': this.setMinuteToTime( task.estimation ),
                        'start_at': task.start_at ? task.start_at.date : '',
                        'due_date': task.due_date ? task.due_date.date : '',
                        'complexity': task.complexity,
                        'priority': task.priority,
                        'order': task.order,
                        'payable': task.payable,
                        'recurrent': task.recurrent,
                        'status': task.status ? 1 : 0,
                        'category_id': task.category_id,
                        'assignees': this.assigned_to.length == 0 ? [0] : this.assigned_to
                    },
                    self = this,
                    url = this.base_url + '/pm/v2/projects/'+project_id+'/tasks/'+task.id+'/update';

                var request_data = {
                    url: url,
                    data: update_data,
                    type: 'POST',
                    
                    success (res) {
                        pmBus.$emit('pm_after_update_single_task', res);
                        self.is_task_title_edit_mode = false;
                        self.closeDescriptionEditor();
                        self.task.description = res.data.description;
                        self.$store.commit('updateProjectMeta', 'total_activities');
                        if ( typeof self.task.activities !== 'undefined' ) {
                            self.task.activities.data.unshift(res.activity.data);
                        } else {
                            self.task.activities = { data: [res.activity.data] };
                        }
                        self.show_spinner = false;

                        if(typeof callback != 'undefined') {
                            callback(res);
                        }


                    },
                    error (res) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
                this.show_spinner = true;
                this.httpRequest(request_data);
            },

            setMinuteToTime (minute) {
                minute = minute ? parseInt( minute ) : 0;
                let time = this.stringToTime( minute*60 );

                return `${time.hours}:${time.minutes}`;
            },

            isTaskTitleEditMode () {
                if (this.isArchivedTaskList(this.task)) {
                    return this.is_task_title_edit_mode = false;
                }

                if ( !this.can_edit_task(this.task) ) {
                    return this.is_task_title_edit_mode = false;
                }
                return this.is_task_title_edit_mode = true;
            },

            isTaskDateEditMode () {
                if (this.isArchivedTaskList(this.task)) {
                    return this.is_task_date_edit_mode = false;
                }
                
                if( this.task.status ) {
                    return this.is_task_date_edit_mode = false;
                }

                if ( !this.can_edit_task(this.task) ) {
                    this.is_task_date_edit_mode = false;

                    return this.is_task_date_edit_mode;
                }

                this.is_task_date_edit_mode = true;
            },

            windowActivity (el) {
                var title_blur      = jQuery(el.target).hasClass('pm-task-title-activity'),
                    dscription_blur = jQuery(el.target).closest('#description-wrap'),
                    assign_user     = jQuery(el.target).closest( '#pm-multiselect-single-task' ),
                    actionMenu      = jQuery(el.target).closest( '#pm-action-menu' ),
                    modal           = jQuery(el.target).closest( '.popup-container' ),
                    datePicker      = jQuery(el.target).closest('#ui-datepicker-div'),
                    datePickerBtn   = jQuery(el.target).closest('.ui-datepicker-buttonpane'),
                    hasCalendarArrowBtn = jQuery(el.target).hasClass('ui-icon'),
                    mainBody        = jQuery(el.target).closest('#pm-single-task-wrap');

                if(datePicker.length || datePickerBtn.length || hasCalendarArrowBtn) {
                    return;
                }

                if( !modal.length && jQuery('.popup-container').length && mainBody.length ) {
                    this.closePopup();
                }

                if(!actionMenu.length) {
                    this.showMenu(false);
                }
                if ( ! title_blur ) {
                    this.is_task_title_edit_mode = false;
                }

                if ( ! dscription_blur.length ) {
                    this.closeDescriptionEditor();
                    //this.is_task_details_edit_mode = false;
                }
                if ( ! assign_user.length ) {
                    //this.is_enable_multi_select = false;
                }

                this.datePickerDispaly(el);

            },

            datePickerDispaly (el) {
                var date_picker_blur = jQuery(el.target).closest('#pm-calendar-wrap');

                if ( ! date_picker_blur.length ) {
                    this.is_task_date_edit_mode = false;
                }
            },

            singleTaskLockUnlock (task) {
                if (this.isArchivedTaskList(task)) {
                    return;
                }
                var self = this;
                var data = {
                    is_private: typeof task.meta.privacy === 'undefined' || task.meta.privacy == '0' ? 1 : 0
                }
                var request_data = {
                    url: self.base_url + '/pm/v2/projects/'+task.project_id+'/tasks/privacy/'+task.id,
                    type: 'POST',
                    data: data,
                    success (res) {
                        //task.meta.privacy = data.is_private;
                        pm.Vue.set( task.meta, 'privacy', data.is_private );

                        if(data.is_private) {
                            pm.Toastr.success(self.__('Task marked as private', 'wedevs-project-manager'));
                        } else {
                            pm.Toastr.success(self.__('Task visible for co-worker', 'wedevs-project-manager'));
                        }

                        self.isActiveMenu = false;
                    },

                    error (res) {
                        res.responseJSON.message.map( function( value, index ) {
                            pm.Toastr.error(value);
                        });
                    }
                }
                self.httpRequest(request_data);
            },

            cratedDateFormat (date) {
                if ( date == '' ) {
                    return;
                }

                date = new Date(date);
                date = pm.Moment(date).format('YYYY-MM-DD');

                var format = 'MMM D, YYYY';

                return pm.Moment( date ).format( String( format ) );
            },
        },

        destroyed () {
            this.$emit( 'closeTaskModal', this.task );
            pmBus.$emit('pm_before_destroy_single_task', this.task);
            jQuery('body').removeClass('pm-block-content');
        }
    }
</script>

<style>
    .pm-line-through {
        text-decoration: line-through;
    }
    .pm-block-content {
        overflow: hidden;
    }
</style>
