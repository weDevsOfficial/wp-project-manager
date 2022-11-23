<template>
    <div class="wpuf-integration" v-if="hasGithub">
        <div :class="'wpuf-panel'  + ' ' + isActive">
            <div class="wpuf-panel-body">
                <div class="wpuf-integration-header-label">
                    <div class="github-title-wrap">
                        <img :src="getAssetUrl( '/images/GitHub.png' )">
                        <span class="int_title">{{ __( 'Github', 'wedevs-project-manager' ) }}</span>
                    </div>
                    <div class="bitbucket-title-wrap">
                        <img :src="getAssetUrl( '/images/bitbucket.svg' )" width="128px">
                    </div>
                </div>
            </div>
            <div class="wpuf-panel-footer">
                <div class="wpuf-setting">
                    <a href="#" @click.prevent="openModal($event.target)">
                        <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <g id="Individual-Form-Integration-Page-Design---weForms" transform="translate(-203.000000, -290.000000)" fill="#CCCCCC" fill-rule="nonzero">
                                  <g id="Group-4" transform="translate(183.000000, 116.000000)">
                                    <path
                                        d="M40.9342889,183.334097 C40.9010806,183.038903 40.5568864,182.817077 40.259262,182.817077 C39.2970029,182.817077 38.4431201,182.252081 38.0850175,181.378295 C37.7191793,180.483334 37.9550754,179.439603 38.6722182,178.781783 C38.8979565,178.575428 38.9253826,178.229992 38.7360563,177.990038 C38.2435578,177.364644 37.6837832,176.799726 37.0725944,176.310131 C36.8332603,176.118075 36.4821119,176.144797 36.2745796,176.374592 C35.648701,177.06773 34.5244636,177.325342 33.6557347,176.962873 C32.7516878,176.582588 32.1815991,175.666531 32.237389,174.683199 C32.2557512,174.374331 32.030013,174.10578 31.7220744,174.069916 C30.9377337,173.979201 30.1465168,173.976388 29.3598319,174.063665 C29.0554096,174.097263 28.8296713,174.359485 28.8399073,174.664447 C28.8741314,175.63809 28.2971666,176.53813 27.4021055,176.90474 C26.5437688,177.255333 25.4274233,176.999909 24.8027948,176.312944 C24.5963565,176.086664 24.2509121,176.058848 24.0104059,176.246294 C23.3810893,176.740031 22.8087346,177.305417 22.3117041,177.925655 C22.1178459,178.16678 22.1463659,178.516279 22.3743701,178.723728 C23.105187,179.385534 23.3411612,180.438328 22.9614927,181.343602 C22.5990145,182.206684 21.7027813,182.762929 20.6767623,182.762929 C20.3438199,182.752224 20.1066736,182.975691 20.0702617,183.278387 C19.9779036,184.06724 19.9768096,184.871017 20.0657297,185.666278 C20.0987036,185.962723 20.4533682,186.182595 20.7542743,186.182595 C21.6686353,186.159233 22.5465063,186.725323 22.9147667,187.621456 C23.2818551,188.516417 23.0458809,189.559522 22.3276441,190.217889 C22.1029998,190.424245 22.0744797,190.769134 22.2638061,191.009087 C22.7516945,191.630496 23.3115472,192.195961 23.9249239,192.689619 C24.1655082,192.883473 24.5155626,192.856126 24.7241107,192.62633 C25.3523334,191.931473 26.4764927,191.67433 27.3417836,192.037503 C28.2480965,192.416615 28.8181852,193.332594 28.7623952,194.316473 C28.7441893,194.625498 28.9710214,194.894517 29.2777098,194.929835 C29.6789441,194.976638 30.0826006,195 30.4873511,195 C30.8715515,195 31.25583,194.978903 31.6400304,194.936164 C31.9445309,194.902565 32.1701129,194.640344 32.1598769,194.334835 C32.1246371,193.361739 32.7026176,192.461699 33.5965067,192.095713 C34.4606255,191.742777 35.5722828,192.001092 36.1969894,192.687353 C36.4045998,192.913164 36.7476219,192.940433 36.9894564,192.753612 C37.617601,192.261048 38.1887836,191.69613 38.6881582,191.074173 C38.8819384,190.833595 38.8545904,190.483549 38.6254141,190.276178 C37.8945972,189.614373 37.657451,188.561423 38.0371194,187.656773 C38.39405,186.805177 39.2569967,186.233383 40.185188,186.233383 L40.3150519,186.236743 C40.6161144,186.2612 40.8931106,186.029294 40.9296007,185.721988 C41.0221151,184.932432 41.023209,184.129358 40.9342889,183.334097 Z M30.5166525,188.024555 C28.5852583,188.024555 27.0142326,186.453568 27.0142326,184.522222 C27.0142326,182.590953 28.5852583,181.019888 30.5166525,181.019888 C32.4479686,181.019888 34.0189943,182.590953 34.0189943,184.522222 C34.0189943,186.453568 32.4479686,188.024555 30.5166525,188.024555 Z"
                                        id="Shape"
                                        transform="translate(30.500000, 184.500000) scale(-1, 1) translate(-30.500000, -184.500000) "></path>
                                  </g>
                              </g>
                          </g>
                        </svg>
                    </a>
                </div>
                <div class="wpuf-integration-footer-toggle">
                    <span  @click.prevent="changeStatus()" :class="'pm-toggle-switch big '+ isChecked()" > </span>
                </div>
            </div>
        </div>
        <div id="git_bit" role="dialog" class="wf-modal">
            <div class="wf-modal-dialog">
                <div class="wf-modal-content">
                    <div class="wf-modal-header">
                        <div class="modal-header-left">
                            <div :class="'wpuf-toggle-switch big' + ' ' + isChecked()">
                                <span @click.prevent="changeStatus()" :class="'pm-toggle-switch big '+ isChecked()"></span>
                            </div>
                            <img :src="getAssetUrl( '/images/GitHub.png' )">
                            <span class="int_title">Github</span>
                            <img :src="getAssetUrl( '/images/bitbucket.svg' )" width="128px">
                        </div>
                        <span class="modal-close" @click.prevent="hideModal($event.target)">x</span>
                    </div>
                    <div class="wf-modal-body">
                        <div>
                            <div>
                                <div class="wpuf-int-form-row">
                                    <div class="wpuf-int-field-label">
                                        <label for="mailchimp-list-id">{{ __( 'Webhook URL', 'wedevs-project-manager') }}</label>
                                    </div>
                                    <div class="wpuf-int-field">
                                        <input @click="selectText()" type="text" class="regular-text token_field" readonly="readonly">
                                        <span class="int_url"></span>
                                        <br>
                                        <p class="help">
                                            {{ __( 'Webhook URL', 'wedevs-project-manager') }}
                                            {{ __( 'to send our JSON payloads', 'wedevs-project-manager' ) }}
                                            (<a href="https://wedevs.com/docs/wp-project-manager/integrations/github-bitbucket/" target="_blank">
                                              {{ __('View documentation', 'wedevs-project-manager') }}
                                            </a>)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form @submit.prevent="saveUsers()" method="post" id="saveUsers">
                                <div class="metabox-holder git_bit_wrap">
                                    <div id="pm_general" class="group" style="">

                                        <select id="getProjectUser"  @change="getProjectUser()" style="display: none">
                                            <option value="">Select</option>
                                            <option v-for="project in projects" :value="JSON.stringify(project.assignees.data)">{{ project.title }}</option>
                                        </select>


                                        <table class="wp-list-table widefat fixed striped posts">

                                            <thead>
                                                <tr>
                                                    <th scope="col" class="manage manage-column column-author">Users</th>
                                                    <th scope="col"  class="manage manage-column column-categories">Github Username</th>
                                                    <th scope="col"  class="manage manage-column column-categories">Bitbucket Username</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                <tr v-for="user in users">
                                                    <td>{{ user.username }}</td>
                                                    <td>
                                                       <input type="text" v-model="user.github" class="git_bit regular-text" />
                                                    </td>
                                                    <td>
                                                       <input type="text" v-model="user.bitbucket" class="git_bit regular-text"/>
                                                    </td>
                                                </tr>

                                                <tr v-if="!users.length">
                                                    <td colspan="3">No user found</td>
                                                </tr>

                                            </tbody>

                                        </table>

                                    </div>
                                </div>

                            </form>
                    </div>
                    <div class="wf-modal-footer">
                        <span v-if="spinner" class="pm-spinner"></span>
                        <button type="button" class="button button-primary" @click.prevent="saveUsers()">
                            {{ __( 'Save Form', 'wedevs-project-manager' ) }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        props: {
            github: {
                type: [Object, String],
                default () {
                    return {

                    }
                }
            },

            projectid: {
                type: Number
            },

            loadingStatus: {
                type: [Object],
                default () {
                    return {

                    }
                }
            },

        },

        data () {
            return {
                spinner: false,
                isActiveMoreOption: false,
                showContent: true,
                git_bit_hash : '',
                save_changes: __( 'Save Changes', 'wedevs-project-manager'),
                show_spinner: false,
                users : [],
                projects : [],
                github_name : 'github_',
                bitbucket_name : 'bitbucket_',
            }
        },

        computed: {

            hasGithub () {
                var github = this.$store.state.project.git_bit;
                if( github && !jQuery.isEmptyObject(github)) {
                    this.github = Object.assign(this.github, github );
                }

                setTimeout( () => {
                    this.$emit('hasGithub');
                },3000);

                return true;
            },

            isActive() {
                return this.github.status == 'enable' ? 'panel-checked' : '';
            }

        },

        mounted() {

        },

        created () {

        },

        methods: {
            showHideContent () {
                this.showContent = this.showContent ? false : true;
            },

            changeStatus(){

                if(this.$store.state.project.git_bit){
                    this.github.status = this.$store.state.project.git_bit.status = this.$store.state.project.git_bit.status == 'enable' ? 'disable' : 'enable';
                }else{
                    this.github.status = this.github.status == 'enable' ? 'disable' : 'enable';
                }
                this.save();
            },
            isChecked(){
                return this.github.status == 'enable' ? 'checked' : 'not-checked';
            },
            selectText(){
                event.target.select() ;
                document.execCommand('copy');
                pm.Toastr.success('Webhook Copied');
            },

            showHide: function(target) {
                $(target).closest('.wpuf-integration').toggleClass('collapsed');
            },

            openModal: function(target){
                $(target).parents('.wpuf-integration').find('.wf-modal').addClass('wf-modal-open');
            },

            hideModal: function(target){
                $(target).parents('.wf-modal').removeClass('wf-modal-open');
            },

            save: function () {
                // this.$emit('updateCapabilities');
                var self = this;

                var args = {
                    'git_bit': this.github,
                }

                this.spinner = true;

                this.saveSettings(args, this.projectid, function() {
                    self.spinner = false;
                });

            },

            saveUsers(){

                var formDataObj = {};

                this.users.forEach(function ( user ) {
                    formDataObj['github_' + user.id ] = user.github;
                    formDataObj['bitbucket_' + user.id ] = user.bitbucket;
                });

                this.save_map_users(formDataObj,function(data){
                    self.show_spinner = false;
                });

                this.save();
            },

            getProjectUser(){

                let userVal = event.target.value ;
                if(userVal.length > 0){
                    this.users = JSON.parse(userVal);
                }
            },
        }
    }
</script>

<style scoped>

.wpuf-integrations-wrap .wpuf-integration {
    padding: 0 10px;
    flex-basis: 25%;
    max-width: 25%;
    margin-bottom: 0;
    background-color: transparent;
    box-shadow: none;
    border: 0;
}

.wpuf-panel {
    border: 1px solid #E2E2E2;
    margin-bottom: 20px;
}

.wpuf-panel .wpuf-panel-body {
    position: relative;
    background: #fff;
    height: 163px;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px 4px 0 0;
}

.wpuf-panel .wpuf-panel-footer {
    border-radius: 0 0 4px 4px;
    background: #FBFBFB;
    border-top: 1px solid #E2E2E2;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.wpuf-panel .wpuf-panel-body img {
    max-height: 100%;
    max-width: 160px;
    filter: grayscale(100%);
    opacity: .5;
    transition: all 0.3s ease-in-out;
}

.wf-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease-in-out;
}

.wf-modal.wf-modal-open {
    opacity: 1;
    visibility: visible;
}

.wpuf-integrations-wrap .wf-modal .wf-modal-dialog {
    max-width: 600px;
}

.wf-modal.wf-modal-open .wf-modal-dialog {
    margin-top: 0px;
}

.wf-modal .wf-modal-dialog {
    position: relative;
    width: 95%;
    max-width: 820px;
    max-height: 100%;
    margin-top: -100px;
    transition: all 0.3s ease-in-out;
}

.wf-modal .wf-modal-content {
    background-color: #fff;
    border: 1px solid #F5F5F5;
    border-radius: 4px;
    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    background-clip: padding-box;
    outline: 0;
    max-height: 90vh;
    overflow-y: auto;
}

.wpuf-integrations-wrap .wf-modal-header {
    border-bottom: 1px solid #E2E2E2;
    background: #FBFBFB;
    padding: 10px 20px;
}
.wf-modal-header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 3px 3px 0 0;
    font-weight: 600;
    color: #000;
}

.wf-modal-body {
    position: relative;
    padding: 20px;
    background: #fff;
}

.wpuf-integrations-wrap .wf-modal-footer {
    border-top: 1px solid #E2E2E2;
    background: #FBFBFB;
    padding: 10px 20px;
}

.wf-modal-footer {
    padding: 20px;
    text-align: right;
}

.wpuf-int-form-row {
    display: flex;
    margin-bottom: 10px;
}
.wpuf-int-form-row .wpuf-int-field-label {
    margin-right: 10px;
    min-width: 120px;
    display: inline-flex;
}

.wpuf-int-form-row .wpuf-int-field {
    width: calc(100% - 120px);
    position: relative;
}

.wpuf-int-form-row .wpuf-int-field input:not([type='checkbox']), .wpuf-int-form-row .wpuf-int-field select, .wpuf-int-form-row .wpuf-int-field textarea {
    padding: 7px 12px;
    border-radius: 3px;
    max-width: 100%;
    width: 100%;
}
.wpuf-int-form-row .wpuf-int-field-label label {
    font-weight: 600;
    display: block;
    margin-top: 6px;
}


.wpuf-integrations-wrap .wf-modal-header .modal-header-left {
    display: flex;
    align-items: center;
}
.wpuf-integrations-wrap .wf-modal-header .modal-close {
    color: #777;
    width: 52px;
    height: 52px;
    border-radius: 0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    border-left: 1px solid #ddd;
    font-size: 18px;
    font-weight: 300;
    border-radius: 0 3px 0 0;
    border-bottom: 0;
}

.wf-modal span.modal-close {
    width: 24px;
    height: 24px;
    text-align: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #f2f2f2;
    position: absolute;
    top: -8px;
    right: -8px;
    z-index: 9999;
    cursor: pointer;
}

.pm-toggle-switch.big {
    width: 35px;
    height: 20px;
    margin-right: 10px;
}

.wpuf-panel.panel-checked .wpuf-panel-body img {
    filter: none;
    opacity: 1;
}

.wpuf-integration .wf-modal-header .wpuf-toggle-switch.checked ~ img {
    opacity: 1;
    filter: none;
}

.wpuf-integration .wf-modal-header img {
    opacity: .5;
    filter: grayscale(100%);
    transition: all 0.3s ease-in-out;
}

    .manage {
        font-weight: bold;
    }
    .git_bit {
        width: 100%;
    }
    .submit {
        text-align: right;
    }
    .git_bit_wrap {
        padding-right: 0px !important;
        padding-left: 0px !important;
        margin-top: 50px;
    }
    .git_bit_title {
        padding-left: 5px;
    }

    span.int_title {
        font-size: 22px;
        color: #000;
        font-weight: bold;
    }

    .wpuf-panel.panel-checked .wpuf-panel-body img {
        filter: none;
        opacity: 1;
    }
</style>
