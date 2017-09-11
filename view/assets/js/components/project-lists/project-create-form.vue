<template>
<div>







	<form action="" method="post" class="cpm-project-form" @submit.prevent="newProject()">


		<div class="cpm-form-item project-name">
			<input type="text" v-model="project_name" name="project_name" id="project_name" placeholder="Name of the project" value="" size="45" />
		</div>

		<div class="cpm-form-item project-category">
			<select v-model="project_cat"  name='project_cat' id='project_cat' class='chosen-select' >
				<option value="0">&#8211; Project Category &#8211;</option>
				<option v-for="category in categories" :value="category.id">{{ category.title }}</option>
			</select>
		</div>

		<div class="cpm-form-item project-detail">
			<textarea v-model="project_description" name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
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
		            	<a hraf="#" class="cpm-del-proj-role cpm-assign-del-user"><span class="dashicons dashicons-trash"></span> <span class="title">Delete</span></a>
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
			<a class="button project-cancel" href="#">Cancel</a>
		</div>

		<div class="cpm-loading" style="display: none;">Saving...</div>
	</form>
</div>
</template>

<script>
	import directive from './directive.js';

	var new_project_form = {

		data () {
			return {
				'project_name': '',
				'project_cat': '0',
				'project_description': '',
				'project_notify': false,
				'project_users': this.$store.state.project_users
			}
		},

		computed: {
			roles () {
				return this.$store.state.roles;
			},

			categories () {
				return this.$store.state.categories;
			}
		},

		methods: {
			newProject () {
				var self = this;

				var request = {
					type: 'POST',

					url: this.base_url + '/cpm/v2/projects/',

					data: {
						'title': this.project_name,
						'categories': [this.project_cat],
						'description': this.project_description,
						'notify_users': this.project_notify,
						'assignees': this.formatUsers(this.project_users)
					},

					success: function(res) {
                		self.$store.commit('newProject', {'projects': res.data});
                		jQuery( "#cpm-project-dialog" ).dialog("close");
	                },

	                error: function(res) {
	                    
	                }
				};
				
				this.httpRequest(request);
			},

			formatUsers (users) {
				var format_users = [];
				
				users.map(function(user, index) {
					format_users.push({
						'user_id': user.id,
						'role_id': user.roles.data.id
					});
				});

				return format_users;
			}
		}
	}

	export default new_project_form;
</script>
