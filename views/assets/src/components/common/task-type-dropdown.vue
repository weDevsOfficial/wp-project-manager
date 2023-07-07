<template>
	<multiselect
        v-if="taskTypes.length"
		class="pm-common-multiselect"
		v-model="taskType"
        :options="taskTypes"
        :multiple="multiple"
        :show-labels="true"
        :placeholder="placeholder"
        select-label=""
        selected-label="selected"
        deselect-label=""
        label="title"
        :track-by="trackBy"
        :allow-empty="allowEmpty"
        :loading="loadingTaskTypeSearch"
        @input="onChange"
        @remove="afterRemove">
     
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
            
            placeholder: {
            	type: [String],
            	default () {
            		return __( 'Choose task type', 'wedevs-project-manager' )
            	}
            },

    		searchTaskTypes: {
            	type: [Boolean],
            	default () {
            		return true
            	}
            },

            selectedTaskTypes: {
                type: [Object, Array, String],
                default () {
                    return ''
                }
            },

            options: {
                type: [Array],
                default () {
                    return []
                }
            },

            trackBy: {
                type: [String],
                default () {
                    return 'id'
                }
            },
		},
		data () {
			return {
				//taskTypes: [],
				timeout: '',
				loadingTaskTypeSearch: false,
                taskTypeAbort: '',
                taskType: ''
			}
		},
		components: {
			'multiselect': pm.Multiselect.Multiselect
		},

        watch: {
            selectedTaskTypes () {
                this.formatSelectedTaskTypesId();
            }
        },

		created() {
            this.hasPropsTaskTypes()
			this.setTaskTypes();
            this.formatSelectedTaskTypesId();
		},

        computed: {
            taskTypes () {
                return this.$store.state.dropDownTaskTypes;
            }
        },

		methods: {
            hasPropsTaskTypes () {
                 if ( this.options.length ) {
                    this.$store.commit( 'setDropDownTaskTypes', this.options );
                }
            },

            formatSelectedTaskTypesId () {
                var self = this;
                if( this.is_object(this.selectedTaskTypes) ) {
                    this.taskType = Object.assign({}, this.selectedTaskTypes)
                }
                
                if( this.is_array( this.selectedTaskTypes ) ) {
                    this.taskType = [];
                    this.selectedTaskTypes.forEach( (taskType) => {
                        taskType.id = parseInt( taskType.id );
                        self.taskType.push(taskType);
                    } )
                }
            },
            
            formatTaskTypes(taskTypes) {
                var self = this;

                // taskTypes.forEach(function(taskType) {
                //     let index = self.getIndex( self.taskTypes, taskType.id, 'id' );

                //     if(index === false) {
                //         self.taskTypes.push({
                //             id: taskType.id,
                //             title: taskType.title,
                //             assignees: taskType.assignees
                //         });
                //     }
                // });

                self.afterGetTaskTypes( taskTypes );
            },

            afterGetTaskTypes( taskTypes ) {
                this.$emit('afterGetTaskTypes', taskTypes);
            },

			onChange (val, el) {
				this.$emit( 'onChange', val );
			},

			setTaskTypes () {

                if ( this.$store.state.dropDownTaskTypes.length) {
                    this.afterGetTaskTypes( this.$store.state.dropDownTaskTypes );
                    return;
                }

				var taskTypes = [],
					self = this;

				var args = {
					data: {
						taskType_id: this.taskTypeId,
					},

					callback (res) {
                        self.formatTaskTypes(res.data);
                        self.$store.commit( 'setDropDownTaskTypes', res.data );
					}
				}
				this.getTaskTypes( args );
				
    //             else {
    //                 self.formatTaskTypes( this.$store.state.taskTypes );
				// } 
			},
			getTaskTypes (args) {
	            var self = this;
	            var request = {
	                url: self.base_url + 'pm/v2/settings/task-types',
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
	        asyncTaskTypesFind (title) {
                if(title == '') return;
                var self = this;
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in 800ms
                this.timeout = setTimeout(function () {
                    self.findTaskTypes(title);
                }, 500);
            },

            findTaskTypes (title) {
                if(!this.searchTaskTypes) {
                    return;
                }
                var self = this;

                if(self.taskTypeAbort) {
                    self.taskTypeAbort.abort();
                }

                var request = {
                    url: `${self.base_url}pm/v2/taskTypes/?title=${title}`,
                    data: {
                        select: 'id, title',
                        with: 'assignees',
                        per_page: 100
                    },
                    success: function(res) {
                        
                        self.loadingTaskTypeSearch = false;
                        self.formatTaskTypes(res.data);
                        self.$store.commit('setDropDownTaskType', res.data);
                    }
                }
                self.loadingTaskTypeSearch = true;
                self.taskTypeAbort = self.httpRequest(request);
            },

            afterRemove (taskType) {
                
                this.$emit( 'afterRemove', taskType );
            }

		}
	}
</script>
