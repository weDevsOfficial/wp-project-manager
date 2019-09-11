<template>
    <div class="calendar-task-modal">
        <div class="popup-mask">

            <div class="popup-container">
                <span class="close-modal">
                    <a  @click.prevent="closePopup()"><span class="dashicons dashicons-no"></span></a>
                </span>

                <div class="popup-body">

                    <!-- <div class="pm-data-load-before" >
                        <div class="loadmoreanimation">
                            <div class="load-spinner">
                                <div class="rect1"></div>
                                <div class="rect2"></div>
                                <div class="rect3"></div>
                                <div class="rect4"></div>
                                <div class="rect5"></div>
                            </div>
                        </div>
                    </div> -->
                    <div class="new-task-label">
                        <span>{{__('New Task', 'wedevs-project-manager')}}</span>
                    </div>
                    <div class="form-fields project-list-drop-down">
                        <div>
                            <label  class="label">{{__('Project', 'wedevs-project-manager')}}</label>
                            <multiselect
                                v-model="project"
                                :options="projects"
                                :show-labels="false"
                                :placeholder="__( 'Type project name', 'wedevs-project-manager')"
                                @select="changeProject"
                                label="title"
                                :allowEmpty="false"
                                track-by="id">

                            </multiselect>

                            <div v-if="fetchProjects && !hasProjects">{{ __('No project found!', 'wedevs-project-manager') }}</div>

                            <div v-if="!fetchProjects && !hasProjects" class="loading-animation">
                                <div class="loading-projects-title">{{ __( 'Loading projects', 'wedevs-project-manager') }}</div>
                                <div class="load-spinner">
                                    <div class="rect1"></div>
                                    <div class="rect2"></div>
                                    <div class="rect3"></div>
                                    <div class="rect4"></div>
                                </div>
                            </div>
                        </div>
                        <div v-if="hasProjects">
                            <div>
                                <div>
                                    <label class="label">{{__('In List', 'wedevs-project-manager')}}</label>
                                    <multiselect
                                        v-model="list"
                                        :options="lists"
                                        :show-labels="false"
                                        :loading="loadingListSearch"
                                        @search-change="asyncListsFind"
                                        :placeholder="__('Type task list name', 'wedevs-project-manager')"
                                        label="title"
                                        :allowEmpty="false"
                                        track-by="id">

                                    </multiselect>
                                </div>
                                <div v-if="!loadingLists && !hasLists">{{ __('No task lists found!', 'wedevs-project-manager') }}</div>

                                <div v-if="loadingLists && !hasLists" class="loading-animation">
                                    <div class="loading-projects-title">{{ __( 'Loading task lists', 'wedevs-project-manager') }}</div>
                                    <div class="load-spinner">
                                        <div class="rect1"></div>
                                        <div class="rect2"></div>
                                        <div class="rect3"></div>
                                        <div class="rect4"></div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="hasLists">
                                <label class="label">{{__('Task', 'wedevs-project-manager')}}</label>
                                <pm-new-task-form  :task="task" :list="list"></pm-new-task-form>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">

    .calendar-task-modal .popup-mask .popup-container {
        height: 300px !important;
        top: 110px !important;
        .label {
            color: #000;
        }
        .new-task-label {
            text-align: center;
            color: #000;
            font-size: 16px;
            font-weight: 600;
        }
        .form-fields {
            .loading-animation {
                display: flex;
                align-items: center;
                margin-left: 33%;
                color: #000;

                .load-spinner {
                    margin: 0;
                }
            }
        }

        .project-list-drop-down {

            .multiselect {
                margin-bottom: 5px !important;
                border-radius: none;
                color: #999;
                font-weight: 300;

                .multiselect__tags {
                    border-radius: 0;
                }

                .multiselect__single {
                    margin-bottom: 0;
                }
                .multiselect__select {

                }
                .multiselect__input {
                    border: none;
                    box-shadow: none;
                    margin: 0;
                    font-size: 14px;
                    vertical-align: baseline;
                    height: 0;
                }
                .multiselect__element {
                    .multiselect__option {
                        font-weight: normal;
                        white-space: normal;
                        padding: 6px 12px;
                        line-height: 25px;
                        font-size: 14px;
                    }

                }
                .multiselect__tags {
                    min-height: auto;
                    padding: 4px;
                    border-color: #ddd;
                    white-space: normal;

                    .multiselect__tag {
                        margin-bottom: 0;
                        overflow: visible;
                        border-radius: 3px;
                        margin-top: 2px;
                    }
                }
            }
        }
    }
</style>


<script>
    
    export default {
        props: {

        },

        data () {
            return {
                timeout: '',
                listAbort: '',
                loadingListSearch: false,
                fetchProjects: false,
                loadingLists: false,
                projects: [],
                project: {},
                lists: [],
                list: {},
                task: {
                    start_at: {
                        date: ''
                    },

                    due_date: {
                        date: ''
                    },

                    description: {
                        content: ''
                    },

                    assignees: {
                        data: []
                    }
                }
            }
        },

        computed: {
            hasProjects () {
                return this.projects.length ? true : false;
            },

            hasLists () {
                return this.lists.length ? true : false;
            }
        },

        created () {
           this.getProjects();
        },

        components: {
            'multiselect': pm.Multiselect.Multiselect,
        },

        methods: {

            changeProject (project) {
                this.getLists(project.id);
            },
            getProjects () {
                var self = this;
                var request = {
                    url: self.base_url + '/pm/v2/advanced/projects',
                    data: {
                        select: 'id, title',
                    },
                    success (res) {
                        self.projects = res.data;
                        self.fetchProjects = true;

                        if(res.data.length) {
                            self.project = res.data[0];
                            self.getLists(res.data[0].id);
                        }
                    },

                    error (res) {

                    }
                }

                self.httpRequest(request);
            },

            asyncListsFind (title) {
                if(title == '') return;
                var self = this;
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in 800ms
                this.timeout = setTimeout(function () {
                    self.findLists(title);
                }, 500);
            },

            findLists (title) {
                var self = this;

                if(self.listAbort) {
                    self.listAbort.abort();
                }

                var request = {
                    url: self.base_url + '/pm/v2/advanced/'+self.project.id+'/task-lists',
                    data: {
                        select: 'id, title',
                        project_id: self.project.id,
                        title: title,
                    },
                    success: function(res) {
                        self.loadingListSearch = false;
                        self.setList(res.data);
                    }
                }
                self.loadingListSearch = true;
                self.listAbort = self.httpRequest(request);
            },

            setList (lists) {
                var self = this;
                var newLists = [];
                lists.forEach(function(list) {
                    let index = self.getIndex(self.lists, list.id, 'id');
                
                    if(index === false) {
                        newLists.push(list);
                    }
                })

                if(newLists.length) {
                    this.lists = this.lists.concat(newLists);
                }
            },

            getLists (project_id) {
                var self = this;
                var request = {
                    url: self.base_url + '/pm/v2/advanced/'+project_id+'/task-lists',
                    data: {
                        select: 'id, title',
                        project_id: project_id,
                        per_page: 300
                    },
                    success (res) {
                        self.lists = [res.data[0]];
                        self.loadingLists = false;

                        if(res.data.length) {
                            self.list = res.data[0];
                        }
                    },

                    error (res) {

                    }
                }
                self.loadingLists = true;
                self.lists = [];
                self.httpRequest(request);
            },

            closePopup () {

            }
        }
    }
</script>
