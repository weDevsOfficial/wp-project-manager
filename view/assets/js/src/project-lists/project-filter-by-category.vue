<template>
	<div>
		<form action="" method="get" class="cpm-project-filters" id="cpm-project-filters">
			<select @change="categoryFilter()" v-model="categorie_id">
		        <option value="-1">
		           {{text.project_category}}
		        </option>
		        <option v-for="categorie in categories" :value="categorie.id">
		            {{ categorie.title }}
		        </option>
		    </select>
	    </form>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				categorie_id: typeof this.$route.query.category === 'undefined' 
					? '-1' : this.$route.query.category
			}
		},
		computed: {
			categories () {
				return this.$root.$store.state.categories;
			}
		},


		methods: {
			categoryFilter () {
				var self = this;
				var extra_ele = {
					'category': self.categorie_id === '-1' ? false : self.categorie_id
				}

				var setQuery = this.setQuery(extra_ele);
				
				this.$router.push({
					query: setQuery
				});
			}
		}
	} 
</script>