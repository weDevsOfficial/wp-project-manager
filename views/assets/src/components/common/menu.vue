<template>
    <div>
      <!--   <div class="pm-header-menu-wrap">
        	<nav v-if="menu.length" class="pm-project-menu">

                <div class="menu-item" v-for="item in menu" :key="item.name"> 

                    <router-link 
                        :class="item.class +' '+ setActiveMenu(item)"
                        :to="item.route">
                        
        	                <span :class="'logo '+setMenuIcon(item)"></span>
        	                <span>{{ item.name }}</span>
                    </router-link>
                </div>      
                <pm-do-action :hook="'pm-header-menu'"></pm-do-action> 
            </nav>
        </div> -->

        <div class="pm-header-menu-wrap">
            <nav v-pm-header-menu-responsive v-if="menu.length" class="pm-project-menu">

                <div class="menu-item" v-for="item in menu" :key="item.name"> 

                    <router-link 
                        :class="item.class +' '+ setActiveMenu(item)"
                        :to="item.route">
                        <!-- <div class="menu-text-wrap"> -->
                            <span :class="'logo '+setMenuIcon(item)"></span>
                            <span>{{ item.name }}</span>
                        <!-- </div> -->
                        <!-- <div>{{ item.count }}</div> -->
                    </router-link>
                </div>      
                <pm-do-action :hook="'pm-header-menu'"></pm-do-action> 
            </nav>
        </div>
    </div>
</template>


<style lang="less">
	.pm-project-menu {
	    background: #fff;
	    border: 1px solid #E5E4E4;
	    padding: 0 5px;

        &:after {
            display: table;
            clear: both;
            content: "";
            display: block;
        }

	    .menu-item {
            display: inline-block;
	    	a {
	    		display: inline-block;
			    margin: 9px 0 0 0;
			    padding: 5px 14px 14px 14px;
			    font-size: 13px;
			    color: #000;
                white-space: nowrap;
                display: flex;
                align-items: center;
                border: none;

                .logo {
                    margin-right: 5px;
                    &:before {
                        font-size: 12px;
                    }
                }
	    	}
	    	
	    	.active {
	    		border: 1px solid #E5E4E4;
			    background: #fafafa;
			    border-bottom: 1px solid #fafafa;
			    border-radius: 3px;
			    margin-bottom: -1px;
			    border-bottom-left-radius: 0;
			    border-bottom-right-radius: 0;
	    	}
	    }
	}

    .pm-header-menu-wrap {
        margin-top: 20px;
        .slicknav_menu {
            display: none;
        }
    }

    @media screen and (max-width: 480px) {
        .pm-header-menu-wrap {
            .slicknav_menu {
                display: block;
            }
            .pm-project-menu {
                display: none;
            }
        }
    }
</style>

<script>
	export default {
        props: {
            current: {
                type: String,
                default: '',
            }
        },
		computed: {
			menu () {
                var project = this.$root.$store.state.project;
                
                if( typeof project.meta === 'undefined' ){
                    return [];
                }

                return [
                    {
                        route: {
                            name: 'pm_overview',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Overview', 'wedevs-project-manager'),
                        count: '',
                        class: 'overview pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'activities',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Activities', 'wedevs-project-manager'),
                        count: project.meta.data.total_activities,
                        class: 'activity pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'discussions',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Discussions', 'wedevs-project-manager'),
                        count: project.meta.data.total_discussion_boards,
                        class: 'message pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'task_lists',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Task Lists', 'wedevs-project-manager'),
                        count: project.meta.data.total_task_lists,
                        class: 'to-do-list pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'milestones',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Milestones', 'wedevs-project-manager'),
                        count: project.meta.data.total_milestones,
                        class: 'milestone pm-sm-col-12'
                    },

                    {
                        route: {
                            name: 'pm_files',
                            project_id: this.project_id,
                        },

                        name: this.__( 'Files', 'wedevs-project-manager'),
                        count: project.meta.data.total_files,
                        class: 'files pm-sm-col-12'
                    }
                ];
            }
		},

		methods: {
			setActiveMenu (item) {
				var name = this.$route.name;

                if(item.route.name == 'task_lists' && name == 'single_list' ) {
                    return 'active';
                }

                if(item.route.name == 'discussions' && name == 'individual_discussions' ) {
                    return 'active';
                }
                
				if(name == item.route.name || this.current == item.route.name) {
					return 'active';
				} 
			},
			setMenuIcon (item) {
                switch(item.route.name) {
                    case 'pm_overview':
                        return 'icon-pm-overview';
                        break;

                    case 'activities':
                        return 'icon-pm-activity';
                        break;

                    case 'discussions':
                        return 'icon-pm-discussion';
                        break;

                    case 'task_lists':
                        return 'icon-pm-task-list';
                        break;

                    case 'milestones':
                        return 'icon-pm-mileston';
                        break;

                    case 'pm_files':
                        return 'icon-pm-file';
                        break;
                }
                
            },
		}
	}
</script>
