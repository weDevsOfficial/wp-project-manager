<template>
    <div class="pm-wrap pm-front-end">
        <pm-header></pm-header>
        <pm-heder-menu></pm-heder-menu>

        <div v-if="!isFetchDiscussion" class="pm-data-load-before" >
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
        <!-- {{ pm.i18n.__('Add List', 'cpm') }} -->
        <div class="pm-discussion" v-if="isFetchDiscussion">
            <div class="pm-blank-template discussion" v-if="blankTemplate">
                <div class="pm-content" >
                    <h3 class="pm-page-title">{{ __( 'Discussions', 'wedevs-project-manager') }}</h3>

                    <p>
                        {{ __( 'Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.', 'wedevs-project-manager') }} 
                    </p>
                        <div v-if="can_create_message()">
                            <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> <i aria-hidden="true" class="fa fa-plus-circle"></i>
                                {{ __( 'Add New Discussion', 'wedevs-project-manager') }} 
                            </a>
                        </div>
                        <transition name="slide" v-if="can_create_message()">
                            <div class="pm-new-message-form" v-if="is_discuss_form_active">
                                <h3>{{ __( 'Create a new message', 'wedevs-project-manager') }}</h3>
                                <new-discuss-form  :discuss="{}"></new-discuss-form>

                            </div>
                        </transition>
                    <div class="pm-list-content">
                        <h3 class="pm-why-for pm-page-title"> {{ __( 'When to use Discussions?', 'wedevs-project-manager') }} </h3>

                        <ul class="pm-list">
                            <li> {{ __( 'To discuss a work matter privately.', 'wedevs-project-manager') }} </li>
                            <li> {{ __( 'To exchange files privately.', 'wedevs-project-manager') }}</li>
                            <li> {{ __( 'To discuss in a group.', 'wedevs-project-manager') }}</li>
                            <li> {{ __( 'To create an open discussion visible to all.', 'wedevs-project-manager') }} </li>

                        </ul>
                    </div>
                </div>
            </div>
            <div v-if="discussTemplate">
                <div class="pm-row discussion">
                    <div v-if="can_create_message()">
                        <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> <i aria-hidden="true" class="fa fa-plus-circle"></i>
                            {{ __( 'Add New Discussion', 'wedevs-project-manager') }} 
                        </a>
                    </div>
                    <transition name="slide" v-if="can_create_message()">
                        <div class="pm-form pm-new-message-form pm-col-6 pm-sm-col-12" v-if="is_discuss_form_active">
                            <h3>{{ __( 'Create a new message', 'wedevs-project-manager')}}</h3>
                            <new-discuss-form  :discuss="{}"></new-discuss-form>

                        </div>
                    </transition>

                </div>
                <div class="pm-row pm-message-page">
                    <div class="pm-message-list pm-col-12 pm-sm-col-12">
                        <div class="pm-box-title">{{ __( 'Discussion List', 'wedevs-project-manager') }}</div>
                        <ul class="dicussion-list">        
                            <li class="pm-col-12" v-for="discuss in discussion" :key="discuss.id">
                                <router-link 
                                    class="pm-col-9 pm-messge-link" 
                                    :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                    
                                    <div class="pm-message-inner">
                                        <a :href="myTaskRedirect(discuss.creator.data.id)" :title="discuss.creator.data.display_name" >
                                            <img :alt="discuss.creator.data.display_name" :src="discuss.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                        </a>
                                        <div>
                                           {{ discuss.title }}                    
                                        </div>
                                        
                                        <div class="dicussion-meta">
                                            {{ __( 'By', 'wedevs-project-manager') }}
                                            <a :href="myTaskRedirect(discuss.creator.data.id)" :title="discuss.creator.data.display_name" >
                                                {{ discuss.creator.data.display_name }}
                                            </a> 
                                             {{ __( 'on', 'wedevs-project-manager') }}
                                            {{ taskDateFormat(discuss.created_at.date) }}, {{ dateTimeFormat(discuss.created_at.timestamp) }}                  
                                        </div>

                                    </div>
                                </router-link>

                                <div class="pm-col-1" v-if="can_edit_message(discuss)">
                                    <span class="pm-message-action pm-right">
                                        <a :title="edit" @click.prevent="showHideDiscussForm('toggle', discuss)" class="pm-msg-edit dashicons dashicons-edit"></a>
                                        <a href="" @click.prevent="deleteSelfDiscuss(discuss.id)" class="delete-message" :title="delete_this_message">
                                            <span class="dashicons dashicons-trash"></span>
                                        </a>

                                        <span :title="make_it_private" v-if="PM_Vars.is_pro && user_can('view_private_message')" @click.prevent="lockUnlock(discuss)" :class="privateClass( discuss )"></span>
                                    </span>
                                </div>

                                <div class="pm-col-2 pm-last-col pm-right comment-count">
                                    <router-link 
                                        class="pm-link" 
                                        :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                        {{ discuss.meta.total_comments }} {{ __( 'Comments', 'wedevs-project-manager') }} 
                                    </router-link>           
                                </div>

                                <div class="clear"></div>
                                <transition name="slide" v-if="can_create_message()">
                                    <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                                </transition>
                                
                            </li>
                     
                        </ul>    
                    </div>
                    <div class="clear"></div>
                </div>
            
                <pm-pagination 
                    :total_pages="total_discussion_page" 
                    :current_page_number="current_page_number" 
                    component_name='discussion_pagination'>
                    
                </pm-pagination> 
            </div>
        </div>
        
    </div>

</template>

<style lang="less">
    .pm-discussion {
        margin-top: 10px;
    }
</style>


<script>
    import header from './../common/header.vue';
    import new_discuss_form from './new-discuss-form.vue';
    import pagination from './../common/pagination.vue';
    import Mixins from './mixin';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.getGlobalMilestones();
                vm.discussQuery();
            });
        },

        mixins: [Mixins],

        data () {
            return {
                edit: __('Edit', 'wedevs-project-manager'),
                delete_this_message: __('Delete this message', 'wedevs-project-manager'),
                make_it_private: __('Make it private', 'wedevs-project-manager'),
                current_page_number: 1,
            }
        },
        watch: {
            '$route' (route) {
                this.discussQuery();
            }
        },
        components: {
            'pm-header': header,
            'new-discuss-form': new_discuss_form,
            'pm-pagination': pagination
        },
        computed: {
            discussTemplate () {
                return this.$store.state.projectDiscussions.discuss_template;
            },
            blankTemplate () {
                return this.$store.state.projectDiscussions.blank_template;
            },
            is_discuss_form_active () {
                return this.$store.state.projectDiscussions.is_discuss_form_active;
            },

            discussion () {
                return this.$store.state.projectDiscussions.discussion;
            },

            total_discussion_page () {
                return this.$store.state.projectDiscussions.meta.pagination.total_pages;
            },

            isFetchDiscussion () {
                return this.$root.$store.state.projectDiscussLoaded;
            }
        },
        methods: {
            discussQuery () {
                var self = this;
                
                var conditions = {
                    with: 'comments',
                    per_page: 20,
                    page: this.setCurrentPageNumber()
                };

                var args = {
                    conditions: conditions,
                    callback: function(){
                        self.lazyAction();
                        self.$root.$store.state.projectDiscussLoaded = true;
                        pm.NProgress.done();
                    }  
                }

                this.getDiscussion(args);
            },

            deleteSelfDiscuss ( id ) {
                var self = this;
                var args = {
                    discuss_id: id,
                    callback: function() {
                        self.lazyAction();
                    }
                }

                self.deleteDiscuss(args);
            }
        }
    }

</script>
