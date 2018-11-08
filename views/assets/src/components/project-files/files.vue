<template>
    <div class="pm-wrap  pm-front-end">
        <pm-header></pm-header>
        <pm-heder-menu></pm-heder-menu>
        
        <div class="pm-files" v-if="!is_pro">
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


            <div v-if="!loading">
                <ul class="pm-folders-list" v-if="files.length">
                    <li class="file" v-for="file in files" :key="file.id">

                        <div class="ff-content">
                            <div>
                                <div class="image-content">
                                    
                                    <pm-file :file="file" />
                                    <div class="item-title" v-if="file.name">{{ file.name.slice(0, 20) }}</div>
                                    <span class="text">
                                        {{ __('Attached to', 'wedevs-project-manager') }} 
                                        <a :href="contentURL(file)">{{ attachTo(file) }}</a>  
                                        {{ __('by', 'wedevs-project-manager') }} 
                                        <a href="#/my-tasks" title="admin">
                                            {{ __('admin', 'wedevs-project-manager') }}
                                        </a>
                                    </span>
                                </div>

                                <div class="footer-section">
                                    
                                    <a :href="getDownloadUrl(file.attachment_id)"><span class="dashicons dashicons-download"></span></a>
                                    <a :href="contentURL(file)"><span class="dashicons dashicons-admin-links"></span></a>
                                    <a :href="contentURL(file)" class="pm-comments-count"><span class="pm-btn pm-btn-blue pm-comment-count"></span></a>
                                
                                </div>
                            </div>
                            
                        </div>
                    </li>


                    <div class="clearfix"></div>
                </ul>

                <ul v-if="!files.length">
                    <li>{{ __('No results found.', 'wedevs-project-manager') }}</li>
                </ul>

            </div>
        </div>
        <div class="pm-files" v-else>
            <do-action :hook="'pm_file_footer'"></do-action>
        </div>
    </div>

</template>

<style lang="less">
    .pm-files {
        margin-top: 10px;
    }
</style>

<script>

    import do_action from '@components/common/do-action.vue';
    import Header from '@components/common/header.vue';
    import Mixins from './mixin';
    
    export default {

        mixins: [Mixins],
        created () {
            
            if (!PM_Vars.is_pro) {
                this.getFiles();
            }
        },
        computed: {
            ...pm.Vuex.mapState('projectFiles', ['files']),
        },

        data() {
            return {
                loading: true,
                is_pro: PM_Vars.is_pro
            }
        },

        components: {
            'do-action': do_action,
            'pm-header': Header
        },

        methods: {
            selfDownloadFile (file) {
                this.fileDownload( file.attachment_id );
            },
            attachTo (file) {
                if (file.fileable_type === 'discussion_board') {
                    return 'Discuss';
                }

                if (file.fileable_type === 'comment') {
                    return 'Comment';
                }
            },

            contentURL(file) {
                var self = this;
                switch(file.fileable_type) {
                    
                    case 'discussion_board':
                        return '#/projects/'+self.project_id+'/discussions/'+file.fileable_id;
                        break;

                    case 'task_list':
                        return '#/projects/'+self.project_id+'/task-lists/'+file.fileable_id;
                        break;

                    case 'task':
                        return '#/projects/'+self.project_id+'/task/'+file.fileable_id;
                        break;
                    case 'comment':
                        return self.getCommentUrl(file);
                        break;

                    default:
                        break;
                }
            },

            getCommentUrl (file) {
                var self = this;
                
                switch(file.fileable.commentable_type) {
                    case 'task_list':
                        return '#/projects/'+self.project_id+'/task-lists/'+file.fileable.commentable_id;
                        break;

                    case 'discussion_board':
                        return '#/projects/'+self.project_id+'/discussions/'+file.fileable.commentable_id;
                        break;

                    case 'task':
                        return '#/projects/'+self.project_id+'/task/'+file.fileable.commentable_id;
                        break;
                }
            }
        
        }

    }

</script>

            <!-- <ul class="pm-files">    

                <li class="pm-files-li">
                <div class="ff-content">
                    <div class="image-content">
                        <img src="http://localhost/test/wp-content/plugins/cpm-pro-module/assets/images/folder.png">

                        <div class="view">test</div>
                        <div class="edit">
                            <input type="text">
                            <a href="#" class="save button secondary dashicons-before dashicons-yes"></a>
                            <a href="#" class="cancel button secondary dashicons-before dashicons-no-alt"></a>
                        </div>

                    </div>

                    <div class="footer-section">
                        <a href="#"><span class="dashicons dashicons-lock"></span></a>
                        <a href="#"><span class="dashicons dashicons-trash"></span></a>
                    </div>
                </div>
            </li>  
                
                <li class="pm-files-li" v-for="file in files">
                    <div class="ff-content">
                        <div class="pm-thumb">
                            <a class="pm-colorbox-img" :title="file.name" :href="file.url">
                                <img :src="file.thumb" :alt="file.name">
                            </a>
                        </div>
                        <div class="">
                            <h3 class="pm-file-name">{{ file.name }}</h3>

                            <div class="pm-file-meta">
                                Attached to 
                                <a :href="contentURL(file)">{{ attachTo(file) }}</a> 
                                by 
                                <a href="#/" title="admin">
                                    admin
                                </a>                
                            </div>

                            <div class="pm-file-action">
                                <ul>
                                    <li class="pm-go-discussion"> <a :href="contentURL(file)"></a> </li>
                                    <li class="pm-download-file"> <a :href="file.url"> </a> </li>
                                    <li class="pm-comments-count"> <span>  </span> <div class="pm-btn pm-btn-blue pm-comment-count"> 1</div></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>  -->



