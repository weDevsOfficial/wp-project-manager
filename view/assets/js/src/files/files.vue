<template>
	<div class="wrap cpm cpm-front-end">
		<pm-header></pm-header>

		<div v-if="loading" class="cpm-data-load-before" >
            <div class="loadmoreanimation">
                <div class="load-spinner">
                    <div class="rect1"></div>
                    <div class="rect2"></div>
                    <div class="rect3"></div>
                    <div class="rect4"></div>
                    <div class="rect5"></div>
                </div>
            </div>
        </div>


		<div v-if="!loading" class="cpm-files-page">
			<ul class="cpm-files">        
				<li v-for="file in files">
		            <div class="cpm-thumb">
		                <a class="cpm-colorbox-img" :title="file.name" :href="file.url">
		                	<img :src="file.thumb" :alt="file.name">
		                </a>
		            </div>
		            <div class="">
		                <h3 class="cpm-file-name">{{ file.name }}</h3>

		                <div class="cpm-file-meta">
		                    Attached to 
		                    <a :href="contentURL(file)">{{ attachTo(file) }}</a> 
		                    by 
		                    <a href="#/" title="admin">
		                    	admin
		                	</a>                
		                </div>

		                <div class="cpm-file-action">
		                    <ul>
		                        <li class="cpm-go-discussion"> <a :href="contentURL(file)"></a> </li>
		                        <li class="cpm-download-file"> <a :href="file.url"> </a> </li>
		                        <li class="cpm-comments-count"> <span>  </span> <div class="cpm-btn cpm-btn-blue cpm-comment-count"> 1</div></li>
		                    </ul>
		                </div>
		            </div>
		        </li>
			</ul> 
		</div>
	</div>

</template>

<script>
	import header from './../header.vue';

	export default {
		beforeRouteEnter(to, from, next) {

			next(vm => {
                vm.getFiles();
            });
		},
		components: {
			'pm-header': header
		},
		computed: {
			files () {
				return this.$store.state.files;
			}
		},
		data(){
			return {
				loading: true,
			}
		},
		methods: {
			attachTo (file) {
				if (file.fileable_type === 'discussion-board') {
					return 'Discuss';
				}
			},

			contentURL(file) {
				var self = this;
				switch(file.fileable_type) {
					
					case 'discussion-board':
						return '#/'+self.project_id+'/discussions/'+file.fileable_id;
						break;

					case 'task-list':
						return '#/'+self.project_id+'/task-lists/'+file.fileable_id;
						break;

					case 'task':
						return '#/'+self.project_id+'/task/'+file.fileable_id;
						break;

					default:
						break;
				}
			}
		}


	}

</script>



