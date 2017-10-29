<template>
    <div>

        <div v-if="!projects.length">{{text.no_project_found}}</div>

    	<article class="pm-project pm-column-gap-left pm-sm-col-12" v-for="project in projects">
            <router-link 
                :title="project.title"
                :to="{ name: 'pm_overview',  params: { project_id: project.id }}">
                
                <div class="project_head">
                    <h5>{{ project.title }}</h5>

                    <div class="pm-project-detail"></div>
                </div>
                
            </router-link>

    	    <div class="pm-project-meta">
            	<ul>
            		<li class="message">
            			<router-link :to="{
                            name: 'discussions',
                            params: {
                                project_id: project.id
                            }}">

            				<strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_discussion_boards) }}
                            </strong> 
                                {{text.discussions}}

            			</router-link>
            		</li>

            		<li class="todo">
            			<router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

            				<strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_task_lists) }}
                            </strong> 
                                {{text.task_lists}}
            			</router-link>
            		</li>

            		<li class="files">
            			<router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

            				<strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_tasks) }}
                            </strong> 
                                {{text.tasks}}
            			</router-link>
            		</li>

            		<li class="milestone">
            			<router-link :to="{
                            name: 'milestones',
                            params: {
                                project_id: project.id
                            }}">

            				<strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_milestones) }}
                            </strong> 
                                {{text.milestones}}
            			</router-link>
            		</li>   

                    <li class="files">
                        <router-link :to="{
                            name: 'task_lists',
                            params: {
                                project_id: project.id
                            }}">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_files) }}
                            </strong> 
                                {{text.files}}
                        </router-link>
                    </li>

                    <li class="milestone">
                        <a href="#">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_comments) }}
                            </strong> 
                                {{text.comments}}
                        </a>
                    </li>

            		<div class="clearfix"></div>
            	</ul>
            </div>

    	     <div class="pm-progress pm-progress-info">
    	        <div :style="projectCompleteStatus(project)" class="bar completed"></div>
    	    </div>

            <div class="pm-progress-percentage"></div>

            <footer class="pm-project-people">
                <div class="pm-scroll">
                    <img v-for="user in project.assignees.data" :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">  
                </div>
            </footer>

            <div class="pm-project-action-icon">
    	        <div class="pm-project-action">
    				<span @click.prevent="settingsShowHide(project)" :title="text.project_actions" class="dashicons dashicons-admin-generic pm-settings-bind"></span>


    				<ul v-if="project.settings_hide" class="pm-settings">
    				    <li>
    				        <span class="pm-spinner"></span>
    				        <a @click.prevent="deleteProject(project.id)" class="pm-project-delete-link" :title="text.delete_project">
    				            <span class="dashicons dashicons-trash"></span>
    				            <span>{{text.delete}}</span>
    				        </a>
    				    </li>
    				    <li>
    				        <span class="pm-spinner"></span>
				            <a @click.prevent="projectMarkAsDoneUndone(project)" class="pm-archive" >
				                <span v-if="project.status === 'incomplete'" class="dashicons dashicons-yes"></span>
				                <span v-if="project.status === 'incomplete'">{{text.complete}}</span>

                                <span v-if="project.status === 'complete'" class="dashicons dashicons-undo"></span>
                                <span v-if="project.status === 'complete'">{{text.restore}}</span>
                                
				            </a>
    				    </li>

 <!--    				    <li>
				            <span class="pm-spinner"></span>
				            <a class="pm-duplicate-project" href="#" data-project_id="60">
				                <span class="dashicons dashicons-admin-page"></span>
				                <span>Duplicate</span>
				            </a>
    				    </li> -->
    				</ul>
    			</div>
    		</div>
    	</article>

        <div class="pm-clearfix"></div>
    </div>
</template>


<script>
    export default {
        data () {
            return {
                is_active_settings: false,
                is_update: false,
                project: {}
            }
        },
        computed: {
            projects () {
                return this.$root.$store.state.projects;
            },
            meta () {
                return this.$root.$store.state.projects_meta;
            }
        },

        methods: {

            settingsShowHide (project) {
                project.settings_hide = project.settings_hide ? false : true;
            },

            projectCompleteStatus (project) {
                //return ((100 * $progress['completed']) /  $progress['total']) + '%';
            },
            projectMarkAsDoneUndone (project) {
                var self = this;
                var project = {
                    id: project.id,
                    status: project.status === 'complete' ? 'incomplete' : 'complete'
                };

                this.updateProject(project, function(project) {
                    switch (self.$route.name) {
                        
                        case 'project_lists':
                            self.getProjects('status=incomplete');
                            break;

                        case 'completed_projects':
                            self.getProjects('status=complete');
                            break;

                        default:
                            self.getProjects();
                            break;
                    }
                });
            }
        }
    }

</script>

<style>
    .fa-circle {
        margin-right: 6%;
    }
</style>



