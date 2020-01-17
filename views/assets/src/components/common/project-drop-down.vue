<template>
	<multiselect
		class="pm-common-multiselect"
		v-model="project"
        :options="projects"
        :multiple="multiple"
        :show-labels="true"
        :placeholder="options.placeholder"
        select-label=""
        selected-label="selected"
        deselect-label=""
        label="title"
        track-by="id"
        :allow-empty="allowEmpty"
        :loading="loadingProjectSearch"
        @search-change="asyncProjectsFind"
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
                        placeholder: __( 'Select a project', 'wedevs-project-manager' )
                    }
                }
            },
            selectedProjects: {
                type: [Object, Array, String],
                default () {
                    return ''
                }
            }
		},
		data () {
			return {
				projects: [],
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
			this.setProjects();
            this.formatSelectedProjectsId();
            
		},

		methods: {
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

                projects.forEach(function(project) {
                    let index = self.getIndex( self.projects, project.id, 'id' );

                    if(index === false) {
                        self.projects.push({
                            id: project.id,
                            title: project.title,
                        });
                    }
                });

                self.$emit('afterGetProjects', projects);
            },

			onChange (val, el) {
				this.$emit( 'onChange', val );
			},

			setProjects () {
				var projects = [],
					self = this;

				if( !this.$store.state.projects.length) {
					var args = {
						data: {
							project_id: this.projectId,
						},

						callback (res) {
                            self.formatProjects(res.data);
						}
					}
					this.getProjects( args );
				} else {
                    self.formatProjects( this.$store.state.projects );
				} 
			},
			getProjects (args) {
	            var self = this;
	            var request = {
	                url: self.base_url + '/pm/v2/projects',
                    data: {
                        select: 'id, title',
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
                var self = this;

                if(self.projectAbort) {
                    self.projectAbort.abort();
                }

                var request = {
                    url: `${self.base_url}/pm/v2/projects/?title=${title}`,
                    data: {
                        select: 'id, title',
                        per_page: 100
                    },
                    success: function(res) {
                        
                        self.loadingProjectSearch = false;
                        self.formatProjects(res.data);
                    }
                }
                self.loadingProjectSearch = true;
                self.projectAbort = self.httpRequest(request);
            },

		}
	}
</script>
