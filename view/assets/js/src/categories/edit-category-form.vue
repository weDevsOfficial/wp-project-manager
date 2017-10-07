<template>
	<div class="form-wrap">
		
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
				<button type="button" class="save button button-primary alignright">Update Category</button>
				<br class="clear">
			</p>
	
	</div>
</template>

<script>
	export default {
		props: ['category']
	}
</script>