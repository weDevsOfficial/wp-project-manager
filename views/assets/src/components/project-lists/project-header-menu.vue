<template>
    <!-- panel header left column -->
    <div :class="headerMenuToggler">
        <div class="pm-tabs-collapse pm-visible-sm">
            <button type="button" class="pm-btn pm-btn-default" @click.prevent="headerMenuToggle()">
                <i :class="headerMenuTriggerClass"></i>
            </button>
        </div>
        <ul v-if="isFetchProjects" class="pm-tabs pm-list-inline">
            <li class="pm-tab-item pm-item-active">
                <router-link :to="{name: 'project_lists'}">
                    <i class="pm-icon flaticon-pm-overview"></i>
                    <span>{{ __( 'Active', 'wedevs-project-manager') }}</span>
                </router-link>
            </li>
            <li class="pm-tab-item pm-item-completed">
                <router-link :to="{name: 'completed_projects'}" class="pm-archive-project">
                    <i class="pm-icon flaticon-check-mark"></i>
                    <span>{{ __( 'Completed', 'wedevs-project-manager') }} </span> 
                </router-link>
            </li>
            <li class="pm-tab-item pm-item-favourite">
                <router-link :to="{name: 'favourite_projects'}">
                    <i class="pm-icon flaticon-bookmark-star"></i>
                    <span>{{ __( 'Favourite', 'wedevs-project-manager') }}</span>
                </router-link>
            </li>
            <li class="pm-tab-item pm-item-all">
                <router-link :to="{name: 'all_projects'}">
                    <i class="pm-icon flaticon-menu-1"></i>
                    <span>{{ __( 'All', 'wedevs-project-manager') }}</span>
                </router-link>
            </li>
            <!-- <li class="pm-tab-item pm-item-archive">
                <a href="#">
                    <i class="pm-icon flaticon-pm-archive"></i>
                    <span>Archive</span>
                </a>
            </li> -->
        </ul>
    </div>
</template>

<script>
    import Mixins from './mixin';

    export default {
        data () {
            return {
                headerMenuCollapsed: false,
            }
        },
        mixins: [Mixins],
        computed: {
            headerMenuToggler () {
                if(this.headerMenuCollapsed) {
                    return 'pm-col-6-sm pm-tabs-container pm-tabs-opened';
                }else {
                    return 'pm-col-6-sm pm-tabs-container';
                }
            },
            headerMenuTriggerClass(){
                 if(this.headerMenuCollapsed) {
                    return 'pm-icon flaticon-cross';
                }else {
                    return 'pm-icon flaticon-menu';
                }
            },
            activated () {
                return this.$store.state.projects_meta.total_incomplete;
            },
            completed () {
                return this.$store.state.projects_meta.total_complete;
            },
            allof () {
                var incomplete = this.$store.state.projects_meta.total_incomplete; 
                var complete   = this.$store.state.projects_meta.total_complete;

                return incomplete + complete;
            },
            favourite () {
                return this.$store.state.projects_meta.total_favourite;
            }
        },
        methods: {
            headerMenuToggle(){
                return this.headerMenuCollapsed = !this.headerMenuCollapsed;
            }
        }
    }
</script>

<style lang="less" scoped>
    .favourite-menu a{
        padding-left: 15px !important;
    }
</style>