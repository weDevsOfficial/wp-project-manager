<template>
    <!-- start banner section -->
    <section class="pm-section pm-section-wrapper pm-banner-section">
        <div class="pm-video-modal">
            <pm-modal v-if="show" :is-active="show" @close="show=false" :width="600">
                <iframe width="600" height="315" src="https://www.youtube.com/embed/rliDPp4sIyM/?VQ=HD1080&autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </pm-modal>
        </div>

        <div class="pm-section-container">
            <div class="pm--row">
                <div class="pm-col-sm-6 pm-col-xs-12">
                    <p class="pm-welcome-to">{{ __('Welcome to', 'wedevs-project-manager') }}</p>
                    <h1 class="pm-project-title">{{ __('WP Project Manager', 'wedevs-project-manager') }}</h1>
                    <p>{{ __('The best project management tool for WordPress to get things done with your team.', 'wedevs-project-manager') }}
                        <!-- <br>{{ __('Filter, edit, update or take', 'wedevs-project-manager') }} -->
                    </p>
                    <div class="pm-buttons-container">
                        <router-link 
                            :to="{ name: 'project_lists' }" 
                            class="pm-btn pm-btn-primary">

                            {{ __('Create Your First Project', 'wedevs-project-manager') }}
                        </router-link>
                        
                        <a href="https://wedevs.com/docs/wp-project-manager/" rel="noopener" target="_blank" class="pm-btn pm-btn-white">{{ __('Read Full Guide', 'wedevs-project-manager') }}</a>
                    </div>
                </div>
                <div class="pm-col-sm-6 pm-col-xs-12">
                    <div class="pm-welcome-video-container">
                        <div class="pm-video-thumb">
                            <img class="pm-float-right" :src="getAssetUrl('images/welcome/intro-video-bg-image.png')" alt="Image Missing">
                            <div class="pm-video-icon" @click="show = true"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section><!-- end banner section -->
</template>
<script>
    import modal from '@components/common/modal.vue';
    export default {
        data () {
            return {
               show: false
           }
       },
       components: {
        'pm-modal': modal
    }
}
</script>

<style lang="less" scoped>

.pm-banner-section {
    background-image: linear-gradient(139deg, #C444FB 0%, #5B56D7 100%);
        // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
        border-radius: 3px;
        padding: 30px 60px;
        color: #fff;
        font-weight: 300;
        p {
            color: #dab1fd;
            font-size: 16px;
            line-height: 25px;
            margin-bottom: 15px;
        }
        .pm-welcome-to {
            font-size: 14px;
            color: #F7CC53;
            margin: 0 0 5px;
        }
        .pm-project-title {
            color: #fff;
            font-size: 30px;
        }
        [class^='pm-col'] {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .pm-video-thumb {
            display: inline-block;
            float: right;
            position: relative;
        }
        .pm-buttons-container {
            margin-top: 10px;
            .pm-btn {
                font-size: 12px;
                font-weight: 400;
                padding: 8px 17px !important;
                letter-spacing: 0.20px;
                transition: all .3s;
                font-weight: 500;
                &:hover {
                    box-shadow: 0 7px 18px 0 rgba(0, 0, 0, 0.31);
                }
            }
            .pm-btn-primary {
                &:hover {
                    background: #1A9ED4;
                }
            }
            .pm-btn-white {
                margin-left: 12px;
                color: #924DEA;
            }
        }
        @media(max-width: 767px) {
            margin-top: 20px;
            text-align: center;
            padding-left: 20px;
            padding-right: 20px;
            .pm-btn {
                margin: 0 0 10px 0 !important;
            }
            .pm-video-thumb {
                float: none;
            }
        }
    }
</style>
