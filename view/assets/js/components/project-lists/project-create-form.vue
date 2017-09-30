<template>
<div>

	<form action="" method="post" class="cpm-project-form" @submit.prevent="newProject();">


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
				<tr v-for="projectUser in project_users">
		            <td>{{ projectUser.display_name }}</td>
		            <td>
		                <select v-model="projectUser.roles.data.id">
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
        <project-new-user-form :project_users="project_users"></project-new-user-form>
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
				'project_users': [],

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
				if (this.is_update) {
					this.project_users = this.$root.$store.state.project_users;
					return this.$root.$store.state.project;
				}
				
				return {};
			},

			project_category: {
				get () {
					if (this.is_update) {
						var project = this.$root.$store.state.project;
					
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

			formatUsers (users) {
				var format_users = [];
				
				users.map(function(user, index) {
					format_users.push({
						'user_id': user.id,
						'role_id': user.roles.data.id
					});
				});

				return format_users;
			},

			deleteUser (del_user) {
				this.project_users = this.project_users.filter(function(user) {
					if (user.id === del_user.id) {
						return false;
					} else {
						return user;
					}
				});
			}
		}
	}

	export default new_project_form;
</script>
