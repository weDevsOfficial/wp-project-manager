<template>
	<div>
	    <div class="cpm-col-7">
	        <router-link 
	            :to="{
	                name: 'single_list',
	                params: {
	                    project_id: project_id,
	                    list_id: list.id
	                }}">

	            {{ list.title }}

	        </router-link>
	    </div>
	    
	    <div class=" cpm-col-3">
	        <div class="cpm-progress cpm-progress-info">
	            <div :style="getProgressStyle( list )" class="bar completed"></div>
	        </div>

	    </div>
	    <div class="cpm-col-1 cpm-right cpm-last-col">
	        {{ getProgressPercent( list ) }}%                                
	    </div>
	    <div class="clearfix"></div>
	</div>
</template>

<script>
	export default {
		props: ['list']
	}
</script>