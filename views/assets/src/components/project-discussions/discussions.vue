<template>
    <div class="pm-wrap pm-front-end">
        <pm-header></pm-header>

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
        <div v-if="isFetchDiscussion">
            <div class="pm-blank-template discussion" v-if="blankTemplate">
                <div class="pm-content" >
                    <h3 class="pm-page-title">{{ __( 'Discussions', 'pm' ) }}</h3>

                    <p>
                        {{ __( 'Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.', 'pm' ) }} 
                    </p>
                        <div v-if="can_create_message">
                            <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> 
                                {{ __( 'Add New Discussion', 'pm' ) }} 
                            </a>
                        </div>
                        <transition name="slide" v-if="can_create_message">
                            <div class="pm-new-message-form" v-if="is_discuss_form_active">
                                <h3>{{ __( 'Create a new message', 'pm' ) }}</h3>
                                <new-discuss-form  :discuss="{}"></new-discuss-form>

                            </div>
                        </transition>
                    <div class="pm-list-content">
                        <h3 class="pm-why-for pm-page-title"> {{ __( 'When to use Discussions?', 'pm' ) }} </h3>

                        <ul class="pm-list">
                            <li> {{ __( 'To discuss a work matter privately.', 'pm' ) }} </li>
                            <li> {{ __( 'To exchange files privately.', 'pm' ) }}</li>
                            <li> {{ __( 'To discuss in a group.', 'pm' ) }}</li>
                            <li> {{ __( 'To create an open discussion visible to all.', 'pm' ) }} </li>

                        </ul>
                    </div>
                </div>
            </div>
            <div v-if="discussTemplate">
                <div class="pm-row discussion">
                    <div v-if="can_create_message">
                        <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> 
                            {{ __( 'Add New Discussion', 'pm' ) }} 
                        </a>
                    </div>
                    <transition name="slide" v-if="can_create_message">
                        <div class="pm-form pm-new-message-form pm-col-6 pm-sm-col-12" v-if="is_discuss_form_active">
                            <h3>{{ __( 'Create a new message', 'pm' )}}</h3>
                            <new-discuss-form  :discuss="{}"></new-discuss-form>

                        </div>
                    </transition>

                </div>
                <div class="pm-row pm-message-page">
                    <div class="pm-message-list pm-col-12 pm-sm-col-12">
                        <div class="pm-box-title">{{ __( 'Discussion List', 'pm' ) }}</div>
                        <ul class="dicussion-list">        
                            <li class="pm-col-12" v-for="discuss in discussion" :key="discuss.id">
                                <router-link 
                                        class="pm-col-9 pm-messge-link" 
                                        :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                    <div class="pm-message-inner">
                                        <router-link :to="{ name:'user-tasks', params: { user_id: discuss.creator.data.id } }" :title="discuss.creator.data.display_name" >
                                            <img :alt="discuss.creator.data.display_name" :src="discuss.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                        </router-link>
                                        <div>
                                           {{ discuss.title }}                    
                                        </div>
                                        
                                        <div class="dicussion-meta">
                                            {{ __( 'By', 'pm' ) }}
                                            <router-link :to="{ name:'user-tasks', params: { user_id: discuss.creator.data.id } }" :title="discuss.creator.data.display_name" >
                                                {{ discuss.creator.data.display_name }}
                                            </router-link> 
                                             {{ __( 'on', 'pm' ) }}
                                            {{ discuss.created_at.date }}                  
                                        </div>

                                    </div>
                                </router-link>

                                <div class="pm-col-1" v-if="can_create_message">
                                    <span class="pm-message-action pm-right">
                                        <a href="#" @click.prevent="showHideDiscussForm('toggle', discuss)" class="pm-msg-edit dashicons dashicons-edit"></a>
                                        <a href="" @click.prevent="deleteSelfDiscuss(discuss.id)" class="delete-message" :title="__('Delete this message', 'pm')">
                                            <span class="dashicons dashicons-trash"></span>
                                        </a>

                                        <span :class="privateClass( discuss )"></span>
                                    </span>
                                </div>

                                <div class="pm-col-2 pm-last-col pm-right comment-count">
                                    <router-link 
                                        class="pm-link" 
                                        :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                        {{ discuss.meta.total_comments }} {{ __( 'Comments', 'pm' ) }} 
                                    </router-link>           
                                </div>

                                <div class="clear"></div>
                                <transition name="slide" v-if="can_create_message">
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


<script>
    import header from './../common/header.vue';
    import new_discuss_form from './new-discuss-form.vue';
    import pagination from './../common/pagination.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                
            });
        },

        mixins: [PmMixin.projectDiscussions],

        data () {
            return {
                current_page_number: 1,
            }
        },
        watch: {
            '$route' (route) {
                this.discussQuery();
            }
        },
        created () {
            this.getGlobalMilestones();
            this.discussQuery();
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
                return this.$store.state.projectDiscussions.isFetchDiscussion;
            }
        },
        methods: {
            discussQuery () {
                var self = this;
                
                var conditions = {
                    with: 'comments',
                    per_page: 2,
                    page: this.setCurrentPageNumber()
                };

                var args = {
                    conditions: conditions,
                    callback: function(){
                        self.lazyAction();
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