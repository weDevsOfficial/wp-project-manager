<template>
    <div class="list-search-menu">
        <div class="filter-title">
            <div>
                <a href="#" @click.prevent="cancel()" class="icon-pm-cross"></a>
                <span class="active-task-filter">{{__('Task Filter', 'wedevs-project-manager')}}</span>
            </div>
        </div>

        <div class="search-content">
            <form @submit.prevent="actionSearch()">
                <div class="margin-top">
                    <div class="margin-title">{{__('Task list name', 'wedevs-project-manager')}}</div>
                    
                    <div>
                        <multiselect
                            v-model="searchFields.list"
                            :options="searchLists"
                            :show-labels="false"
                            :searchable="true"
                            :loading="asyncListLoading"
                            :placeholder="__('Type task list name', 'pm-pro')"
                            @search-change="asyncFind($event)"
                            label="title"
                            track-by="id">
                            <span slot="noResult">{{ __( 'No task lists found.', 'wedevs-project-manager' ) }}</span>

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
                            v-model="searchFields.user"
                            :options="searchProjectUsers()"
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
                            v-model="searchFields.dueDate"
                            :options="dueDates"
                            :show-labels="false"
                            :placeholder="'Type task list name'"
                            label="title"
                            track-by="id">

                        </multiselect>
                    </div>
                </div>
                <div class="action">
                    <span v-if="taskFilterSpinner" class="pm-spinner"></span>
                    <a @click.prevent="clearFilter()" class="pm-button pm-secondary" href="#">{{__('Clear Filtel', 'wedevs-project-manager')  }}</a>
                    <a @click.prevent="cancel()" class="pm-button pm-secondary" href="#">{{__('Cancel', 'wedevs-project-manager')  }}</a>
                    <input  
                        type="submit" 
                        :class=" runningQuery ? 'submit-btn-color pm-button pm-primary filter-submit-btn' : 'pm-button pm-primary filter-submit-btn'" 
                        name="submit_todo" 
                        :value="__('Done', 'wedevs-project-manager')">
                    
                    <div v-if="runningQuery"  class="pm-circle-spinner"></div>
                </div>
                <div class="pm-clearfix"></div> 
            </form>
        </div> 
       
    </div>
</template>


<style lang="less">
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
            float: right;
            &:after {
                content: "";
                clear: both;
                display: block;
                height: 0;
            }
            .pm-secondary, .pm-spinner {
                margin-right: 10px !important;
            }
            .pm-primary {
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
            .submit-btn-color {
                color: #1A9ED4 !important;
            }

            .pm-circle-spinner {
                &:after {
                    z-index: 999;
                    margin-top: -8px;
                    margin-left: -45.5px;
                    border-color: #f9f9f9 #f9f9f9 #f9f9f9 transparent;
                    position: absolute;
                }
            }
        }
    }
</style>

<script>
    export default {
        data () {
            return {
                searchFields: {
                    user: {
                        id: 0,
                        display_name: this.__('Any', 'wedevs-project-manager')
                    },
                    list: {
                        id: 0,
                        title: this.__('Any', 'wedevs-project-manager')
                    },
                    dueDate: {
                        'id': '0',
                        'title': this.__('Any', 'wedevs-project-manager'),
                    },
                    status: '',
                },
                searchLists: [
                    {
                        id: 0,
                        title: this.__('All', 'wedevs-project-manager')
                    }
                ],
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
                asyncListLoading: false,
                taskFilterSpinner: false,
                runningQuery: false
            }
        },

        created () {
            if(this.$route.query.filterTask == 'active') {
                this.setDefaultFormData();
            }
        },

        components: {
            'multiselect': pm.Multiselect.Multiselect,
        },

        methods: {
            setDefaultFormData () {
                let users = this.searchProjectUsers();
                let userIndex = this.getIndex( users, parseInt(this.$route.query.users), 'id' );
                let dateIndex = this.getIndex( this.dueDates, this.$route.query.dueDate, 'id' );

                if(userIndex != -1) {
                    this.searchFields.user = {
                        id: users[userIndex].id,
                        display_name: users[userIndex].display_name,
                    }
                }

                if(userIndex != -1) {
                    this.searchFields.dueDate = {
                        id: this.dueDates[dateIndex].id,
                        title: this.dueDates[dateIndex].title,
                    }
                }

                this.searchFields.status = this.$route.query.status;
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

                this.searchFields.list = newLists[0];
                this.searchLists = newLists;
            },
            changeFilterStatus (status) {
                this.searchFields.status = status;
            },
            completeBoder () {
                return this.searchFields.status == 'complete' ? 'complete-status' : '';
            },
            onGoingBorder () {
                return this.searchFields.status == 'incomplete' ? 'incomplete-status' : '';
            },
            asyncFind (evt) {
                var self = this,
                timeout = 2000,
                timer;

                if(evt == '') {
                    return;
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
            searchProjectUsers() {
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

            actionSearch () {
                if(this.runningQuery) {
                    return;
                }
                var self = this;
                this.runningQuery = true;
                this.$emit('listSearch', this.searchFields, function() {
                    self.runningQuery = false;
                });
            },

            cancel () {
                this.$emit('listSearchCancel', this.searchFields);
            },

            clearFilter () {
                this.$emit('clearFilter', this.searchFields);
            }

        }
    }
</script>












