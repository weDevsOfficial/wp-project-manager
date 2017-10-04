<template>
    <div>

    	<article class="cpm-project cpm-column-gap-left cpm-sm-col-12" v-for="project in projects">
            <router-link 
                :title="project.title"
                :to="{ name: 'pm_overview',  params: { project_id: project.id }}">
                
                <div class="project_head">
                    <h5>{{ project.title }}</h5>

                    <div class="cpm-project-detail"></div>
                </div>
                
            </router-link>

    	    <div class="cpm-project-meta">
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
                                Discussions

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
                                Task Lists
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
                                Tasks
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
                                Milestones
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
                                Files
                        </router-link>
                    </li>

                    <li class="milestone">
                        <a href="#">

                            <strong>
                                <i class="fa fa-circle" aria-hidden="true"></i>
                                {{ parseInt(project.meta.total_comments) }}
                            </strong> 
                                Comments
                        </a>
                    </li>

            		<div class="clearfix"></div>
            	</ul>
            </div>

    	     <div class="cpm-progress cpm-progress-info">
    	        <div :style="projectCompleteStatus(project)" class="bar completed"></div>
    	    </div>

            <div class="cpm-progress-percentage"></div>

            <footer class="cpm-project-people">
                <div class="cpm-scroll">
                    <img v-for="user in project.assignees.data" :alt="user.display_name" :src="user.avatar_url" class="avatar avatar-48 photo" height="48" width="48">  
                </div>
            </footer>
        
            <div class="cpm-project-action-icon">
    	        <div class="cpm-project-action">
    				<span @click.prevent="settingsShowHide(project)" class="dashicons dashicons-admin-generic cpm-settings-bind"></span>


    				<ul v-if="project.settings_hide" class="cpm-settings">
    				    <li>
    				        <span class="cpm-spinner"></span>
    				        <a @click.prevent="deleteProject(project.id)" href="#" class="cpm-project-delete-link" title="Delete project" data-confirm="Are you sure to delete this project?" data-project_id="60">
    				            <span class="dashicons dashicons-trash"></span>
    				            <span>Delete</span>
    				        </a>
    				    </li>
    				    <li>
    				        <span class="cpm-spinner"></span>
				            <a @click.prevent="projectComplete(project)" class="cpm-archive" data-type="archive" data-project_id="60" href="#">
				                <span class="dashicons dashicons-yes"></span>
				                <span>Complete</span>
				            </a>
    				    </li>

    				    <li>
				            <span class="cpm-spinner"></span>
				            <a class="cpm-duplicate-project" href="#" data-project_id="60">
				                <span class="dashicons dashicons-admin-page"></span>
				                <span>Duplicate</span>
				            </a>
    				    </li>
    				</ul>
    			</div>
    		</div>
    	</article>
    </div>
</template>


<script>
    export default {
        data () {
            return {
                is_active_settings: false
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
            deleteProject (id) {
                if ( ! confirm( 'Are you sure!' ) ) {
                    return;
                }
                var self = this;
                var request_data = {
                    url: self.base_url + '/cpm/v2/projects/' + id,
                    type: 'DELETE',
                    success: function(res) {
                        self.$root.$store.commit('afterDeleteProject', id);

                        if (!self.$root.$store.state.projects.length) {
                            self.$router.push({
                                name: 'project_lists', 
                            });
                        } else {
                            self.getProjects();
                        }
                    }
                }

                self.httpRequest(request_data);
            },

            settingsShowHide (project) {
                project.settings_hide = project.settings_hide ? false : true;
            }

            projectCompleteStatus (project) {
                return ((100 * $progress['completed']) /  $progress['total']) + '%';
            }
        }
    }

</script>

<style>
    .fa-circle {
        margin-right: 6%;
    }
</style>



