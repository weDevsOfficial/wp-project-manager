<template>
	<div class="pm-project-menu">

        <div class="menu-item" v-if="menu.length" v-for="item in menu"> 

            <router-link 
                :class="item.class +' '+ setActiveMenu(item)"
                :to="item.route">
                <div class="menu-text-wrap">
	                <span :class="'logo '+setMenuIcon(item)"></span>
	                <span>{{ item.name }}</span>
            	</div>
                <!-- <div>{{ item.count }}</div> -->
            </router-link>
        </div>      
            <!-- <do-action :hook="'pm-header-menu'" :actionData="menu"></do-action> -->

    </div>

</template>


<style lang="less">
	.pm-project-menu {
		display: flex;
	    align-items: center;
	    background: #fff;
	    border-bottom: 1px solid #E5E4E4;
	    padding: 0 10px;

	    .menu-item {
	    	a {
	    		display: inline-block;
			    margin: 8px 0 0 0;
			    padding: 5px 13px 13px 13px;
			    font-size: 13px;
			    color: #000;
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
	    	.menu-text-wrap {
	    		display: flex;
	    		align-items: center;

	    		.logo {
	    			margin-right: 5px;
	    			&:before {
	    				font-size: 12px;
	    			}
	    		}
	    	}
	    }
	}
</style>

<script>
	export default {
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

				if(name == item.route.name) {
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
