<template>
<div>

	<form action="" method="post" class="cpm-project-form" @submit.prevent="selfNewProject();">

		<div class="cpm-form-item project-name">
			<!-- v-model="project_name" -->
			<input type="text" v-model="project.title" name="project_name" id="project_name" placeholder="Name of the project" value="" size="45" />
		</div>

		<div class="cpm-form-item project-category">
			<!-- v-model="project_cat" -->
			<select v-model="project_category"  name='project_cat' id='project_cat' class='chosen-select' >
				<option value="0">&#8211; Project Category &#8211;</option>
				<option v-for="category in categories" :value="category.id">{{ category.title }}</option>
			</select>
		</div>

		<div class="cpm-form-item project-detail">
			<!-- v-model="project_description" -->
			<textarea v-model="project.description" name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
		</div>

		<div class="cpm-form-item cpm-project-role">
			<table>
				<tr v-for="projectUser in project_users" key="projectUser.id">
		            <td>{{ projectUser.display_name }}</td>
		            <td>
		                <select  v-model="projectUser.roles.data[0].id">
		                	<option v-for="role in roles" :value="role.id">{{ role.title }}</option>
		                </select>
		            </td>
		          
		            <td>
		            	<a @click.prevent="deleteUser(projectUser)" hraf="#" class="cpm-del-proj-role cpm-assign-del-user">
		            		<span class="dashicons dashicons-trash"></span> 
		            		<span class="title">Delete</span>
		            	</a>
		            </td>
	        	</tr>
			</table>
		</div>
		
		<div class="cpm-form-item project-users">
			<input v-pm-users class="cpm-project-coworker" type="text" name="user" placeholder="Type 3 or more characters to search users..." size="45">
		</div>

		<div class="cpm-form-item project-notify">
			<label>
				<input type="checkbox" v-model="project_notify" name="project_notify" id="project-notify" value="yes" />
				Notify Co-Workers            
			</label>
		</div>

		<div class="submit">
			<input type="hidden" name="action" value="cpm_project_new">
			<span class="cpm-pro-update-spinner"></span>
			<input type="submit" name="add_project" id="add_project" class="button-primary" value="Add New Project">
			<a @click.prevent="showHideProjectForm(false)" class="button project-cancel" href="#">Cancel</a>
		</div>

		<div class="cpm-loading" style="display: none;">Saving...</div>
	</form>

    <div v-cpm-user-create-popup-box id="cpm-create-user-wrap" title="Create a new user">
        <project-new-user-form></project-new-user-form>
    </div>
</div>
</template>

<script>
	import directive from './directive.js';
	import project_new_user_form from './project-new-user-form.vue';

	var new_project_form = {

		props: ['is_update'],

		data () {

			return {
				'project_name': '',
				'project_cat': 0,
				'project_description': '',
				'project_notify': false,
				'assignees': [],

			}
		},
		components: {
			'project-new-user-form': project_new_user_form,
		},
		computed: {
			roles () {
				return this.$root.$store.state.roles;
			},

			categories () {
				return this.$root.$store.state.categories;
			},

			project () {
				var projects = this.$root.$store.state.projects;
                var index = this.getIndex(projects, this.project_id, 'id');
                
                if ( index !== false ) {
                    return projects[index];
                } 
				return {};
			},

			project_users () {
				var projects = this.$root.$store.state.projects;
                var index = this.getIndex(projects, this.project_id, 'id');
                
                if ( index !== false ) {
                	return projects[index].assignees.data;
                } 
				return [];
			},
				
	
			project_category: {
				get () {
					if (this.is_update) {
						var projects = this.$root.$store.state.projects;
	               		var index = this.getIndex(projects, this.project_id, 'id');
	               		var project = projects[index];
					
						if ( 
							typeof project.categories !== 'undefined' 
								&& 
							project.categories.data.length 
						) {

							this.project_cat = project.categories.data[0].id;
							
							return project.categories.data[0].id;
						}
					}

					return this.project_cat;
				},

				set (cat) {
					this.project_cat = cat;
				}
			},

		},

		methods: {

			deleteUser (del_user) {
				this.$root.$store.commit(
					'afterDeleteUserFromProject', 
					{
						project_id: this.project_id,
						user_id: del_user.id
					}
				);
			},

			selfNewProject () {
				if (this.is_update) {
					this.updateSelfProject();
				} else {
					this.newProject();
				}
			},

			updateSelfProject () {
				var data = {
					'id': this.project.id,
					'title': this.project.title,
                    'categories': [this.project_cat],
                    'description': this.project.description,
                    'notify_users': this.project_notify,
                    'assignees': this.formatUsers(this.project_users),
                    'status': typeof this.project.status === 'undefined' ? 'incomplete' : this.project.status,
                },
                self = this;

                self.updateProject(data, function(res) {
                	
                });	
			}
		}
	}

	export default new_project_form;
</script>
