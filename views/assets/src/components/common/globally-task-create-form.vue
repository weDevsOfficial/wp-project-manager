<template>
    <div class="pm-task-create-fields">
        
        <div>
            
                <label v-if="selectedProjects"  class="label">{{__('Project', 'wedevs-project-manager')}}</label>
                <pm-project-drop-down 
                    @afterGetProjects="afterGetProjects"
                    @onChange="changeProject"
                    :selectedProjects="selectedProjects"
                    :class="selectedProjects ? 'display-block' : 'display-none'"
                />
            

                <div v-if="selectedProjects == ''" class="loading-animation">
                    <div class="loading-projects-title">{{ __( 'Loading projects', 'wedevs-project-manager') }}</div>
                    <div class="load-spinner">
                        <div class="rect1"></div>
                        <div class="rect2"></div>
                        <div class="rect3"></div>
                        <div class="rect4"></div>
                    </div>
                </div>
        </div>

        
        <div v-if="projectId">
            <label v-if="selectedLists" class="label">{{__('In List', 'wedevs-project-manager')}}</label>
            <pm-list-drop-down 
                :projectId="projectId"
                @afterGetLists="afterGetLists"
                :selectedLists="selectedLists"
                @onChange="changeList"
                :class="selectedLists ? 'display-block' : 'display-none'"
            />

            <div v-if="selectedLists == ''" class="loading-animation">
                <div class="loading-projects-title">{{ __( 'Loading task lists', 'wedevs-project-manager') }}</div>
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                </div>
            </div>
        </div>
        
        <div v-if="listId">
            <label class="label">{{__('Task', 'wedevs-project-manager')}}</label>
            <pm-new-task-form  
                :task="task" 
                :list="list"
                :projectId="parseInt(projectId)"
                @pm_after_create_task="afterCreateTask"
            />
                    
        </div>
        
    </div>
</template>



<script>
    
    export default {

        data () {
            return {
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
                },
                projectId: false,
                selectedProjects: '',
                selectedLists: '',
                listId: false,
                list: {}
            }
        },


        methods: {
            afterGetProjects (projects) {
                if(projects.length) {
                    this.projectId = projects[0].id;
                    this.setTaskFormUsers(projects[0].assignees);
                    this.selectedProjects = Object.assign({},projects[0]);
                }
            },
            setTaskFormUsers (assignees) {
                let users = typeof assignees == 'undefined' ? 
                        [] : assignees.data;
                
                this.$store.commit( 'setProjectUsers', users );
            },
            changeProject (project) {
                console.log(project);
                this.setTaskFormUsers(project.assignees);
                this.projectId = parseInt( project.id )
            },
            afterGetLists (lists) {
                if(lists.length) {
                    this.listId = lists[0].id;
                    this.selectedLists = lists[0];
                    this.list = lists[0];
                }
            },
            changeList (list) {
                this.listId = parseInt( list.id )
                this.list = Object.assign({}, list);
            },
            afterCreateTask () {

            }
            // afterCreateTask () {
            //     this.closePopup();
               
            // },
            // changeProject (project) {
            //     this.getListsForSelf(project.id);
            //     this.setUsers();
            //     this.setProjectId();
                
            // },

            // setProjectId () {
            //     this.project_id = this.project.id;
            // },

            // setUsers () {
            //     var self = this;
            //     let index = this.getIndex( this.projects, this.project.id, 'id' );
            //     var users = this.projects[index].assignees.data;
            //     var setUsers = [];
                
            //     if(this.users.length) {
            //         this.users.forEach(function(user_id) {
            //             let index = self.getIndex(users, parseInt(user_id), 'id');
            //             if(index !== false) {
            //                 setUsers.push(users[index]);
            //             }
            //         });
                    
            //         if(setUsers.length) {
            //             this.$store.commit('setProjectUsers', setUsers);
            //             this.task.assignees.data = setUsers;
            //         }
                    
            //     } else {
            //         this.$store.commit('setProjectUsers', users);
            //     }
            // },

            // getProjectsForSelf () {
            //     var self = this;

            //     var data = {
            //         select: 'id, title',
            //         with: 'assignees',
            //         status: 'incomplete'
            //     }

            //     if(this.users.length) {
            //         data.inUsers = this.users;
            //     }

            //     var request = {
            //         url: self.base_url + '/pm/v2/advanced/projects',
            //         data: data,
            //         success (res) {
            //             self.projects = res.data;
            //             self.fetchProjects = true;

            //             if(res.data.length) {
            //                 self.project = res.data[0];
            //                 self.getListsForSelf(res.data[0].id);
            //                 // self.setUsers();
            //                 // self.setProjectId();
            //             }
            //         },

            //         error (res) {

            //         }
            //     }

            //     self.httpRequest(request);
            // },

            // asyncListsFind (title) {
            //     if(title == '') return;
            //     var self = this;
            //     clearTimeout(this.timeout);

            //     // Make a new timeout set to go off in 800ms
            //     this.timeout = setTimeout(function () {
            //         self.findLists(title);
            //     }, 500);
            // },

            // findLists (title) {
            //     var self = this;

            //     if(self.listAbort) {
            //         self.listAbort.abort();
            //     }

            //     var request = {
            //         url: self.base_url + '/pm/v2/advanced/'+self.project.id+'/task-lists',
            //         data: {
            //             select: 'id, title, project_id',
            //             project_id: self.project.id,
            //             title: title,
            //         },
            //         success: function(res) {
            //             self.loadingListSearch = false;
            //             self.setList(res.data);
            //         }
            //     }
            //     self.loadingListSearch = true;
            //     self.listAbort = self.httpRequest(request);
            // },

            // setList (lists) {
            //     var self = this;
            //     var newLists = [];
                
            //     lists.forEach(function(list) {
            //         let index = self.getIndex(self.lists, list.id, 'id');
                
            //         if(index === false) {
            //             newLists.push(list);

            //             let storeIndex = self.getIndex(self.storeLists, self.project.id, 'project_id');
            //             self.storeLists[storeIndex].lists.push(list);
            //         }
            //     })

            //     if(newLists.length) {
            //         this.lists = this.lists.concat(newLists);
            //     }
            // },

            // getListsForSelf (project_id) {
            //     var self = this;
                
            //     if(self.listHasInStore(project_id)) {
            //         self.setListInlocal(project_id);
            //         return;
            //     }
                
            //     var request = {
            //         url: self.base_url + '/pm/v2/advanced/'+project_id+'/task-lists',
            //         data: {
            //             select: 'id, title, project_id',
            //             project_id: project_id,
            //             per_page: 300
            //         },
            //         success (res) {
            //             self.lists = res.data;
            //             self.loadingLists = false;

            //             if(res.data.length) {
            //                 self.list = res.data[0];
            //             }
            //             self.storeLists.push({
            //                 'project_id': project_id,
            //                 'lists': res.data  
            //             });
            //         },

            //         error (res) {

            //         }
            //     }
            //     self.loadingLists = true;
            //     self.lists = [];
            //     self.httpRequest(request);
            // },

            // listHasInStore (project_id) {
            //     let index = this.getIndex(this.storeLists, project_id, 'project_id');

            //     if(index === false) {
            //         return false;
            //     }

            //     return true;
            // },

            // setListInlocal (project_id) {
            //     let index  = this.getIndex(this.storeLists, project_id, 'project_id');
            //     this.lists = this.storeLists[index].lists;
            //     this.list  = this.lists[0];
            // },

           
        }
    }
</script>

<style lang="less">

    .pm-task-create-fields {
        .display-none {
            display: none;
        }
        .display-block {
            display: block;
        }
    }
</style>



