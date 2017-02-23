<div class="tablenav" v-if="total > 1">
	<div class="tablenav-pages">

		<router-link v-if="page_number > 1" class="prev page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number - 1 ) }}">«</router-link>
		<router-link v-for="page in total" :class="pageClass(page)" :to="{ name: 'pagination', params: { page_number: page }}">{{ page }}</router-link>
		<router-link v-if="page_number < total" class="next page-numbers" :to="{ name: 'pagination', params: { page_number: ( page_number + 1 ) }}">»</router-link> 

<!-- 		<a class="prev page-numbers" href="/cpm/wp-admin/admin.php?page=cpm_projects&amp;pagenum=2">«</a>
		<a class="page-numbers" href="/cpm/wp-admin/admin.php?page=cpm_projects&amp;pagenum=1">1</a>
		<a class="page-numbers" href="/cpm/wp-admin/admin.php?page=cpm_projects&amp;pagenum=2">2</a>
		<span class="page-numbers current">3</span>
		<a class="page-numbers" href="/cpm/wp-admin/admin.php?page=cpm_projects&amp;pagenum=4">4</a>
		<a class="next page-numbers" href="/cpm/wp-admin/admin.php?page=cpm_projects&amp;pagenum=4">»</a> -->
	</div>
</div>