<template>
    <div class="pm-welcome-page-container">
        <welcome-banner />
        <welcome-features />
        <welcome-resources />
    </div>
</template>
<script>
    // import banner component
    import Banner from './WelcomeBanner.vue'
    import Features from './Features.vue'
    import Resources from './resources.vue'

    export default {
        data () {
            return {
               
            }
        },

        methods: {
            
        },

        created(){
            pm.NProgress.done();
        },

        components: {
            'welcome-banner': Banner,
            'welcome-features': Features,
            'welcome-resources': Resources,
        }
    }
</script>

<style lang="less">

@-moz-keyframes play_effect_btn {
    0% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -webkit-moz-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
    50% {
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    100% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -moz-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
}
@-webkit-keyframes play_effect_btn {
    0% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -webkit-moz-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
    50% {
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    100% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -moz-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
}
@keyframes play_effect_btn {
    0% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -webkit-moz-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
    50% {
        -moz-box-shadow: none;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
    100% {
        -webkit-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        -moz-box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
        box-shadow: 0 0 0 20px rgba(245, 199, 227, 0.35), 
        0 0 0 10px rgba(245, 199, 227, 0.65);
    }
}
    .pm-welcome-page-container {
        font-weight: 300;
        line-height: 24px;  
        max-width: 925px;
        margin: 0 auto;
        margin-top: 45px;
        img {
            max-width: 100%;
        } 
        .pm-video-modal {
            .modal-header, 
            .modal-footer {
                padding: 0;
                border: 0;
            }
            .modal-header {
                background: transparent;
                border-radius: 3px 3px 0 0;
            }
            .modal-body {
                margin-top: -5px;
            }
            .close-vue-modal {
                background: transparent !important;
                a {
                    padding: 0;
                    background: #000;
                    color: #fff;
                    border-radius: 100%;
                    width: 26px;
                    height: 26px;
                    line-height: 26px;
                    font-size: 11px;
                    border: 1px solid #fff;
                    margin-top: -13px;
                    margin-right: -13px;
                    &:hover {
                        background: #9c0c0c;
                    }
                }
            }
            iframe {
                display: flex;
                max-width: 100%;
            }
        }
    }
    .pm-section-wrapper {
        margin-bottom: 68px;
    }
    .pm-section-title h2 {
        font-size: 28px;
        color: #242E3C;
        text-align: center;
    }
    .pm-section-title {
        margin-bottom: 40px;
        h2 {
            color: #242E3C;
            font-weight: 500;
            margin: 0;
        }
    }

    .pm-video-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        opacity: 0.48;
        background-image: linear-gradient(-135deg, #F9769D 0%, #BB6DF7 98%);
        box-shadow: 0 7px 18px 0 rgba(0,0,0,0.31);
        cursor: pointer;
        -webkit-transition: all .3s;
        -moz-transition: all .3s;
        transition: all .3s;
        margin: 0 auto;
        border-radius: 50%;
        cursor: pointer;
        -webkit-animation: play_effect_btn 3s infinite ease-in-out;
        -moz-animation: play_effect_btn 3s infinite ease-in-out;
        animation: play_effect_btn 3s infinite ease-in-out;
        // background: #FFFFFF;
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 99;
            transform: translate(-50%, -50%);
            border-left: 10px solid #fff;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
        }
        &:hover {
            opacity: 1;
        }
    }

    .pm-btn {
        font-size: 12px;
        font-weight: 300;
        padding: 4px 17px !important;
        letter-spacing: 0.20px;
    }
</style>
