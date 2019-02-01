<template>
    <!-- start features section -->
    <section class="pm-section pm-section-wrapper pm-premium-feature-section">
        <div class="pm-section-content">
            <div class="pm--row pm-gutter-35">
                <template v-for="feature in featureItems">
                    <feature-widget :feature="feature"></feature-widget>
                </template>
            </div>
        </div>
    </section><!-- end features section -->
</template>
<script>
    import featureWidget from "./featureWidget.vue";

    export default {
        data () {
            return {
                show: false,
                featureItems: [
                    {
                        'featureName': 'Calendar',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'calendar-thumb.jpg',
                        'cardClass': 'calendar',
                        'url': 'https://wedevs.com/wp-project-manager-pro/features/'
                    },
                    {
                        'featureName': 'Report',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '#',
                        'featureThumb': 'report-thumb.jpg',
                        'cardClass': 'report',
                        'url': 'https://wedevs.com/wp-project-manager-pro/features/'
                    },
                    {
                        'featureName': 'Progress',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'progress-thumb.jpg',
                        'cardClass': 'progress',
                        'url': 'https://wedevs.com/wp-project-manager-pro/features/'
                    }
                ]
            }
        },
        components: {
            featureWidget,
        }
    }
</script>

<style lang="less">
    .pm-premium-feature-section {
        margin-bottom: 87px;
        margin-top: -170px;
        .pm-section-content {
            padding: 0 40px;
            @media ( max-width: 767px ){
                padding: 0 20px;
            }
        }
    }
    .pm-section-title {
        h2 {
            margin: 0;
        }
    }
    .pm-feature-card {
        border-radius: 3px;
        margin-bottom: 20px;
        background: #fff;
        .pm-feature-thumb {
            display: flex;
            justify-content: center;
            text-align: center;
            background: #DEEBFB;
            position: relative;
            border-radius: 3px 3px 0 0;
            img {
                max-width: 100%;
            }
        }
        &.calendar .pm-feature-thumb {
            background: #E5E7FD;
        }
        &.report .pm-feature-thumb {
            background: #E7DAF3;
        }
        &.progress .pm-feature-thumb {
            background: #DAEEF0;
        }
        .pm-feature-infos {
            padding: 20px;
            border: 1px solid #E2E2E2;
            border-top: 0;
            border-radius: 0 0 3px 3px;
            h3 {
                font-size: 23px;
                color: #23282D;
                margin: 0 0 10px;
                font-weight: 400;
            }
            p {
                color: #758598;
                line-height: 24px;
                font-size: 14px;
            }
        }
    }
    .view-all-feature {
        margin-top: 20px;
    }

    @media (max-width: 767px) and (min-width: 480px) {
        .pm--row {
            [class^='pm-col-'] {
                flex-basis: 50%;
                max-width: 50%;
            }   
        }
    }
</style>
