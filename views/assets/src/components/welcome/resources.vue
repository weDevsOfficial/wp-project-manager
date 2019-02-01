<template>
   <div>
        <!-- start features section -->
        <section class="pm-section pm-section-wrapper pm-resource-section">
            <div class="pm-import-section">
                <div class="pm-import-icon">
                    <img :src="getAssetUrl( 'images/welcome/import-icon.svg')" alt="Import">
                </div>
                <div class="pm-import-content">
                    <h3>{{ __('Import', 'wedevs-project-manager') }}</h3>
                    <p>{{ __('Effortlessly import projects and project tasks from', 'wedevs-project-manager') }}<br> 
                        {{ __('other platforms to manage them at one place.', 'wedevs-project-manager') }}
                    </p>
                </div>
                <div class="pm-import-button">
                    <a href="#" class="pm-btn pm-btn-primary">{{ __('Import Now', 'wedevs-project-manager') }}</a>
                </div>
            </div>
            <div class="pm-section-title">
                <h2>{{ __('Resources of Project Manager', 'wedevs-project-manager') }}</h2>
            </div>
            <div class="pm-section-content">
                <div class="pm--row pm-gutter-20">
                    <div class="pm-col-sm-4 pm-col-xs-12" v-for="resource in resources">
                        <div :class="['pm-panel', 'pm-panel-default', 'pm-text-center', 'pm-resource-panel', resource.cardClass]">
                            <div class="pm-resource-infos">
                                <div class="pm-feature-icon"><img :src="getAssetUrl( 'images/welcome/' + resource.icon )" :alt="resource.title"></div>
                                <h3>{{ resource.title }}</h3>
                                <p class="pm-resource-description">{{ resource.description }}</p>
                                <p><a :href="resource.buttonUrl" target="_blank" rel="noopener" class="pm-btn pm-btn-primary">{{ resource.buttonLabel }}</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section><!-- end features section -->
   </div>
</template>
<script>
    export default {
        data () {
            return {
                resources: [
                    {
                        'title': 'Upgrade',
                        'description': __( 'Get upgraded to Pro version to unlock endlless opppurtunities of managing your project better.', 'wedevs-project-manager'),
                        'buttonLabel': __( 'Upgrade to Pro', 'wedevs-project-manager' ),
                        'buttonUrl': 'https://wedevs.com/wp-project-manager-pro/pricing/',
                        'cardClass': 'upgrade',
                        'icon': 'upgrade-icon.svg'
                    },
                    {
                        'title': 'Pro Features',
                        'description': __( 'Enhance your project management performance with its extended features in the pro version.', 'wedevs-project-manager' ),
                        'buttonLabel': __( 'View Pro features', 'wedevs-project-manager' ),
                        'buttonUrl': 'https://wedevs.com/wp-project-manager-pro/extensions/',
                        'cardClass': 'pro-feature',
                        'icon': 'pro-feature-icon.svg'
                    },
                    {
                        'title': 'Module',
                        'description': __( 'Check out all its useful modules that would take your project management experience to a whole new level.', 'wedevs-project-manager' ),
                        'buttonLabel': __( 'Go to Modules', 'wedevs-project-manager' ),
                        'buttonUrl': 'https://wedevs.com/wp-project-manager-pro/extensions/',
                        'cardClass': 'module',
                        'icon': 'module-icon.svg'
                    }
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    .pm-import-section {
        display: flex;
        padding: 16px 50px 16px 30px;
        margin: -68px -50px 50px;
        align-items: center;
        border-bottom: 1px solid #e2e2e2;
    }
    .pm-import-icon {
        max-height: 124px;
    }
    .pm-import-content {
        flex: 1;
        h3 {
            font-size: 28px;
            margin: 0;
        }
        p {
            font-size: 14px;
            margin-bottom: 0;
        }
    }
    .pm-resource-section {
        border-radius: 3px;
        background: #fff;
        border: 1px solid #e2e2e2;
        padding: 68px 50px;
        .pm-section-title {
            margin-bottom: 68px;

            h2 {
                margin: 0;
            }
        }
        @media (max-width: 767px) {
            padding-left: 20px;
            padding-right: 20px;
            .pm-resource-panel {
                max-width: 400px;
                margin: 20px auto;
            }
        }
    }
    .pm-resource-infos {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .pm-feature-icon {
            width: 68px;
            height: 68px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h3 {
            font-size: 23px;
            margin-bottom: 12px;
        }
        p {
            line-height: 24px;
            font-size: 14px;
        }
        .pm-resource-description {
            margin: 0 0 10px;
        }
    }

    .pm-resource-panel {
        &.upgrade .pm-feature-icon {
            background-image: linear-gradient(-147deg, #64E09C 0%, #51C1AD 100%);
            // border: 1px solid rgba(0,0,0,0.03);
            box-shadow: 0 10px 40px 0 rgba(0,0,0,0.07);
        }
        &.pro-feature .pm-feature-icon {
            background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
            // border: 1px solid rgba(0,0,0,0.03);
            box-shadow: 0 10px 40px 0 rgba(0,0,0,0.07);
        }
        &.module .pm-feature-icon {
            background-image: linear-gradient(135deg, #907CFF 3%, #6EACFF 98%);
            // border: 1px solid rgba(0,0,0,0.03);
            box-shadow: 0 10px 40px 0 rgba(0,0,0,0.07);
        }
    }


    
</style>
