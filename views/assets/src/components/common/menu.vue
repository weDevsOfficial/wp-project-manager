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
            <nav v-pm-header-menu-responsive v-if="menu.length" :class="(isNavCollapse) ? 'pm-project-menu menu-items-open' : 'pm-project-menu'">
                <div class="pm-nav-menu-toggle dashicons dashicons-arrow-down-alt2" @click="collapseNav()">
                    <span>Menu</span>
                </div>
                <div class="menu-item" v-for="item in menu" :key="item.name"> 

                    <router-link 
                        :class="item.class +' '+ setActiveMenu(item)"
                        :to="{
                            name: item.route.name,
                            project_id: project_id
                        }"
                    >
                        <span :class="'logo '+setMenuIcon(item)"></span>
                        <span class="title">{{ item.name }}</span>
                    </router-link>
                </div> 

                <div class="menu-item more-menu-wrap" v-if="moreMenu.length">
                    <a @click.prevent="" href="#" :class="`message pm-sm-col-12 ${isMoreMenuActive(moreMenu)}`">
                        <span class="logo donw-arrow-svg"><svg viewBox="0 0 150 109" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <g id="Page-1" stroke="none" stroke-width="1"  fill-rule="evenodd"> <g id="elevator"> <path d="M135.923,0 L14.618,0 C9.378,0 4.576,2.926 2.175,7.584 C-0.227,12.24 0.173,17.85 3.211,22.119 L58.595,99.941 C62.435,105.336 68.649,108.541 75.271,108.541 C81.893,108.541 88.107,105.336 91.947,99.941 L147.331,22.119 C150.369,17.849 150.769,12.24 148.367,7.584 C145.965,2.926 141.163,0 135.923,0 Z" id="Path"></path> </g> </g> </svg></span> 
                        
                        <span>{{ __('More', 'wedevs-project-manager') }}</span>
                    </a>

                    <ul class="child-menu-wrap">
                        <li class="child-item" v-for="child in moreMenu" :key="child.name">
                            <router-link 
                                :class="`${child.class} ${setActiveMenu(child)}`"
                                :to="{
                                    name: child.route.name,
                                    project_id: project_id
                                }"
                            >
                                <span :class="`logo ${setMenuIcon(child)}`"></span>
                                <span class="title">{{ child.name }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>    
                <!-- <pm-do-action :hook="'pm-header-menu'"></pm-do-action>  -->
            </nav>
        </div>
    </div>
</template>


<style lang="less">
	.pm-project-menu {
	    background: #fff;
	    border: 1px solid #E5E4E4;
	    padding: 0 9px;

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
                // display: flex;
                // align-items: center;
                border: none;

                .title {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
                    line-height: 21px;
                }

                .logo {
                    margin-right: 5px;
                    &:before {
                        font-size: 12px;
                    }
                }
	    	}
	    	
	    	.active {
	    		border: 1px solid #E5E4E4;
                background: #fbfbfb;
                border-bottom: 1px solid #fbfbfb;
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

        .more-menu-wrap {
            position: relative;
            -webkit-transition: all 0.5s ease-out;
            -moz-transition: all 0.5s ease-out;
            -ms-transition: all 0.5s ease-out;
            -o-transition: all 0.5s ease-out;
            transition: all 0.5s ease-out;

            .donw-arrow-svg {
                svg {
                   height: 8px;
                    width: 8px;
                    fill: #767676; 
                    transition: all 0.5s ease-out;
                }
            }

            &:hover {
                .child-menu-wrap {
                    display: block;
                }

                .donw-arrow-svg {
                    svg {
                        transform: rotate(180deg);  
                    }
                }
            }

            .child-menu-wrap {
                display: none;
                position: absolute;
                z-index: 999;
                border: 1px solid #DDDDDD;
                background: #fff;
                border-radius: 3px;
                box-shadow: 0px 2px 40px 0px rgba(214, 214, 214, 0.6);

                .child-item a {
                    margin: 0;
                    padding: 10px;
                    border: none;
                    display: block;

                    .title {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif
                    }
                }
                .child-item a.active {
                    background: #f4f4f4;
                }
            }
        }
    }
    
    .pm-nav-menu-toggle {
        display: none !important;
    }
    .pm-header-title-content .project-title .title {
        white-space: initial;
    }
    @media (max-width: 767px) {
        .pm-project-menu {
            padding: 0;
            display: flex;
            flex-wrap: wrap;
            .pm-nav-menu-toggle {
                display: block !important;
                width: 100%;
                padding: 10px 15px;
                min-height: 45px;
                text-align: left;
                cursor: pointer;
                span {
                    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
                }
                &:before {
                    float: right;
                }
            }
            .menu-item {
                display: none;
                flex-basis: 100%;
                a {
                    margin-top: 0;
                    padding: 10px 15px;
                    border-top: 1px solid #f2f2f2;
                    &.active {
                        border-radius: 0;
                        border-left: 0;
                        border-right: 0;
                        margin: 0;
                        &:parent {
                            opacity: .4;
                        }
                    }
                }
            }
            .pm-action-wrap {
                width: 100%;
                display: block;
            }
            &.menu-items-open {
                .menu-item {
                    display: initial;
                }
                .pm-nav-menu-toggle {
                    &:before {
                        transform: rotate(180deg);
                    }
                }
            }
        }
    }

    @media screen and (max-width: 480px) {
        /*.pm-header-menu-wrap {
            .slicknav_menu {
                display: block;
            }
            .pm-project-menu {
                display: none;
            }
        }*/
    }
</style>

<script>
    import { sortBy } from 'lodash';

	export default {
        props: {
            current: {
                type: String,
                default: '',
            }
        },
        data () {
            return {
                isNavCollapse: false,
                moreMenu: []
            }
        },
		computed: {
			menu () {
                var project = this.$store.state.project;
                
                if( typeof project.meta === 'undefined' ){
                    return [];
                }

                let items = pm_apply_filters(
                    'pm-project-menu',
                    [
                        {
                            route: {
                                name: 'task_lists',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Task Lists', 'wedevs-project-manager'),
                            count: project.meta.data.total_task_lists,
                            class: 'to-do-list pm-sm-col-12',
                            order: 1
                        },

                        {
                            route: {
                                name: 'pm_overview',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Overview', 'wedevs-project-manager'),
                            count: '',
                            class: 'overview pm-sm-col-12',
                            order: 2
                        },

                        {
                            route: {
                                name: 'activities',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Activities', 'wedevs-project-manager'),
                            count: project.meta.data.total_activities,
                            class: 'activity pm-sm-col-12',
                            order: 21
                        },

                        {
                            route: {
                                name: 'discussions',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Discussions', 'wedevs-project-manager'),
                            count: project.meta.data.total_discussion_boards,
                            class: 'message pm-sm-col-12',
                            order: 4
                        },

                        {
                            route: {
                                name: 'milestones',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Milestones', 'wedevs-project-manager'),
                            count: project.meta.data.total_milestones,
                            class: 'milestone pm-sm-col-12',
                            order: 5
                        },

                        {
                            route: {
                                name: 'pm_files',
                                project_id: this.project_id,
                            },

                            name: this.__( 'Files', 'wedevs-project-manager'),
                            count: project.meta.data.total_files,
                            class: 'files pm-sm-col-12',
                            order: 6
                        }
                    ]
                )

                items = sortBy( items, ['order'] );

                this.moreMenu = [...items.slice(7,items.length)];
                
                return items.slice(0,7);
            }
		},

		methods: {
            // collapse navigation
            collapseNav () {
                this.isNavCollapse = ! this.isNavCollapse;
            },

            isMoreMenuActive (menus) {

                var name = this.$route.name;
                var active = '';

                menus.forEach( menu => {
                    if( name == menu.route.name ) {
                        active = 'active';
                    }
                } )

                return active;
            },

			setActiveMenu (item) {
				var name = this.$route.name;
                
                if( 
                    ( item.route.name == 'task_lists' && ( name == 'single_list' || name == "task_lists_pagination" ) )
                    || 
                    ( item.route.name == 'discussions' && name == 'individual_discussions' )
                    || 
                    ( name == item.route.name ) 
                ) {
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
                        
                    case 'kanboard':
                        return 'icon-pm-discussion';
                        break;
                }
                
            },
		}
	}
</script>
