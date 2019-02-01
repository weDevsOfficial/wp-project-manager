<template>
    <!-- start features section -->
    <section class="pm-section pm-section-wrapper pm-more-feature-section">
        <div class="pm-section-title pm-text-center">
            <p>{{ __('More features to unveil while', 'wedevs-project-manager') }}</p>
            <h2>{{ __('Managing Your Project', 'wedevs-project-manager') }}</h2>
            <p class="text-muted">
                Useful & fascinating features for WP Project Manager that can be<br> unlocked with the Pro Version.
            </p>
        </div>
        <div class="pm-section-content">
            <div class="pm--row pm-gutter-35">
                <div class="pm-col-sm-8 pm-col-xs-12">
                    <ul class="more-feature-list">
                        <li v-for="feature in featureLists"><i class="flaticon-check-mark"></i>{{ feature }}</li>
                    </ul>
                </div>
                <div class="pm-col-sm-4 pm-col-xs-12">
                    <div class="pm-get-started-block">
                        <div class="pm-start-price">
                            <small><sup>$</sup></small>00
                        </div>
                        <div class="pm-start-block-content">Per Year<br><a href="https://wedevs.com/wp-project-manager-pro/pricing/" target="_blank" rel="noopener" class="pm-btn pm-btn-lg pm-btn-primary">Get Started Now</a></div>
                    </div>
                </div>
            </div>
        </div>
    </section><!-- end features section -->
</template>
<script>
    export default {
        data () {
            return {
                featureLists: [
                    'Built-in private messenger',
                    'Set the start & end date of the project',
                    'Upload all files in one place',
                    'Create folders for files',
                    'Link messages & task lists with files',
                    'Project user permission',
                    'Team category permission',
                    'Frontend projects and discussions',
                    'Automatic daily digest emails',
                    'Advanced filters for reports',
                    'Real-time updates'
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    .pm-get-started-block {
        padding: 75px 42px 22px;
        border-radius: 3px;
        position: relative;
        background: #FFFFFF;
        border: 1px solid #F0F0F0;
        box-shadow: 0 16px 56px 0 rgba(0,0,0,0.09);
        text-align: center;
        .pm-start-block-content {
            .pm-btn {
                margin-top: 15px;
                padding-top: 12px !important;
                padding-bottom: 12px !important;
            }
        }
        .pm-start-price {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 33px;
            color: #fff;
            width: 113px;
            height: 113px;
            border-radius: 50%;
            position: absolute;
            top: -56px;
            left: 50%;
            margin-left: -56px;
            z-index: 9;
            background-image: linear-gradient(-147deg, #C444FB 0%, #5B56D7 100%);
            border: 10px solid #FFFFFF;
            box-shadow: 0 13px 29px 0 rgba(85,16,114,0.16);
            letter-spacing: 1.3px;
            small {
                font-size: 18px;
                display: inline-flex;
                margin-top: -3px;
            }
        }
    }
    .pm-more-feature-section {
        margin: 0px 40px;;
        padding: 0 40px 60px;
        border-radius: 5px;
        background: #fff;
        border: 1px solid #ECECEC;
        .pm-section-title {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 35px 0;
            p {
                font-size: 13px;
                color: #23282D;
                margin-bottom: 8px;
                &.text-muted {
                    color: #758598;
                    line-height: 24px;
                }
            }
            h2 {
                margin: 0 0 5px;
            }
        }
        .more-feature-list {
            column-count: 2;
            li {
                color: #72777C;
                font-size: 14px;
                display: flex;
                align-items: center;
                margin-bottom: 9px;
                i {
                    display: inline-flex;
                    margin-right: 5px;
                    color: #1ABC9C;
                }
                i:before {
                    font-size: 20px !important;
                }
            }
        }
        @media (max-width: 767px) {
            padding-left: 20px;
            padding-right: 20px;
            margin: 0 20px;
            .pm-section-title {
                margin-bottom: 0;
            }
            .pm-module-panel {
                max-width: 400px;
                margin: 20px auto;
            }
            .more-feature-list {
                column-count: 1;
                margin-bottom: 80px !important;
            }
            
        }
    }
    
</style>
