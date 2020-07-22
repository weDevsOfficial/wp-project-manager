<template>
	<multiselect
		class="pm-common-multiselect"
		v-model="project"
        :options="filterProjectsByStatus(projects)"
        :multiple="multiple"
        :show-labels="true"
        :placeholder="options.placeholder"
        select-label=""
        selected-label="selected"
        deselect-label=""
        label="title"
        :track-by="trackBy"
        :allow-empty="allowEmpty"
        :loading="loadingProjectSearch"
        @search-change="asyncProjectsFind"
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

            options: {
                type: [Object],
                default () {
                    return {
                        placeholder: __( 'Select a project', 'wedevs-project-manager' ),
                        searchProjects: true
                    }
                }
            },

            selectedProjects: {
                type: [Object, Array, String],
                default () {
                    return ''
                }
            },

            optionProjects: {
                type: [Array],
                default () {
                    return []
                }
            },

            status: {
                type: [String],
                default () {
                    return 'incomplete'
                }
            },

            defaultProjects: {
                type: [Boolean],
                default () {
                    return true
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
				//projects: [],
				timeout: '',
				loadingProjectSearch: false,
                projectAbort: '',
                project: ''
			}
		},

		components: {
			'multiselect': pm.Multiselect.Multiselect
		},

        watch: {
            selectedProjects () {
                this.formatSelectedProjectsId();
            }
        },

		created() {
            this.hasPropsProjects()
			this.setProjects();
            this.formatSelectedProjectsId();
		},

        computed: {
            projects () {
                return this.$store.state.dropDownProjects;
            }
        },

		methods: {
            filterProjectsByStatus (projects) {
                var returnData = [];
                var status = {
                    'incomplete': 0,
                    'complete': 1,
                    'pending': 2,
                    'archived': 3
                }

                if(this.status) {
                    var numeric =  status[this.status];

                    projects.forEach( project => {

                        //if db project status get as string 
                        if ( project.status == this.status ) {
                            returnData.push(project);
                        }

                        //if db project status get as number 
                        if ( project.status == numeric ) {
                            returnData.push(project);
                        }

                    } )
                } else {
                    return projects;
                }
                
                return returnData;
            },

            hasPropsProjects () {
                 if ( this.optionProjects.length ) {
                    this.$store.commit( 'setDropDownProjects', this.optionProjects );
                }
            },

            formatSelectedProjectsId () {
                var self = this;
                
                if( this.is_object(this.selectedProjects) ) {
                    this.project = Object.assign({}, this.selectedProjects)
                }
                
                if( this.is_array( this.selectedProjects ) ) {
                    this.project = [];
                    this.selectedProjects.forEach( (project) => {
                        project.id = parseInt( project.id );
                        self.project.push(project);
                    } )
                }
            },

            formatProjects(projects) {
                var self = this;
                self.afterGetProjects( projects );
            },

            afterGetProjects( projects ) {
                this.$emit('afterGetProjects', projects);
            },

			onChange (val, el) {
				this.$emit( 'onChange', val );
			},

			setProjects () {

                if(!this.defaultProjects) {
                    
                    if ( this.optionProjects.length) {
                        this.afterGetProjects( this.optionProjects );
                    }

                    return;
                }

                if ( this.$store.state.dropDownProjects.length) {
                    this.afterGetProjects( this.$store.state.dropDownProjects );
                    return;
                }

				var projects = [],
					self = this;

				var args = {
					data: {
						project_id: this.projectId,
					},

					callback (res) {
                        self.formatProjects(res.data);
                        self.$store.commit( 'setDropDownProjects', res.data );
					}
				}
				this.getProjects( args );
			},

			getProjects (args) {
	            var self = this;

	            var request = {
	                url: self.base_url + 'pm/v2/projects',
                    data: {
                        select: 'id, title, status',
                        with: 'assignees',
                        status: this.status,
                        per_page: 100
                    },
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

	        asyncProjectsFind (title) {
                if(title == '') return;
                var self = this;
                clearTimeout(this.timeout);

                // Make a new timeout set to go off in 800ms
                this.timeout = setTimeout(function () {
                    self.findProjects(title);
                }, 500);
            },

            findProjects (title) {
                if(!this.options.searchProjects) {
                    return;
                }
                var self = this;

                if(self.projectAbort) {
                    self.projectAbort.abort();
                }

                var request = {
                    url: `${self.base_url}pm/v2/projects/?title=${title}`,
                    data: {
                        select: 'id, title',
                        with: 'assignees',
                        status: self.status,
                        per_page: 100
                    },
                    success: function(res) {
                        
                        self.loadingProjectSearch = false;
                        self.formatProjects(res.data);
                        self.$store.commit('setDropDownProject', res.data);
                    }
                }
                self.loadingProjectSearch = true;
                self.projectAbort = self.httpRequest(request);
            },

            afterRemove (project) {
                
                this.$emit( 'afterRemove', project );
            }

		}
	}
</script>
