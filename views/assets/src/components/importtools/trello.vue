<template>
    <div class="wpuf-integrations-wrap">
        <div class="wpuf-integration">
            <div class="wpuf-integration-header">
                <!--<div class="wpuf-integration-header-toggle"></div>-->
                <div class="wpuf-integration-header-label">
                    <i class="fa fa-trello fa-3x"></i>
                    <span class="int_title">Trello </span>
                </div>
                <div @click.prevent="showHideContent()" class="wpuf-integration-header-actions">
                    <button type="button" class="toggle-area"><span class="screen-reader-text">Toggle panel</span> <span class="toggle-indicator"></span></button>
                </div>
            </div>
            <div v-if="showContent" class="wpuf-integration-settings">
                <div>
                    <div>
                        <div class="wpuf-int-form-row">
                            <div class="wpuf-int-field-label">
                                <label for="">{{ __( 'Provide your App Key & Token', 'wedevs-project-manager') }}</label>
                            </div>
                            <div class="wpuf-int-field">
                                <input id="app_key" name="app_key" :placeholder="__('App Key', 'wedevs-project-manager' )" class="regular-text">
                                <input id="app_token" name="app_token" :placeholder="__('App Token', 'wedevs-project-manager' )" class="regular-text">
                            </div>
                            <div class="wpuf-int-field">
                                <div v-if="trello.import_loader.length != 0">
                                    {{ trello.import_loader }} <i v-if="trello.import_loader.indexOf('completed') == -1" class="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i>
                                </div>
                                <div class="progress_bar_wrap">
                                    <div class="progress_bar" :style="'width:' + trello.import_perc + '%'"></div>
                                </div>
                            </div>
                            <div class="wpuf-int-field">
                                <div class="pm-pro-settings-action">
                                    <input id="trello_submit" type="submit" class="button button-primary"  :value="__('Import', 'wedevs-project-manager' )">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        props: ['trello'],

        data () {
            return {
                isActiveMoreOption: false,
                showContent: true,
                url : PM_Vars.api_base_url,
                import_loader : '',
                import_perc : 0
            }
        },

        computed: {

        },

        created () {
            pm.NProgress.done();
        },

        methods: {
            showHideContent () {
                this.showContent = this.showContent ? false : true;
            },
        }
    }
</script>

<style>

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions button.toggle-area {
        border: none;
        border-left: 1px solid #eee;
        background-color: #fff;
        width: 100%;
        height: 100%;
        outline: none;
    }

    .wpuf-integrations-wrap .wpuf-integration.collapsed .wpuf-integration-header .wpuf-integration-header-actions .toggle-indicator:before {
        content: "\f140";
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions .toggle-indicator:before {
        content: "\f140";
        content: "\f142";
        display: inline-block;
        font: normal 20px/1 dashicons;
        speak: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-decoration: none !important;
    }

    .wpuf-integrations-wrap .wpuf-integration {
        background-color: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.04);
        border: 1px solid #e5e5e5;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header {
        padding: 0;
        position: relative;
        margin: 0 auto;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-direction: row;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings {
        padding: 15px;
    }



    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-label {
        width: 100%;
        padding-top: 10px;
        font-weight: 500;
        font-size: 1.1em;
        padding-left: 10px;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-header .wpuf-integration-header-actions {
        width: 44px;
        display: block;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row {
        margin-bottom: 10px;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row .wpuf-int-field-label {
        float: left;
        width: 100%;
        padding-bottom: 15px;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row .wpuf-int-field {
        float: left;
        width: 100%;
        position: relative;
    }
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:before,
    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:after {
        content: " ";
        display: table;
    }

    .wpuf-integrations-wrap .wpuf-integration .wpuf-integration-settings .wpuf-int-form-row:after {
        clear: both;
    }

    .int_title {
        position: relative;
        top: -10px;
        left: 5px;
    }

    .fa.fa-trello.fa-3x{
        color: skyblue;
    }

    .fa.fa-spinner.fa-spin.fa-2x {
        margin-left: 10px;
        position: relative;
        top: 5px;
    }

    .regular-text {
        width: 49% ;
        border-radius: 5px;
    }

    .pm-pro-settings-action{
        text-align: right;
        width: 98%;
        padding-top: 15px;
    }

    #trello_submit {
        display: block;
        float: right;
    }

    .progress_bar {
        width : 0%;
        height : 30px;
        margin-top:15px;
        background-color: #00d265;
    }
    .progress_bar_wrap{
        width: 98.3% ;
    }
</style>
