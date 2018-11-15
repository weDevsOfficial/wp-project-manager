<template>
    <span v-html="parseMessage"></span>
</template>

<script>
    
    export default {
        props :{
            activity: {
                type: Object,
                required: true
            },
            page: {
                type: String,
                default: ''
            }
        },
        data (){
            return {

            }
        },

        computed :{
            parseMessage() {
                var obj = this.activity,
                    identifiers = this.fetchIdentifiers(obj.message);

                for(let i = 0; i < identifiers.length; i++) {
                    let identifier = identifiers[i].replace(/\{\{|\}\}/g, ''),
                        link = this.isLinkable(identifier);

                    if(link) {
                        obj.message = obj.message.replace(identifiers[i], link);
                    } else {
                        obj.message = obj.message.replace(identifiers[i], this.getIdentifierValue(identifier));
                    }
                }

                return obj.message;
            },
        },

        methods: {
            fetchIdentifiers: function(message) {
                var regex = /\{\{[a-zA-Z._0-9\$]*\}\}/g,
                    match = [];
                do {
                    var m = regex.exec(message);
                    if (m) {
                        match.push(m[0]);
                    }
                } while (m);

                return match;
            },
            linkableIdentifiers: function() {
                var obj = this.activity;
                return {
                    'actor.data.display_name': "<a href='"+ this.actor_url() + "'>" + obj.actor.data.display_name + "</a>",
                    'meta.project_title': "<a href='"+ this.resolve_url() + "'>" + obj.meta.project_title + "</a>",
                    'meta.project_title_old': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.project_title_old + "</a>",
                    'meta.old_project_title': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.old_project_title + "</a>",
                    'meta.project_title_new': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.project_title_new + "</a>",
                    'meta.discussion_board_title': "<a href='"+ this.resolve_url() + "'>" + obj.meta.discussion_board_title + "</a>",
                    'meta.deleted_discussion_board_title': "<strong>" + obj.meta.deleted_discussion_board_title + "</strong>",
                    'meta.discussion_board_title_old': "<a href='"+ this.resolve_url() + "'>" + obj.meta.discussion_board_title_old + "</a>",
                    'meta.discussion_board_title_new': "<a href='"+ this.resolve_url() + "'>" + obj.meta.discussion_board_title_new + "</a>",
                    'meta.task_list_title': "<a href='"+ this.resolve_url() + "'>" + obj.meta.task_list_title + "</a>",
                    'meta.deleted_task_list_title': "<strong>" + obj.meta.deleted_task_list_title + "</strong>",
                    'meta.task_list_title_old': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.task_list_title_old + "</a>",
                    'meta.task_list_title_new': "<a href='"+ this.resolve_url() + "'>" + obj.meta.task_list_title_new + "</a>",
                    'meta.milestone_title': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.milestone_title + "</a>",
                    'meta.deleted_milestone_title': "<strong>" + obj.meta.deleted_milestone_title + "</strong>",
                    'meta.milestone_title_old': "<a href='"+ this.resolve_url() + "'>" + obj.meta.milestone_title_old + "</a>",
                    'meta.milestone_title_new': "<a href='"+ this.resolve_url( ) + "'>" + obj.meta.milestone_title_new + "</a>",
                    'meta.task_title': "<a href='"+ this.resolve_url() + "'>" + obj.meta.task_title + "</a>",
                    'meta.deleted_task_title': "<strong>" + obj.meta.deleted_task_title + "</strong>",
                    'meta.task_title_old': "<a href='"+ this.resolve_url() + "'>" + obj.meta.task_title_old + "</a>",
                    'meta.task_title_new': "<a href='"+ this.resolve_url() + "'>" + obj.meta.task_title_new + "</a>",
                    'meta.file_title': "<a href='"+ this.resolve_url() + "'>" + obj.meta.file_title + "</a>",
                    'meta.file_title_old': "<a href='"+ this.resolve_url() + "'>" + obj.meta.file_title_old + "</a>",
                    'meta.file_title_new': "<a href='"+ this.resolve_url() + "'>" + obj.meta.file_title_new + "</a>",
                    'meta.task_status_old': "<strong>" + obj.meta.task_status_old + "</strong>",
                    'meta.task_status_new': "<strong>" + obj.meta.task_status_new + "</strong>",                    
                    'meta.project_status_new': "<strong>" + obj.meta.project_status_new + "</strong>",
                    'meta.project_status_old': "<strong>" + obj.meta.project_status_old + "</strong>",
                    'meta.task_start_at_new': obj.meta.task_start_at_new !== null ? "<strong>" + pm.Moment(obj.meta.task_start_at_new).format('MMMM Do YYYY') + "</strong>" : "<strong>...</strong>",
                    'meta.task_start_at_old': obj.meta.task_start_at_old !== null ?  "<strong>" + pm.Moment(obj.meta.task_start_at_old).format('MMMM Do YYYY') + "</strong>": "<strong>...</strong>",
                    'meta.task_due_date_new': obj.meta.task_due_date_new !== null ? "<strong>" + pm.Moment(obj.meta.task_due_date_new).format('MMMM Do YYYY') + "</strong>": "<strong>...</strong>",
                    'meta.task_due_date_old': obj.meta.task_due_date_old !== null ?  "<strong>" + pm.Moment(obj.meta.task_due_date_old).format('MMMM Do YYYY') + "</strong>": "<strong>...</strong>",
                };
            },
            isLinkable: function(identifier) {
                var obj = this.activity,
                    identifiers = this.linkableIdentifiers();

                for(const prop in identifiers) {
                    if (prop === identifier) return identifiers[prop];
                }

                return false;
            },
            getIdentifierValue: function(identifier) {
                var props = identifier.split('.'),
                    count = 0,
                    prop  = props[count],
                    value = this.activity;

                while(count < props.length) {
                    value = value[prop];
                    count = count + 1;
                    prop  = props[count];
                }

                return value;
            },

            resolve_url () {
                //return this.$router.resolve({ name : name, params: params }).href;
                var url,
                resource_type= this.activity.resource_type,
                resource_id = this.activity.resource_id,
                meta = this.activity.meta,
                project_id = this.activity.project.data.id;

                
                switch (resource_type) {
                    case 'task':
                        if (this.page == 'project') {
                            url = this.$router.resolve({ name : 'activity_single_task' , params: { project_id: project_id, task_id: resource_id }  }).href;
                        } else {
                            url = this.$router.resolve({ name : 'lists_single_task' , params: { project_id: project_id, task_id: resource_id }  }).href;
                        }
                        
                        break;
                    case 'project':
                        url =  this.$router.resolve({ name : 'pm_overview' , params: { project_id: resource_id }  }).href;
                        if ( 'duplicate_project' == this.activity.action ) {
                            url = this.$router.resolve({ name : 'pm_overview' , params: { project_id: meta.old_project_id }  }).href;
                        }
                        break;
                    case 'milestone':
                        url =  this.$router.resolve({ name : 'milestones' , params: { project_id: project_id  }  }).href;
                        break;

                    case 'discussion_board':
                        url =  this.$router.resolve({ name : 'individual_discussions' , params: { project_id: project_id, discussion_id: resource_id  }  }).href;
                        break;
                    case 'task_list':
                        url =  this.$router.resolve({ name : 'single_list' , params: { project_id: project_id, list_id: resource_id  }  }).href;
                        break;
                    case 'file':
                        url =  this.$router.resolve({ name : 'singleFile' , params: { project_id: project_id, fileId: resource_id, folder_id: meta.parent  }  }).href;
                        break;
                    default:
                        url = '#';
                        break;
                }
                return url;
            },

            actor_url () {
                
                var current_user = PM_Vars.current_user.ID;
                var userid = this.activity.actor.data.id;

                if (!PM_Vars.is_pro) {
                    return this.$router.resolve({ name: 'my-tasks'}).href;
                    
                }

                if (userid == current_user ) {
                    return this.$router.resolve({name: 'mytask-tasks'}).href;
                    
                }

                return this.$router.resolve({name: 'mytask-tasks', params: {user_id: userid}}).href;
            }
        }
    }
</script>
