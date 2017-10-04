<template>
	<div v-if="total_pages > 1">
		<div class="cpm-pagination-wrap">

			<router-link 
				v-if="parseInt(current_page_number) > 1" 
				class="cpm-pagination-btn prev page-numbers" 
				:to="{ name: 'project_pagination',  params: { current_page_number: ( current_page_number - 1 ) }}">
				&laquo;
			</router-link>
			
			<router-link 
				key="page" 
				v-for="page in total_pages" 
				:class="pageClass(page) + ' cpm-pagination-btn'" 
				:to="{ name: 'project_pagination',  params: { current_page_number: page }}">{{ page }}
			</router-link>
			
			<router-link 
				v-if="parseInt(current_page_number) < parseInt(total_pages)" 
				class="cpm-pagination-btn next page-numbers" 
				:to="{ name: component_name,  params: { current_page_number: ( current_page_number + 1 ) }}">
				&raquo;
			</router-link> 

		</div>
		<div class="cpm-clearfix"></div>
	</div>
</template>

<script>
	export default {
		props: ['total_pages', 'current_page_number', 'component_name'],

	    methods: {
	        pageClass: function( page ) {
	            if ( page == this.current_page_number ) {
	                return 'page-numbers current'
	            }

	            return 'page-numbers';
	        },
	    }
	}
</script>