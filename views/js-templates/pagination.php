<div v-if="total > 1">
	<div class="cpm-pagination-wrap">

		<router-link v-if="page_number > 1" class="cpm-pagination-btn prev page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number - 1 ) }}">«</router-link>
		<router-link v-for="page in total" :class="pageClass(page) + ' cpm-pagination-btn'" :to="{ name: 'pagination', params: { page_number: page }}">{{ page }}</router-link>
		<router-link v-if="page_number < total" class="cpm-pagination-btn next page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number + 1 ) }}">»</router-link> 

	</div>
	<div class="cpm-clearfix"></div>
</div>
