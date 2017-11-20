<template>
    <div class="wrap pm pm-front-end">
        <pm-header></pm-header>
        <div v-if="!is_pro">
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
                

                <ul class="pm-folders-list">
                    <li class="file" v-for="file in files">

                        <div class="ff-content">
                            <div>
                                <div class="image-content">
                                    
                                    <a class="pm-colorbox-img" :title="file.name" :href="file.url">
                                        <img :src="file.thumb" :alt="file.name">
                                    </a>
                                    
                                    <div class="item-title">{{ file.name }}</div>
                                    <span class="text">
                                        Attached to 
                                        <a :href="contentURL(file)">{{ attachTo(file) }}</a>  
                                        by 
                                        <a href="#/" title="admin">
                                            admin
                                        </a>
                                    </span>
                                </div>

                                <div class="footer-section">
                                    
                                    <a :href="file.url"><span class="dashicons dashicons-download"></span></a>
                                    <a :href="contentURL(file)"><span class="dashicons dashicons-admin-links"></span></a>
                                    <a href="#" class="pm-comments-count"><span class="pm-btn pm-btn-blue pm-comment-count">0</span></a>
                                
                                </div>
                            </div>
                            
                        </div>
                    </li>


                    <div class="clearfix"></div>
                </ul>

            </div>
        </div>
        <div v-else>
            <do-action :hook="'pm_file_footer'"></do-action>
        </div>
    </div>

</template>

<script>

    import do_action from '@components/common/do-action.vue';
    import Header from '@components/common/header.vue';
    
    export default {

        mixins: [PmMixin.projectFiles],
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

            attachTo (file) {
                if (file.fileable_type === 'discussion_board') {
                    return 'Discuss';
                }
            },

            contentURL(file) {
                var self = this;
                switch(file.fileable_type) {
                    
                    case 'discussion_board':
                        return '#/'+self.project_id+'/discussions/'+file.fileable_id;
                        break;

                    case 'task_list':
                        return '#/'+self.project_id+'/task-lists/'+file.fileable_id;
                        break;

                    case 'task':
                        return '#/'+self.project_id+'/task/'+file.fileable_id;
                        break;

                    default:
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



