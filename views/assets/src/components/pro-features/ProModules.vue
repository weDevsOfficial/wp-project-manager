<template>
    <!-- start features section -->
    <section class="pm-section pm-section-wrapper pm-module-section">
        <div class="pm-section-title">
            <h2>{{ __('Available Modules', 'wedevs-project-manager') }}</h2>
        </div>
        <div class="pm-section-content">
            <div class="pm--row pm-gutter-35">
                <div class="pm-col-sm-4 pm-col-xs-12" v-for="module in modules">
                    <div :class="['pm-card', 'pm-card-default', 'pm-text-center', 'pm-module-infos', module.cardClass]">
                        <div class="pm-feature-icon"><img :src="getAssetUrl( 'images/pro-feature/icons/' + module.icon )" :alt="module.title"></div>
                        <h3>{{ module.title }}</h3>
                        <p class="pm-module-description">{{ module.description }}</p>
                        <a :href="module.buttonUrl" target="_blank" ref="noopener" class="pm-btn pm-btn-link">{{__( 'See More', 'wedevs-project-manager'}}</a>
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
                modules: [
                    {
                        'title': __( 'Recurring Task', 'wedevs-project-manager'),
                        'description': __( 'Automate routine tasks with this super handy module. Just set the patterns & parameters and the tasks will repeat itself accordingly.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/recurring-task/',
                        'cardClass': 'recurring-task',
                        'icon': 'recuring-task.svg'
                    },
                    {
                        'title': __( 'BuddyPress', 'wedevs-project-manager'),
                        'description': __( "Need to bring team networking in your project manager? You're good to go.", 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/buddypress/',
                        'cardClass': 'buddypress',
                        'icon': 'buddypress.svg'
                    },
                    {
                        'title': __( 'Gantt Chart', 'wedevs-project-manager'),
                        'description': __( 'Get a graphical overview of task progress, deadline, sub-tasks, project dependencies - everything in one place.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/gantt-chart/',
                        'cardClass': 'gantt-chart',
                        'icon': 'gantt-chart.svg'
                    },
                    {
                        'title': __( 'Kanban Board', 'wedevs-project-manager'),
                        'description': __( 'Organize your tasks in Kanban style to keep team-mates updated about task status.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/kanban-board/',
                        'cardClass': 'kanban-board',
                        'icon': 'kanban-board.svg'
                    },
                    {
                        'title': __( 'WooCommerce Order', 'wedevs-project-manager'),
                        'description': __( 'Integrate task management with your WooCommerce store and automate the workflow.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/woocommerce-order/',
                        'cardClass': 'woocommerce',
                        'icon': 'woocommerce.svg'
                    },
                    {
                        'title': __( 'Sub Task', 'wedevs-project-manager'),
                        'description': __( 'Break down your tasks into smaller ones to work more effectively. Keep track of every detail.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/sub-task/',
                        'cardClass': 'sub-task',
                        'icon': 'subtask.svg'
                    },
                    {
                        'title': __( 'Time Tracker', 'wedevs-project-manager'),
                        'description': __( 'Track the exact time you spend on specific tasks. With Interval option of course.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/time-tracker/',
                        'cardClass': 'time-tracker',
                        'icon': 'time-tracker.svg'
                    },
                    {
                        'title': __( 'Invoice', 'wedevs-project-manager'),
                        'description': __( 'Invoice creation, payment collection have never been easier before.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/invoice/',
                        'cardClass': 'invoice',
                        'icon': 'invoice.svg'
                    },
                    {
                        'title': __( 'Stripe Gateway', 'wedevs-project-manager'),
                        'description': __( 'Enable the hassle-free and popular payment system with the minimum cost possible.', 'wedevs-project-manager'),
                        'buttonUrl': 'https://wedevs.com/products/plugins/wp-project-manager-pro/invoice-stripe-gateway/',
                        'cardClass': 'stripe-gateway',
                        'icon': 'stripe.svg'
                    }
                ]
            }
        }
    }
</script>

<style lang="less" scoped>
    .pm-module-section {
        padding: 0 40px 25px;
        margin-bottom: 0;
        .pm-section-title {
            margin-bottom: 68px;
            h2 {
                margin: 0;
            }
        }
        [class^='pm-col-'] {
            margin-bottom: 35px;
        }
        @media (max-width: 767px) {
            padding-left: 20px;
            padding-right: 20px;
            .pm-module-panel {
                max-width: 400px;
                margin: 20px auto;
            }
        }
    }
    // .recurring-task .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #64E09C 0%, #51C1AD 100%);
    // }
    // &.buddypress .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #FF6167 0%, #FF0E27 100%);
    // }
    // &.gantt-chart .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
    // }
    // &.kanban-board .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #72D0FF 0%, #349EFA 100%);
    // }
    // &.woocommerce .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #C95FF4 0%, #5527FD 100%);
    // }
    // &.sub-task .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #8646DD 0%, #5D00FF 100%);
    // }
    // &.time-tracker .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #FFA2AE 0%, #CE6CFB 100%);
    // }
    // &.invoice .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #B4EC51 0%, #429321 100%);
    // }
    // &.stripe-gateway .pm-feature-icon {
    //     background-image: linear-gradient(-180deg, #0ACEFE 0%, #6772E5 100%);
    // }
    // .pm-feature-icon {
    //     box-shadow: 0 10px 40px 0 rgba(0,0,0,0.07);
    // }
    .pm-module-infos {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        padding-top: 0;
        padding-bottom: 20px;
        border-radius: 5px;
        
        h3 {
            font-size: 23px;
            margin-bottom: 12px;
            margin-top: -35px;
        }
        p {
            line-height: 24px;
            font-size: 14px;
        }
        .pm-module-description {
            margin: 0 0 10px;
        }
        .pm-btn {
            color: #1A9ED4;
            font-size: 13px;
            font-weight: 400;
            border: 1px solid transparent;
            &:hover {
                border: 1px solid #1A9ED4;
            }
        }
    }

    .pm-module-panel {
        &.upgrade .pm-feature-icon {
            background-image: linear-gradient(-147deg, #64E09C 0%, #51C1AD 100%);
        }
        &.pro-feature .pm-feature-icon {
            background-image: linear-gradient(-180deg, #FAD961 0%, #F76B1C 100%);
        }
        &.module .pm-feature-icon {
            background-image: linear-gradient(135deg, #907CFF 3%, #6EACFF 98%);
        }
    }


    
</style>
