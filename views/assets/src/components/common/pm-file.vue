<template>
    <div class="pm-file">
        <a v-if="isVideo" v-pm-pretty-photo class="pm-colorbox-img pm-video" :href="file.url + '?iframe=true'" :title="file.name" target="_blank" rel="prettyPhoto">
            <img class="pm-content-img-size" :src="file.thumb" :alt="file.name" :title="file.name">
        </a>

        <a v-else-if="isPrettyPhoto" v-pm-pretty-photo class="pm-colorbox-img" :href="file.url" :title="file.name" target="_blank" rel="prettyPhoto">
            <img class="pm-content-img-size" :src="file.thumb" :alt="file.name" :title="file.name">
        </a>

        <a v-else-if="isPsd" class="pm-colorbox-img" :href="getDownloadUrl(file.attachment_id, projectId)" :title="file.name" target="_blank" rel="prettyPhoto">
            <!--<img class="pm-content-img-size" :src="file.thumb" :alt="file.name">-->
            <img class="pm-content-img-size" :src="getAssetUrl('/images/icons/icon-psd.png')" :alt="file.name" :title="file.name">
        </a>

        <a v-else class="pm-colorbox-img" :href="getDownloadUrl(file.attachment_id, projectId)" :title="file.name" target="_blank">
            <img v-if="file.absoluteUrl" class="pm-content-img-size" :src="file.absoluteUrl" :alt="file.name" :title="file.name">
            <img v-if="!file.absoluteUrl" class="pm-content-img-size" :src="file.thumb" :alt="file.name" :title="file.name">
        </a>
    </div>
</template>


<script>
export default {

    props: {
        file: {
            required : true,
            type     : Object,
        },

        file_project_id: {
            required : false,
            type     : Number
        }
    },

    computed: {
        isPrettyPhoto () {
            var photo = [];
            var extensions = ["jpg","jpeg","png","gif"]
            if (typeof this.file.mime_type !== 'undefined' ) {
                photo = this.file.mime_type.split("/");
                if(extensions.includes(photo[1])){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        isVideo () {
            if (typeof this.file.mime_type !== 'undefined' ) {
                return this.file.mime_type.split("/").indexOf('video') !== -1;
            } else {
                //return this.file.type.split("/").indexOf('video') !== -1;
            }
        },

        isPsd () {
            var psd = [];
            if (typeof this.file.mime_type !== 'undefined' ) {
                psd = this.file.mime_type.split("/");
                if(psd[1] === "vnd.adobe.photoshop"){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        },

        projectId () {
           if ( typeof this.file.fileable !== 'undefined' && this.file.fileable.project_id !== null ) {
               return this.file.fileable.project_id;
           }

           return this.project_id > 0 ? this.project_id : this.file_project_id;
        }
    }
}
</script>
