<template>
    <div class="pm-wrap  pm-front-end">
        <pm-header></pm-header>
        <pm-heder-menu></pm-heder-menu>

        <div class="pm-files pm-files-container-free" v-if="!is_pro">
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
            <pro-files v-if="!loading"></pro-files>
            <div v-if="!loading">
                <ul class="pm-folders-list" v-if="files.length">
                    <li class="file" v-for="file in files" :key="file.id">

                        <div class="ff-content">
                            <div>
                                <div class="image-content">

                                    <pm-file :file="file" />
                                    <div class="item-title" v-if="file.meta.title">{{ file.meta.title.slice(0, 20) }}</div>
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

                                    <a v-if="file.attachment_id" @click.prevent="checkPermissionAndDownload(getDownloadUrl(file.attachment_id), file.url)" :href="getDownloadUrl(file.attachment_id)" >
                                    <span class="dashicons dashicons-download"></span></a>
                                    <a v-if="contentURL(file)" :href="contentURL(file)"><span class="dashicons dashicons-admin-links"></span></a>
                                    <a v-if="contentURL(file)" :href="contentURL(file)" class="pm-comments-count"><span class="pm-btn pm-btn-blue pm-comment-count"></span></a>

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
        <div v-else class="pm-files pm-files-container-pro">
            <do-action :hook="'pm_file_footer'"></do-action>
        </div>
    </div>
</template>

<style lang="less" scoped>
.pm-files-container-free {
  height: 65vh;
}
</style>

<script>
    import do_action from '@components/common/do-action.vue';
    import Header from '@components/common/header.vue';
    import Files from './pro-files.vue';
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
            'pm-header': Header,
            'pro-files': Files,
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
            },
            async checkPermissionAndDownload(permissionUrl, downloadUrl) {
                try {
                    const headers = {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": PM_Vars.permission,
                    };

                    const response = await fetch(permissionUrl, {
                        method: "GET",
                        headers,
                    });

                    if (response.ok) {
                        // If permission is granted, create a dynamic anchor tag
                        const dynamicAnchor = document.createElement("a");
                        dynamicAnchor.href = downloadUrl;
                        dynamicAnchor.target = "_blank";
                        document.body.appendChild(dynamicAnchor);
                        dynamicAnchor.click();
                        document.body.removeChild(dynamicAnchor);
                    } else {
                        alert("Permission denied.");
                    }
                } catch (error) {
                    console.error("Error checking permissions:", error);
                }
            },

        }

    }

</script>
