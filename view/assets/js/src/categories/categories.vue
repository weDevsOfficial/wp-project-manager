<template>
	<div class="wrap nosubsub">
		<h1 class="wp-heading-inline">Categories</h1>
		<hr class="wp-header-end">
		<div id="ajax-response"></div>

		<form class="search-form wp-clearfix" method="get">
		
			<p class="search-box">
				<label class="screen-reader-text" for="tag-search-input">Search Categories:</label>
				<input type="search" id="tag-search-input" name="s" value="">
				<input type="submit" id="search-submit" class="button" value="Search Categories">
			</p>

		</form>

		<div id="col-container" class="wp-clearfix">

			<div id="col-left">
				<div class="col-wrap">


					<div class="form-wrap">
						<h2>Add New Category</h2>
						<form @submit.prevent="newCategory()" id="addtag" method="post" action="edit-tags.php" class="validate" >
							
							<div class="form-field form-required term-name-wrap">
								<label for="tag-name">Name</label>
								<input v-model="title" required="required" name="tag-name" id="tag-name" type="text" value="" size="40" aria-required="true">
								<p></p>
							</div>

							<div class="form-field term-description-wrap">
								<label for="tag-description">Description</label>
								<textarea v-model="description" name="description" id="tag-description" rows="5" cols="40"></textarea>
								<p></p>
							</div>

							<p class="submit">
								<input type="submit" name="submit" id="submit" class="button button-primary" value="Add New Category">
							</p>
						</form>
					</div>

				</div>
			</div><!-- /col-left -->

			<div id="col-right">
				<div class="col-wrap">
					<form id="posts-filter" method="post">
					
						<div class="tablenav top">
							<div class="alignleft actions bulkactions">
								<label for="bulk-action-selector-top" class="screen-reader-text">Select bulk action</label>
								<select name="action" id="bulk-action-selector-top">
									<option value="-1">Bulk Actions</option>
									<option value="delete">Delete</option>
								</select>
								<input type="submit" id="doaction" class="button action" value="Apply">
							</div>
							
							<br class="clear">
						</div>
						<pre>{{ categories }}</pre>
						<table class="wp-list-table widefat fixed striped tags">
							<thead>
								<tr>
									<td id="cb" class="manage-column column-cb check-column">
										<label class="screen-reader-text" for="cb-select-all-1">Select All</label>
										<input id="cb-select-all-1" type="checkbox">
									</td>
									<th scope="col" id="name" class="manage-column column-name column-primary sortable desc">
										<a href="#">
											<span>Name</span>
										</a>
									</th>
									<th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>Description</span>
										</a>
									</th>
									<th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>Type</span>
										</a>
									</th>
								</tr>
							</thead>

							<tbody id="the-list" data-wp-lists="list:tag">
								<tr id="tag-1" v-for="categori in categories" key="categori.id">
									<th scope="row" class="check-column">
										<input type="checkbox" name="delete_tags[]" value="48" id="cb-select-48">
									</th>
									<td class="name column-name has-row-actions column-primary" data-colname="Name">
										<strong>
											<a class="row-title" href="">{{ categori.title }}</a>
										</strong>
									
										<div class="row-actions">
											<span class="edit">
												<a href="#">Edit</a> 
											</span>
										</div>
									</td>
									<td class="description column-description" data-colname="Description">{{ categori.description }}</td>
									<td class="description column-description" data-colname="Description">{{ categori.categorible_type }}</td>
								</tr>	
							</tbody>

							<tfoot>
								<tr>
									<td class="manage-column column-cb check-column">
										<input id="cb-select-all-2" type="checkbox">
									</td>

									<th scope="col" class="manage-column column-name column-primary sortable desc">
										<a href="#">
											<span>Name</span>
										</a>
									</th>

									<th scope="col" class="manage-column column-description sortable desc">
										<a href="#">
											<span>Description</span>
										</a>
									</th>	
									<th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>Type</span>
										</a>
									</th>
								</tr>
							</tfoot>

						</table>
					
						<div class="tablenav bottom">

							<div class="alignleft actions bulkactions">
								<select name="action2" id="bulk-action-selector-bottom">
									<option value="-1">Bulk Actions</option>
									<option value="delete">Delete</option>
								</select>
								<input type="submit" id="doaction2" class="button action" value="Apply">
							</div>
							<br class="clear">
						</div>
					</form>
				</div>
			</div><!-- /col-right -->
		</div><!-- /col-container -->
	</div>
</template>

<script>
	
	export default {
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.getCategories();
			});
		},

		data () {
			return {
				title: '',
				description: '',
				submit_disabled: false
			}
		},

		computed: {
			categories () {
				return this.$store.state.categories;
			}
		},

		methods: {

		}
	}
</script>