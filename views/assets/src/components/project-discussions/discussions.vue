<template>
    <div class="wrap pm pm-front-end">
        <pm-header></pm-header>

        <div v-if="loading" class="pm-data-load-before" >
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

        <div v-else>
            <div class="pm-blank-template discussion" v-if="blankTemplate">
                <div class="pm-content" >
                    <h3 class="pm-page-title">{{text.discussions}}</h3>

                    <p>
                        {{text.discuss_define}} 
                    </p>
                        <div v-if="can_create">
                            <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> 
                                {{text.add_new_discussion}} 
                            </a>
                        </div>
                        <transition name="slide" v-if="can_create">
                            <div class="pm-new-message-form" v-if="is_discuss_form_active">
                                <h3>{{text.create_a_new_message}}</h3>
                                <new-discuss-form  :discuss="{}"></new-discuss-form>

                            </div>
                        </transition>
                    <div class="pm-list-content">
                        <h3 class="pm-why-for pm-page-title"> {{text.when_use_discuss}} </h3>

                        <ul class="pm-list">
                            <li> {{text.to_discuss_work_matter}} </li>
                            <li> {{text.to_exchange_file}}</li>
                            <li> {{text.to_discuss_group}}</li>
                            <li> {{text.to_open_discuss}} </li>

                        </ul>
                    </div>
                </div>
            </div>
            <div v-if="discussTemplate">
                <div class="pm-row discussion">
                    <div v-if="can_create">
                        <a @click.prevent="showHideDiscussForm('toggle')" class="pm-btn pm-plus-white pm-new-message-btn pm-btn-uppercase" href="" id="pm-add-message"> 
                            {{text.add_new_discussion}} 
                        </a>
                    </div>
                    <transition name="slide" v-if="can_create">
                        <div class="pm-form pm-new-message-form pm-col-6 pm-sm-col-12" v-if="is_discuss_form_active">
                            <h3>{{text.create_a_new_message}}</h3>
                            <new-discuss-form  :discuss="{}"></new-discuss-form>

                        </div>
                    </transition>

                </div>
                <div class="pm-row pm-message-page">
                    <div class="pm-message-list pm-col-12 pm-sm-col-12">
                        <div class="pm-box-title">{{text.discussion_list}}</div>
                        <ul class="dicussion-list">        
                            <li class="pm-col-12" v-for="discuss in discussion" :key="discuss.id">
                                <div class="pm-col-9">
                                    
                                    <router-link 
                                        class="pm-pagination-btn prev page-numbers" 
                                        :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                        <img :alt="discuss.creator.data.display_name" :src="discuss.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                        <div>
                                           {{ discuss.title }}                    
                                        </div>
                                        
                                    </router-link>
                                   
                                    <div class="dicussion-meta">
                                        {{text.by}} 
                                        <a href="#" :title="discuss.creator.data.display_name">
                                            {{ discuss.creator.data.display_name }}
                                        </a> 
                                         {{text.on}}
                                        {{ discuss.created_at.date }}                  
                                    </div>

                                </div>

                                <div class="pm-col-1" v-if="can_create">
                                    <span class="pm-message-action pm-right">
                                        <a href="#" @click.prevent="showHideDiscussForm('toggle', discuss)" class="pm-msg-edit dashicons dashicons-edit"></a>
                                        <a href="" @click.prevent="deleteSelfDiscuss(discuss.id)" class="delete-message" title="Delete this message" data-msg_id="97" data-project_id="60" data-confirm="Are you sure to delete this message?">
                                            <span class="dashicons dashicons-trash"></span>
                                        </a>

                                        <span :class="privateClass( discuss )"></span>
                                    </span>
                                </div>

                                <div class="pm-col-2 pm-last-col pm-right comment-count">
                                    <router-link 
                                        class="pm-pagination-btn prev page-numbers" 
                                        :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                        {{ discuss.meta.total_comments }} {{text.comments}} 
                                    </router-link>           
                                </div>

                                <div class="clear"></div>
                                <div v-if="user_can('create_message')">

                                    <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                                </div>
                                
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
                loading: true,
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
            can_create () {
                if ( typeof this.$store.state.projectDiscussions.meta.permission === 'undefined' ){
                    return false;
                }
                return this.$store.state.projectDiscussions.meta.permission.can_create;
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
                        self.loading = false;
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