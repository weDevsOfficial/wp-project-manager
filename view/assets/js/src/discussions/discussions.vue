<template>
	<div class="wrap cpm cpm-front-end">
        <pm-header></pm-header>

        <div>
            <a @click.prevent="showHideDiscussForm('toggle')" class="cpm-btn cpm-plus-white cpm-new-message-btn cpm-btn-uppercase" href="" id="cpm-add-message"> 
                Add New Discussion 
            </a>
        </div>
        <div class="cpm-new-message-form" v-if="is_discuss_form_active">
            <h3>Create a new message</h3>

            <new-discuss-form :discuss="{}"></new-discuss-form>

        </div>

        
        <div class="cpm-row cpm-message-page">
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
                vm.getDiscussion(vm);
                vm.getMilestones(vm);
            });
        },
        data () {
            return {
                 current_page_number: 1
            }
        },
        watch: {
            '$route' (route) {
                this.getDiscussion(this);
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

    }

</script>
