<template>
    <!-- start features section -->
    <section class="pm-section pm-section-wrapper pm-feature-section">
        <div class="pm-section-title">
            <h2>{{ __('Features you can use...', 'wedevs-project-manager') }}</h2>
        </div>
        <div class="pm-section-content">
            <div class="pm--row pm-gutter-20">
                <template v-for="feature in featureItems">
                    <feature-widget :feature="feature"></feature-widget>
                </template>
            </div>
            <div class="pm-text-center view-all-feature">
                <a href="#" class="pm-btn pm-btn-primary">View All Features</a>
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
                        'featureName': 'Overview',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'overview-thumb.jpg',
                        'cardClass': 'overview'
                    },
                    {
                        'featureName': 'Activities',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '#',
                        'featureThumb': 'activities-thumb.jpg',
                        'cardClass': 'activities'
                    },
                    {
                        'featureName': 'Team Discussion',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'discussion-thumb.jpg',
                        'cardClass': 'discussion'
                    },
                    {
                        'featureName': 'To-do Lists',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'task-thumb.jpg',
                        'cardClass': 'task'
                    },
                    {
                        'featureName': 'Milestone',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'milestone-thumb.jpg',
                        'cardClass': 'milestone'
                    },
                    {
                        'featureName': 'Manage Files',
                        'featureDescription': 'Create with limitless possibilities. This Web Based Project Management System is packed with features & tools to boost your team productivity.',
                        'featureVideo': '668nUCeBHyY',
                        'featureThumb': 'file-thumb.jpg',
                        'cardClass': 'files'
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
    .pm-feature-section {
        margin-bottom: 87px;
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
            img {
                max-width: 100%;
            }
        }
        &.overview .pm-feature-thumb {
            background: #DEEBFB;
        }
        &.activities .pm-feature-thumb {
            background: #E3DBEA;
        }
        &.discussion .pm-feature-thumb {
            background: #E5E7FD;
        }
        &.task .pm-feature-thumb {
            background: #DFF7CE;
        }
        &.milestone .pm-feature-thumb {
            background: #F2EBDF;
        }
        &.files .pm-feature-thumb {
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
                font-weight: 600;
                text-align: center;
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
