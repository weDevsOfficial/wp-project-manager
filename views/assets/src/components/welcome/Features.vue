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
                <a href="https://wedevs.com/wp-project-manager-pro/features/" target="_blank" rel="noopener" class="pm-btn pm-btn-primary">{{ __( 'View All Features', 'wedevs-project-manager' ) }}</a>
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
                        'featureName': __( 'Overview', 'wedevs-project-manager' ),
                        'featureDescription': __( 'In the overview section you will get a complete picture of your project. A chart for what has been done in the last 30 days, no of discussion, task lists, milestones and more.', 'wedevs-project-manager' ),
                        'featureVideo': 'rliDPp4sIyM',
                        'featureThumb': 'overview-thumb.jpg',
                        'cardClass': 'overview'
                    },
                    {
                        'featureName': __( 'Activities', 'wedevs-project-manager' ),
                        'featureDescription': __( 'You will also get a complete activity log history from the activities section of your project. All the activity will also be divided by date so it is easier to keep track.', 'wedevs-project-manager' ),
                        'featureVideo': 'KarLsZ8FPQQ',
                        'featureThumb': 'activities-thumb.jpg',
                        'cardClass': 'activities'
                    },
                    {
                        'featureName': __( 'Team Discussion', 'wedevs-project-manager' ),
                        'featureDescription': __( 'There is a built-in discussion panel right inside your projects. Consisting open, group discussion feature. Making team collaboration much more effective.', 'wedevs-project-manager' ),
                        'featureVideo': 'uCXHBIa-1Eg',
                        'featureThumb': 'discussion-thumb.jpg',
                        'cardClass': 'discussion'
                    },
                    {
                        'featureName': __( 'To-do Lists', 'wedevs-project-manager' ),
                        'featureDescription': __( 'In your projects you get a separate Task List tab to divide your work. You will be able to set due date for a task, set milestone, categorize and more.', 'wedevs-project-manager' ),
                        'featureVideo': 'mZS-GWiB1WQ',
                        'featureThumb': 'task-thumb.jpg',
                        'cardClass': 'task'
                    },
                    {
                        'featureName': __( 'Milestone', 'wedevs-project-manager' ),
                        'featureDescription': __( 'In the Milestones tab you will be able to set a specific milestone you want to reach. Set the name, due date, details. You will also see tasks set under each milestone.', 'wedevs-project-manager' ),
                        'featureVideo': 'umJozhMjkho',
                        'featureThumb': 'milestone-thumb.jpg',
                        'cardClass': 'milestone'
                    },
                    {
                        'featureName': __( 'Manage Files', 'wedevs-project-manager' ),
                        'featureDescription': __( "You don't need to rely on a separate file manager. WP Project Manager's Files feature will let you store all your files and see it in one place.", 'wedevs-project-manager' ),
                        'featureVideo': 'i1F3MNwrJbM',
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
