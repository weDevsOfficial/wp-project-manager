<template>
    <div class="wrap cpm cpm-front-end">
        <pm-header></pm-header>

        <div v-if="loading" class="cpm-data-load-before" >
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

        <div class="cpm-blank-template discussion" v-if="blank_template">
            <div class="cpm-content" >
                <h3 class="cpm-page-title">Discussion</h3>

                <p>
                    Use our built in discussion panel to create an open discussion, a group discussion or a private conversation. Note that the Admin can always moderate these discussions.
                </p>
                    <div>
                        <a @click.prevent="showHideDiscussForm('toggle')" class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message"> 
                            Add New Discussion 
                        </a>
                    </div>
                    <transition name="slide">
                        <div class="cpm-new-message-form" v-if="is_discuss_form_active">
                            <h3>Create a new message</h3>

                            <new-discuss-form  :discuss="{}"></new-discuss-form>

                        </div>
                    </transition>

                <div class="cpm-list-content">
                    <h3 class="cpm-why-for cpm-page-title"> When to use Discussions? </h3>

                    <ul class="cpm-list">
                        <li> To discuss a work matter privately. </li>
                        <li> To exchange files privately. </li>
                        <li> To discuss in a group.</li>
                        <li> To create an open discussion visible to all. </li>

                    </ul>
                </div>
            </div>
        </div>
        <div v-if="discuss_template">
            <div class="cpm-row discussion" v-if="discussion.length" >
                <div>
                    <a @click.prevent="showHideDiscussForm('toggle')" class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message"> 
                        Add New Discussion 
                    </a>
                </div>
                <transition name="slide">
                    <div class="cpm-form cpm-new-message-form cpm-col-6 cpm-sm-col-12" v-if="is_discuss_form_active">
                        <h3>Create a new message</h3>

                        <new-discuss-form  :discuss="{}"></new-discuss-form>

                    </div>
                </transition>

            </div>

            <div class="cpm-row cpm-message-page" v-if="discussion.length">
                <div class="cpm-message-list cpm-col-12 cpm-sm-col-12">
                    <div class="cpm-box-title">Discussion List</div>
                    <ul class="dicussion-list">        
                        <li class="cpm-col-12" v-for="discuss in discussion" key="discuss.id">
                            <div class="cpm-col-9">
                                
                                <router-link 
                                    class="cpm-pagination-btn prev page-numbers" 
                                    :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                    <img :alt="discuss.creator.data.display_name" :src="discuss.creator.data.avatar_url" class="avatar avatar-48 photo" height="48" width="48">
                                    <div>
                                       {{ discuss.title }}                    
                                    </div>
                                    
                                </router-link>
                               
                                <div class="dicussion-meta">
                                    By 
                                    <a href="#" :title="discuss.creator.data.display_name">
                                        {{ discuss.creator.data.display_name }}
                                    </a> 
                                    on 
                                    {{ discuss.created_at.date }}                  
                                </div>

                            </div>

                            <div class="cpm-col-1">
                                <span class="cpm-message-action cpm-right">
                                    <a href="#" @click.prevent="showHideDiscussForm('toggle', discuss)" class="cpm-msg-edit dashicons dashicons-edit"></a>
                                    <a href="" @click.prevent="deleteDiscuss(discuss.id)" class="delete-message" title="Delete this message" data-msg_id="97" data-project_id="60" data-confirm="Are you sure to delete this message?">
                                        <span class="dashicons dashicons-trash"></span>
                                    </a>

                                    <span class="cpm-unlock"></span>
                                </span>
                            </div>

                            <div class="cpm-col-2 cpm-last-col cpm-right comment-count">
                                <router-link 
                                    class="cpm-pagination-btn prev page-numbers" 
                                    :to="{ name: 'individual_discussions',  params: { discussion_id: discuss.id }}">
                                    {{ discuss.meta.total_comments }} Comments 
                                </router-link>           
                            </div>

                            <div class="clear"></div>
                            <new-discuss-form v-if="discuss.edit_mode" :discuss="discuss"></new-discuss-form>
                        </li>
                 
                    </ul>    
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <pm-pagination 
            :total_pages="total_discussion_page" 
            :current_page_number="current_page_number" 
            component_name='discussion_pagination'>
            
        </pm-pagination> 

    </div>

</template>


<script>
    import header from './../header.vue';
    import new_discuss_form from './new-discuss-form.vue';
    import pagination from './../pagination.vue';

    export default {
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.discussQuery();
                vm.getMilestones();
            });
        },
        data () {
            return {
                 current_page_number: 1,
                 loading: true,
                 blank_template: false,
                 discuss_template: false,
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
            is_discuss_form_active () {
                return this.$store.state.is_discuss_form_active;
            },

            discussion () {
                return this.$store.state.discussion;
            },

            total_discussion_page () {
                return this.$store.state.meta.total_pages;
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
                        self.afterGetDiscussionAction();
                    }  
                }

                this.getDiscussion(args);
            }
        }
    }

</script>