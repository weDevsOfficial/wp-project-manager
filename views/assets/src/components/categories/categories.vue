<template>
	<div class="wrap nosubsub">
		<h1 class="wp-heading-inline">{{text.categories}}</h1>
		<hr class="wp-header-end">
		<div id="ajax-response"></div>

	<!-- 	<form class="search-form wp-clearfix" method="get">
		
			<p class="search-box">
				<label class="screen-reader-text" for="tag-search-input">Search Categories:</label>
				<input type="search" id="tag-search-input" name="s" value="">
				<input type="submit" id="search-submit" class="button" value="Search Categories">
			</p>

		</form> -->

		<div id="col-container" class="wp-clearfix">

			<div id="col-left">
				<div class="col-wrap">


					<div class="form-wrap">
						<h2>{{text.add_new_category}}</h2>
						<form @submit.prevent="categoryFormAction()" id="addtag" method="post" action="edit-tags.php" class="validate" >
							
							<div class="form-field form-required term-name-wrap">
								<label for="tag-name">{{text.name}}</label>
								<input v-model="title" required="required" name="tag-name" id="tag-name" type="text" value="" size="40" aria-required="true">
								<p></p>
							</div>

							<div class="form-field term-description-wrap">
								<label for="tag-description">{{text.description}}</label>
								<textarea v-model="description" name="description" id="tag-description" rows="5" cols="40"></textarea>
								<p></p>
							</div>

							<p class="submit">
								<input type="submit" name="submit" id="submit" class="button button-primary" :value="text.add_new_category">
								<span v-show="show_spinner" class="pm-spinner"></span>
							</p>
						</form>
					</div>

				</div>
			</div><!-- /col-left -->

			<div id="col-right">
				<div class="col-wrap">
					<form @submit.prevent="selfDeleted()" id="posts-filter" method="post">
					
						<div class="tablenav top">
							<div class="alignleft actions bulkactions">
								<label for="bulk-action-selector-top" class="screen-reader-text">{{text.select_bulk_action}}</label>
								<select  v-model="bulk_action" name="action">
									<option value="-1">{{text.bulk_actions}}</option>
									<option value="delete">{{text.delete}}</option>
								</select>
								<input type="submit" id="doaction" class="button action" :value="text.apply">
							</div>
							
							<br class="clear">
						</div>
						
						<table class="wp-list-table widefat fixed striped tags">
							<thead>
								<tr>
									<td id="cb" class="manage-column column-cb check-column">
										<label class="screen-reader-text" for="cb-select-all-1">{{text.select_all}}</label>
										<input @change="selectAll()" v-model="select_all"   id="cb-select-all-1" type="checkbox">
									</td>
									<th scope="col" id="name" class="manage-column column-name column-primary sortable desc">
										<a href="#">
											<span>{{text.name}}</span>
										</a>
									</th>
									<th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>{{text.description}}</span>
										</a>
									</th>
									<!-- <th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>Type</span>
										</a>
									</th> -->
								</tr>
							</thead>

							


							<tbody id="the-list" data-wp-lists="list:tag">
								<tr id="tag-1" v-for="category in categories" key="category.id" :class="catTrClass(category)">
									<th v-if="!category.edit_mode" scope="row" class="check-column">
										<input v-model="delete_items" :value="category.id" type="checkbox"  id="cb-select-48">
									</th>
									<td v-if="!category.edit_mode" class="name column-name has-row-actions column-primary" data-colname="Name">
										<strong>
											<a class="row-title" href="">{{ category.title }}</a>
										</strong>
									
										<div class="row-actions">
											<span class="edit">
												<a @click.prevent="showHideCategoryEditForm(category)" href="#">{{text.edit}}</a> 
											</span>
										</div>
										
									</td>
									<td v-if="!category.edit_mode" class="description column-description" data-colname="Description">{{ category.description }}</td>
									<!-- <td v-if="!category.edit_mode" class="description column-description" data-colname="Description">{{ category.categorible_type }}</td> -->

									<td v-if="category.edit_mode" colspan="4">
										<edit-category-form :category="category"></edit-category-form>
									</td>
								</tr>	
							</tbody>





							<tfoot>
								<tr>
									<td class="manage-column column-cb check-column">
										<input @change="selectAll()" v-model="select_all"  id="cb-select-all-2" type="checkbox">
									</td>

									<th scope="col" class="manage-column column-name column-primary sortable desc">
										<a href="#">
											<span>{{text.name}}</span>
										</a>
									</th>

									<th scope="col" class="manage-column column-description sortable desc">
										<a href="#">
											<span>{{text.description}}</span>
										</a>
									</th>	
									<!-- <th scope="col" id="description" class="manage-column column-description sortable desc">
										<a href="">
											<span>Type</span>
										</a>
									</th> -->
								</tr>
							</tfoot>

						</table>


					
						<div class="tablenav bottom">

							<div class="alignleft actions bulkactions">
								<select v-model="bulk_action" name="action" id="bulk-action-selector-bottom">
									<option value="-1">{{text.bulk_actions}}</option>
									<option value="delete">{{text.delete}}</option>
								</select>
								<input type="submit" id="doaction2" class="button action" :value="text.apply">
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
	import edit_category_form from './edit-category-form.vue';
	export default {
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.getCategories();
			});
		},

		components: {
			'edit-category-form': edit_category_form
		},

		data () {
			return {
				title: '',
				description: '',
				submit_disabled: false,
				delete_items: [],
				bulk_action: '-1',
				select_all: false,
				show_spinner: false,
			}
		},

		computed: {
			categories () {
				return this.$store.state.categories;
			}
		},

		methods: {

			selectAll () {
				var self = this;
				this.$store.state.categories.map(function(category, index) {
					self.delete_items.push(category.id);
				});
			},
			catTrClass (category) {
				if (category.edit_mode) {
					return 'inline-edit-row inline-editor';
				}
			},


			selfDeleted () {
				if ( ! confirm( this.text.are_you_sure ) ) {
            return;
        }
				var self = this;
				switch (this.bulk_action) {
					case 'delete':
						self.deleteCategories({category_ids: this.delete_items} );
						break;
				}
			},

			categoryFormAction () {
				// Exit from this function, If submit button disabled 
        if ( this.submit_disabled ) {
            return;
        }
        // Disable submit button for preventing multiple click
        this.submit_disabled = true;
        this.show_spinner = true;

				var args = {
					data:{
						title: this.title,
            description: this.description,
					}
				}
				this.newCategory(args);
				this.title ='';
				this.description = '';
			}
		}
	}
</script>