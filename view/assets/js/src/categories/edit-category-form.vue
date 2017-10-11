<template>
	<div class="form-wrap">
		<form action="" @submit.prevent="updateSelfCategory()">
			<fieldset>
				<legend class="inline-edit-legend">Quick Edit</legend>
				<div class="inline-edit-col">
				<label>
					<span class="title">Name</span>
					<span class="input-text-wrap">
						<input v-model="category.title" type="text" name="name" class="ptitle" value="">
					</span>
				</label>
					<label>
					<span class="title">Description</span>
					<span class="input-text-wrap">
						<textarea v-model="category.description"></textarea>
					</span>
				</label>
				</div>
			</fieldset>

			<p class="inline-edit-save submit">
				<button @click.prevent="showHideCategoryEditForm(category)" type="button" class="cancel button alignleft">Cancel</button>
				<input type="submit" class="save button button-primary alignright" value="Update Category">
				<span v-show="show_spinner" class="cpm-spinner"></span>
				<br class="clear">
			</p>
		</form>
	</div>
</template>

<script>
	export default {
		props: ['category'],

		data () {
			return {
				submit_disabled: false,
				show_spinner:false,
			}
		},

		methods: {
			updateSelfCategory () {
				var data = {
					id: this.category.id,
					title: this.category.title,
					description: this.category.description
				};

				this.updateCategory(data);
			}
		}
	}
</script>