<template>
	<form action="" method="post" class="cpm-project-form" @submit.prevent="newProject()">


		<div class="cpm-form-item project-name">
			<input type="text" v-model="project_name" name="project_name" id="project_name" placeholder="Name of the project" value="" size="45" />
		</div>

		<div class="cpm-form-item project-category">
			<select v-model="project_cat"  name='project_cat' id='project_cat' class='chosen-select' >
				<option value='-1' selected='selected'>&#8211; Project Category &#8211;</option>
			</select>
		</div>

		<div class="cpm-form-item project-detail">
			<textarea v-model="project_description" name="project_description" class="cpm-project-description" id="" cols="50" rows="3" placeholder="Some details about the project (optional)"></textarea>
		</div>

		<div class="cpm-form-item cpm-project-role">
			<table>
				<tr v-for="projectUser in projectUsers">
		            <td>{{ projectUser.display_name }}</td>
		            <td>
		                <select v-model="projectUser.role">
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

</template>

<script>
	import directive from './directive.js';

	var new_project_form = {

		data () {
			return {
				'project_name': '',
				'project_cat': '',
				'project_description': '',
				'project_notify': false
			}
		},

		computed: {
			projectUsers () {
				return this.$store.state.project_users;
			},

			roles () {
				return this.$store.state.roles;
			}
		},

		methods: {
			newProject () {
				var request = {
					data: {
						'project_name': 'mishu',
						'project_cat': 'rocky'
					},
					success: function(res) {
                	
	                },

	                error: function(res) {
	                    
	                }
				};

				this.send('create_new_project', request);
			}
		}
	}

	export default new_project_form;
</script>
