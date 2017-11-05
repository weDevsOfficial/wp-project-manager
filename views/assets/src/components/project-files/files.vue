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


        <div v-if="!loading" class="pm-files-page">
            <ul class="pm-files">        
                <li v-for="file in files">
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
                </li>
            </ul> 
        </div>
    </div>

</template>

<script>
    import header from './../common/header.vue';

    export default {
        beforeRouteEnter(to, from, next) {

            next(vm => {
                vm.getFiles();
            });
        },
        components: {
            'pm-header': header
        },
        computed: {
            files () {
                return this.$store.state.files;
            }
        },
        data(){
            return {
                loading: true,
            }
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



