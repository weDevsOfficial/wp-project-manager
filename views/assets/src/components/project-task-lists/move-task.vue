<template>
	<div class="pm-move-task-wrap"> 
		<div class="popup-mask"> 

	        <div class="popup-container">
	            <span class="close-modal">
	                <a href="#" @click.prevent="closeModal()"><span class="dashicons dashicons-no"></span></a>
	            </span>
	            
		           	<div class="popup-body">
		           		<form action="" @submit.prevent="move()" method="post">
		           			<div class="pm-task-title"><strong>{{ __('Task: ', 'wedevs-project-manager') }}</strong>{{ items.task.title }}</div>
			           		<div>

			                    <multiselect
			                        ref="assingTask"
			                        id="assingTask"
			                        v-model="moveListId"
			                        :options="items.lists"
			                        :multiple="false"
			                        :close-on-select="true"
			                        :clear-on-select="true"
			                        :loading="isLoading"
			                        @search-change="asyncFind($event)"
			                        :show-labels="true"
			                        :searchable="true"
			                        :placeholder="__('Search Lists', 'wedevs-project-manager')"
			                        select-label=""
			                        selected-label="selected"
			                        deselect-label=""
			                        label="title"
			                        track-by="id"
			                        :allow-empty="true">

			                    </multiselect>
			           		
							</div>
							<div class="pm-right">
								<span v-if="spinner" class="pm-spinner"></span>
								<input type="submit" class="button button-primary" :value="__('Move Task', 'wedevs-project-manager')">
							</div>
						</form>
					</div>
					
				
			</div>
		</div>
	</div>
</template>

<style lang="less">

	.pm-move-task-wrap {
		.pm-task-title {
			margin-bottom: 10px;
		}
		.pm-right {
			display: flex;
		    align-items: center;
		    margin-top: 10px;

		    .pm-spinner {
		    	margin-right: 10px;
		    }
		}
		.popup-container {
			max-width: 390px !important;
		    margin-left: auto !important;
		    margin-right: auto !important;
		    background: #fff !important;
		    border-top-right-radius: 0 !important;
		    height: 200px !important;
		    top: 20vh !important;
		    position: relative !important;
		}
	}

</style>

<script>
	import Multiselect from 'vue-multiselect';
	import Mixins from './mixin';

	export default {
		props: {
			items: {
				type: [Object],
				default () {
					return {
						task: {},
	                    list: {},
	                    lists: [],
	                    projectId: false,
	                    popupModal: false,
					}
				}
			}
		},

		data () {
			return {
				moveListId: '',
				asyncListLoading: false,
				spinner: false,
				isLoading: false
			}
		},

		mixins: [Mixins],

		components: {
			'multiselect': Multiselect
		},

		created () {
			var self = this;
			this.$store.state.projectTaskLists.lists.forEach(function(list) {
				if(list.id == self.items.list.id) {
					return;
				}
				self.items.lists.push({
					id: list.id,
					title: list.title
				});
			})
		},

		methods: {
			asyncFind(evt) {
                var self = this,
                timeout = 2000,
                timer;

                if(evt == '') {
                    return;
                }

                clearTimeout(timer);
                self.asyncListLoading = true;

                timer = setTimeout(function () {
                    if (self.abort) {
                        self.abort.abort();
                    }

                    var requestData = {
                        type: 'GET',
                        url: self.base_url + 'pm/v2/projects/' + self.project_id + '/lists/search',
                        data: {
                            title: evt
                        },

                        success: function success(res) {
                            self.asyncListLoading = false;
                            self.isLoading = false;
                            self.setSearchLists( res.data );
                        }
                    };

                    self.isLoading = true;
                    self.abort = self.httpRequest(requestData);
                }, timeout);
            },

            setSearchLists (lists) {
            	var self = this;

            	lists.forEach(function(list) {
            		if(list.id == self.items.list.id) {
            			return;
            		}

            		let index = self.getIndex(self.items.lists, list.id, 'id'); 

            		if(index !== false) {
            			return;
            		}

            		self.items.lists.push({
        				id: list.id,
        				title: list.title
        			});
            	});

            },

            move () {
            	var self = this;
            	this.spinner = true;
            	this.taskReceive(
	            	{
			            list_id: this.moveListId.id,
			            task_id: this.items.task.id,
			            orders: [
			            	{
			            		'index': 0,
			            		'id': this.items.task.id
			            	}
			            ],
			            receive: 1
			        },
			        function () {
			        	self.spinner = false;
			        }
		        );
            },

            closeModal () {
            	this.items.popupModal = false;
            }

		}
	}
</script>
