<template>
	<multiselect
		class="pm-common-multiselect"
		v-model="list"
        :options="lists"
        :multiple="multiple"
        :show-labels="true"
        :placeholder="options.placeholder"
        select-label=""
        selected-label="selected"
        deselect-label=""
        label="title"
        track-by="id"
        :allow-empty="allowEmpty"
        :loading="loadingListSearch"
        @search-change="asyncListsFind"
        @input="onChange">
     
    </multiselect>

</template>

<style lang="less">
	.pm-common-multiselect {
	    min-height: auto;
        margin-right: 8px;

        .multiselect__single {
            margin-bottom: 0;
        }
        .multiselect__select {
            display: none;
        }
        .multiselect__input {
            border: none !important;
            box-shadow: none !important;
            margin: 0;
            font-size: 14px;
            vertical-align: baseline;
            height: 0;
        }
        .multiselect__element {
            .multiselect__option {
                font-weight: normal;
                white-space: normal;
                padding: 6px 12px;
                line-height: 25px;
                font-size: 14px;
                display: flex;

                .option-image-wrap {
                    .option__image {
                        border-radius: 100%;
                        height: 16px;
                        width: 16px;
                    }
                }
                .option__desc {
                    line-height: 20px;
                    font-size: 13px;
                    margin-left: 5px;
                }
            }

        }
        .multiselect__tags {
            min-height: auto;
            padding: 4px;
            border-color: #ddd;
            border-radius: 3px;
            white-space: normal;
            .multiselect__single {
                font-size: 12px;
            }
            .multiselect__tags-wrap {
                font-size: 12px;
            }

            .multiselect__spinner {
                position: absolute;
                right: 24px;
                top: 14px;
                width: auto;
                height: auto;
                z-index: 99;
            }

            .multiselect__tag {
                margin-bottom: 0;
                overflow: visible;
                border-radius: 3px;
                margin-top: 2px;
            }
        }
    }
</style>

<script>
	export default {
		props: {
			allowEmpty: {
				type: [Boolean],
				default () {
					return false
				}
			},
			multiple: {
				type: [Boolean],
				default () {
					return false
				}
			},
            options: {
                type: [Object],
                default () {
                    return {
                        placeholder: ''
                    }
                }
            }
		},
		data () {
			return {
				lists: [],
				timeout: '',
				loadingListSearch: false,
                listAbort: '',
                list: ''
			}
		},
		components: {
			'multiselect': pm.Multiselect.Multiselect
		},
		computed: {
			
		},

		created() {
			this.setLists();
		},
		methods: {
            formatLists(lists) {
                var self = this;

                lists.forEach(function(list) {
                    let index = self.getIndex( self.lists, list.id, 'id' );

                    if(index === false) {
                        self.lists.push({
                            id: list.id,
                            title: list.title,
                        });
                    }
                });
            },
			onChange (val, el) {
				this.$emit('onChange', val);
			},

			setLists () {
				var lists = [],
					self = this;

				if( !this.$store.state.projectTaskLists.lists.length) {
					var args = {
						data: {
							project_id: this.project_id,
						},

						callback (res) {
                            self.formatLists(res.data);
						}
					}
					this.getLists(args);
				} else {
                    self.formatLists( this.$store.state.projectTaskLists.lists );
				} 
			},
			getLists (args) {
	            var self = this;

	            var request = {
	                url: self.base_url + '/pm/v2/projects/'+args.data.project_id+'/task-lists?with=incomplete_tasks,complete_tasks&incomplete_task_per_page=-1&complete_task_per_page=-1',
	                success (res) {

	                    if ( typeof args.callback != 'undefined' ) {
	                        args.callback (res);
	                    }
	                },
	                error (res) {

	                }
	            }

	            self.httpRequest(request);
	        },
	        asyncListsFind (title) {
                if(title == '') return;
                var self = this;
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in 800ms
                this.timeout = setTimeout(function () {
                    self.findLists(title);
                }, 500);
            },

            findLists (title) {
                var self = this;

                if(self.listAbort) {
                    self.listAbort.abort();
                }

                var request = {
                    url: self.base_url + '/pm/v2/projects/'+this.project_id+'/lists/search?title='+title+'&with=incomplete_tasks,complete_tasks&incomplete_task_per_page=-1&complete_task_per_page=-1',
                    success: function(res) {
                        
                        self.loadingListSearch = false;
                        self.formatLists(res.data);
                    }
                }
                self.loadingListSearch = true;
                self.listAbort = self.httpRequest(request);
            },

		}
	}
</script>
