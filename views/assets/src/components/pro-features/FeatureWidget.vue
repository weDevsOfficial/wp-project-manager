<template>
    <div class="pm-col-sm-4 pm-col-xs-12">
        
        <div class="pm-video-modal">
            <!-- <pm-modal :is-active="show" @close="show=false" :width="600">
                <iframe width="600" height="315" :src="'https://www.youtube.com/embed/' + feature.featureVideo + '/?rel=0'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </pm-modal> -->
        </div>
        <div :class="['pm-feature-card', feature.cardClass]">
            <div class="pm-feature-thumb">
                <img :src="getAssetUrl('images/pro-feature/'+feature.featureThumb)" :alt="feature.featureName">
                <!-- <div class="pm-video-icon" @click="show=true"></div> -->
            </div>
            <div class="pm-feature-infos">
                <h3>{{ feature.featureName }}</h3>
                <p>{{ feature.featureDescription }}</p>
                <a target="_blank" rel="noopener" :href="feature.url" class="pm-btn pm-btn-link">{{ __('See More', 'wedevs-project-manager') }}</a>
            </div>
        </div>
    </div>
</template>

<script>
    import pmModal from '@components/common/Modal.vue';
    export default {
        data(){
            return {
                show: false
            }
        },
        props: {
            feature: {
                type: Object,
                required: true
            }
        },
        components: {
            pmModal
        }
    }
</script>

<style lang="less" scoped>
.pm-feature-infos p {
    margin-bottom: 0;
}
.pm-feature-infos {
    .pm-btn-link {
        padding: 0 !important;
        margin: 10px 0 0 0 !important;
        border: 1px solid transparent;
        font-weight: 500;
        color: #0073aa;
    }
    &:hover {
        .pm-btn-link {
           color: #1A9ED4;
        }
    }
}
</style>
