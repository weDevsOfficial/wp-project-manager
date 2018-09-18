<template>
<div class="pm-file">
    <a v-if="file.type == 'image'" v-pm-pretty-photo class="pm-colorbox-img" :href="getDownloadUrl(file.attachment_id)" :title="file.name" target="_blank">
        <img class="pm-content-img-size" :src="file.thumb" :alt="file.name">
    </a>

    <a v-else class="pm-colorbox-img" :href="getDownloadUrl(file.attachment_id)" :title="file.name" target="_blank">
        <img class="pm-content-img-size" :src="file.thumb" :alt="file.name">
    </a>
</div>
    
</template>


<script>
export default {
    props: {
        file: {
            required: true,
            type: Object,
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>


<style lang="css">
    
</style>