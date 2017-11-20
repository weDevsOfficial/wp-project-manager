<template>
    <div>
        <div class="pm-col-5">
            <router-link 
                :to="{
                    name: 'individual_discussions',
                    params: {
                        project_id: project_id,
                        discussion_id: discuss.id
                    }
                }">
                {{ discuss.title }}
            </router-link>
        </div>

        <div class="pm-col-4 ">
            <span class="time">
                <time :datetime="discuss.created_at.date +' '+ discuss.created_at.time" :title="discuss.created_at.date +' '+ discuss.created_at.time">
                    {{discuss.created_at.date}} {{discuss.created_at.time}}
                </time>                                    
            </span>
        </div>
        <div class="pm-col-2">
            <a href="#">
                <img :alt="discuss.creator.data.display_name" :src="discuss.creator.data.avatar_url" class="avatar avatar-28 photo" height="28" width="28">
            </a>
            {{ discuss.creator.data.display_name }}                                
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        props: ['discuss'],
        mixins: [PmMixin.projectMilestones],
    }
</script>