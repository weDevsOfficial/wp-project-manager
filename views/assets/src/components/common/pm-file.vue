<template>
<div class="pm-file">
    <a v-if="isVideo" v-pm-pretty-photo class="pm-colorbox-img pm-video" :href="file.url + '?iframe=true'" :title="file.name" target="_blank" rel="prettyPhoto">
        <img class="pm-content-img-size" :src="file.thumb" :alt="file.name">
    </a>

    <a v-else-if="isPrettyPhoto" v-pm-pretty-photo class="pm-colorbox-img" :href="file.url" :title="file.name" target="_blank" rel="prettyPhoto">
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
        isPrettyPhoto () {
            return this.file.type == 'image';
        },
        isVideo () {
            return this.file.mime_type.split("/").indexOf('video') !== -1;
        }
    },
    methods: {
        
    }
}
</script>


<style lang="css">
    
</style>