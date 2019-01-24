<template>
    <div>
        <div class="ac-credentials">
            <h3 class="title"><i class="fa fa-adn"></i> Import From Active Collab</h3>
            <div class="flex-box">
                <div id="ac-auth">
                    <div v-if="!account">
                        <div>
                            <label for="acEmail">Username/Email</label>
                            <input type="email" id="acEmail" required v-model="ac_username" placeholder="email">
                        </div>
                        <div>
                            <label for="acPass">Password</label>
                            <input type="password" id="acPass" required v-model="ac_password" placeholder="password">
                        </div>
                        <button type="button" class="button button-primary" @click="auth()">Authenticate Active Collab</button>
                    </div>
                    <div v-else>
                        <h5>selected account : #{{ account }}</h5>
                        <button type="button" class="button button-primary" >Remove Authorization</button>
                    </div>
                </div>
                <div id="ac-account">
                    <div v-if="!account">
                        <h5>select an account</h5>
                        <ul>
                            <li v-for="(account, index) in accounts" class="button" @click="tokenize(index)">#{{ index }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="acl-projects">

        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                show_spinner:false,
                ac_username : "kutsnalmas@gmail.com",
                ac_password : "wedevstest",
                accounts :{},
                account : '',
                account_url : '',
                account_token : '',
                projects : []
            }
        },

        methods:{
            auth(){
                var self = this;

                var args = {
                    data: {
                        user: self.ac_username, //"farazi@wedevs.com",
                        pass: self.ac_password //"!!@@1122FFff",
                    },
                    callback: false,
                };
                var request = {
                    type: 'POST',
                    data: args.data,
                    url: self.base_url+"/pm/v2/tools/active-collab-auth", //tools/activeCollab-auth
                    success (res) {
                        if ('error' in res){
                            toastr.error(res.error);
                        } else {
                            self.accounts = res
                        }
                    }
                };

                if(self.ac_username && self.ac_password){
                    self.httpRequest(request);
                }

            },

            tokenize(account){
                this.account = account;
                var self = this;
                var args = {
                    data: {
                        user: self.ac_username, //"farazi@wedevs.com",
                        pass: self.ac_password, //"!!@@1122FFff",
                        accid:account
                    },
                    callback: false,
                };
                var request = {
                    type: 'POST',
                    data: args.data,
                    url: self.base_url+"/pm/v2/tools/active-collab-tokenize", //tools/activeCollab-auth
                    success (res) {
                        if ('error' in res){
                            toastr.error(res.error);
                        } else {
                            self.saveCredentials(res.url, res.token, account)
                        }
                    }
                };

                if(self.ac_username && self.ac_password){
                    self.httpRequest(request);
                }
            },

            saveCredentials(url, token, accID){
                var self = this;
                var data = {
                    'activecol_credentials': { url: url, token: token, accID:accID},
                }

                this.saveSettings(data, '', function (res) {
                    self.show_spinner = false;
                    self.account_url = res[0].value.url;
                    self.account_token = res[0].value.token;
                    self.account = res[0].value.accID;
                    console.log(res[0].value)
                });

            },

            getItems(bag){
                var self = this;
                var request = {
                    type: 'GET',
                    url: self.base_url+"/pm/v2/tools/active-collab-projects",
                    success (res) {
                        if(res.length > 0){
                            res.forEach(function(val){
                                bag.push(val)
                            })
                        }
                        console.log(res);
                        pm.NProgress.done();
                    }
                };
                self.httpRequest(request);

            },

        },

        created(){
            this.account = this.getSettings('accID', '', 'activecol_credentials');
            this.account_url = this.getSettings('url', '', 'activecol_credentials');
            this.account_token = this.getSettings('token', '', 'activecol_credentials');

            if(this.account){
                this.getItems(this.projects);
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

        .ac-api-Key{
            width: 80%;
        }

        #ac-auth{
            h5{
                margin-top: 1px;
            }
        }
    }

</style>
