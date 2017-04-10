<div class="tablenav" v-if="total > 1">
	<div class="tablenav-pages">

		<router-link v-if="page_number > 1" class="prev page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number - 1 ) }}">«</router-link>
		<router-link v-for="page in total" :class="pageClass(page)" :to="{ name: 'pagination', params: { page_number: page }}">{{ page }}</router-link>
		<router-link v-if="page_number < total" class="next page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number + 1 ) }}">»</router-link> 

	</div>
</div>