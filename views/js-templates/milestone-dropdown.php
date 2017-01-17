<select v-model="selected_milestone">
	<option value="">
		--Milestone--
	</option>
	<option v-for="milestone in milestones" v-bind:value="milestone.ID">
		{{ milestone.post_title }}
	</option>
</select>