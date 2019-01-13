<template>
    <div>
        <div class="ac-credentials">
            <h3 class="title"><i class="fa fa-adn"></i>Import From Asana </h3>
            <div class="flex-box">

                <div>

                    <div v-if="!hasToken" class="access-token-form">
                        <input type="text" class="asana-pa-token" v-model="personalAccesstoken" placeholder="Asana Personal access token">
                        <button :disabled="!personalAccesstoken" class="button-primary" @click="checkToken()">Save</button>
                        <div class="spiner" v-if="show_spinner"><span class="pm-spinner"></span> &nbsp;&nbsp; <span class="wait"> wait ... </span></div>
                        <br><span v-if="!personalAccesstoken"><i class="text-info">dont have asana personal access token?
                        <a target="_blank" href="https://api2task.com/faqs/how-can-i-find-my-asana-access-api-parameters/">Avail Your Personal Token</a></i></span>
                    </div>

                    <div v-if="hasToken" class="asana-profile">
                        <table >
                            <tbody>
                            <tr>
                                <td>
                                    <img class="asana-profile-image" :src="profileData.photo.image_128x128" alt="">
                                </td>
                                <td>
                                    <span class="profile-name">Name : {{ profileData.name }}</span>
                                    <span class="profile-email">Email : {{ profileData.email }}</span>
                                    <span class="profile-workspace">Workspaces : {{ profileData.workspaces.length }}</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                <div v-if="hasToken">
                    <input type='checkbox' @click='checkAll()' v-model='selected'> Select All &nbsp;
                    <button type="button" class="button button-primary" :disabled="disableReqBtn" @click="sendToProcess()">Import Selected</button>
                </div>

            </div>
        </div>


        <asana-workspaces v-if="token" :credentials="token" :workspaces="profileData.workspaces"></asana-workspaces>

    </div>
</template>

<script>
    import mix from './mixin.js'
    import asanaWorkspaces from './asanaWorkspaces.vue'
    export default {
        data(){
            return {
                //   0/4464cb380fa65cf7d898eb7a70d442d2
                authUrl:"https://app.asana.com/api/1.0/users/me",
                personalAccesstoken : "",
                token : "",
                cbData : {},
                error_msg: "",
                show_spinner:false,
                selected:false,
                requestSent:false
            }
        },
        mixins:[mix],
        components:{
            'asana-workspaces': asanaWorkspaces
        },
        methods:{

            checkToken(){
                var self = this;
                if(!this.personalAccesstoken){
                    toastr.error('Please Insert Your Asana Token...');
                } else {
                    self.show_spinner = true;
                    self.getAsana(self.personalAccesstoken, self.authUrl, self.saveToken, self.errorCB);
                }
            },

            saveToken(data){
                this.cbData = data
                var self = this;
                var cred = {
                    'asana_credentials': { token: window.btoa(self.personalAccesstoken) },
                }
                this.saveSettings(cred, '', function (res) {
                    self.show_spinner = false;
                    self.token = res[0].value.token;
                });

                pm.NProgress.done();

            },

            errorCB(res) {
                this.show_spinner = false;
                this.error_msg = res.responseJSON.errors[0].message;
                toastr.error(this.error_msg);
                pm.NProgress.done();
            },

            profile(data){
               this.cbData = data;
            }
        },

        computed:{
            hasToken:function(){
                if(this.token !== ''){
                    return true;
                }else {
                    return false
                }
            },

            profileData(){
                return this.cbData.data
            }
        },

        created(){
            // this.authenticateAsana();
            var enc_token = this.getSettings('token', '', 'asana_credentials')
            this.token = this.personalAccesstoken = window.atob(enc_token);

            if(this.token){
                this.getAsana(this.token,this.authUrl,this.profile, this.errorCB)
            }
        }
    }
</script>

<style lang="less">

    .ac-credentials{
        /*width: 80%;*/
        background: #fff;
        border: 0.5px solid #ccc;
        padding: 1rem;
        margin-bottom: 0.5rem;

        input.input {
            width: 100%;
        }

        span.info {
            font-size: 11px;
        }

        h3.title{
            margin-top:1px;
        }

        .flex-box {
            display: flex;
            flex-wrap: nowrap;
        }

        .flex-box > div {
            width: 50%;
            margin: 10px;
        }

        .asana-pa-token{
            width: 80%;
        }
        .asana-profile{
            span {
                clear: both;
                display: block;
                margin: 0 10px;
            }
            img.asana-profile-image{
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: 2px solid #c4c4c4;
                margin: 10px;
            }
        }

    }

</style>
