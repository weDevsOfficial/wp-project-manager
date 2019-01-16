<template>
    <div>
        <div class="trello-credentials">
            <h3 class="title"><i class="fa fa-trello"></i> Import From Trello</h3>

            <div class="flex-box">

                <div v-if="api_key">
                    <button @click="auth()" class="button button-primary">{{ hasToken ? 'Remove Authorization' : 'Authorize Trello' }}</button>
                </div>
                <div v-if="!hasToken">
                    <input type="text" class="trello-api-Key" v-model="apikey" placeholder="trello api key">
                    <button :disabled="!apikey" class="button-primary" @click="saveApiKey()">Save</button>
                    <br><span v-if="!api_key"><i class="text-info">to avail your api key logged in to your trello account and follow this link
                    <a target="_blank" href="https://trello.com/app-key">API key</a></i></span>
                </div>

                <div v-if="hasToken">
                    <input type='checkbox' @click='checkAll()' v-model='selected'> Select All &nbsp;
                    <button type="button" class="button button-primary" :disabled="disableReqBtn" @click="sendToProcess()">Import Selected</button>
                </div>

            </div>

        </div>
        <trello-org ref="org" v-if="hasToken" :credentials="{ api_key:api_key, token:token }" @allSelected="allSelected()" ></trello-org>
    </div>
</template>

<script>
    import trelloOrg from './trelloOrganizations.vue'
    import mix from './mixin'
    export default {

        data(){

            return{
                api_key : '',
                apikey : '',
                api_url : 'https://api.trello.com/1/member/me/',
                api_url_all : 'https://api.trello.com/1/',
                token : '',
                show_spinner : false,
                selected:false,
                requestSent:false
            }


        },
        mixins:[mix],
        components:{
           'trello-org': trelloOrg
        },
        methods:{
            saveCred(apikey,token){
                var self = this;
                var data = {
                    'trello_credentials': { api_key: apikey, token: token},
                }

                this.saveSettings(data, '', function (res) {
                    self.show_spinner = false;
                    self.token = res[0].value.token;
                    // console.log(self.token)
                });


            },

            saveApiKey(){
                var self = this;
                var data = {
                    'trello_credentials': { api_key: self.apikey, token: ''},
                }
                if(!this.apikey){
                    toastr.error('Please Insert Your Trello Api Key...');
                } else {

                    this.saveSettings(data, '', function (res) {
                        self.show_spinner = false;
                        self.api_key = res[0].value.api_key;
                    });
                }
            },

            popup: function() {

                var self = this;

                if (Trello !== undefined) {

                    Trello.authorize({

                        'expiration': 'never',
                        'interactive': true,
                        'name': 'wp Project Manager',
                        'persist': false,
                        'scope': {
                            'read': 'allowRead',
                            // 'write': 'allowWrite',
                            'account': 'allowAccount'
                        },
                        'type': 'popup',
                        'error': function error() {
                            toastr.error('Opps! something happened wrong.');
                        },

                        'success': function success() {
                            self.saveCred(self.api_key,Trello.token())
                        }
                    });
                } else {
                    toastr.error('Trello is not defined.');
                }
            },

            authorize: function() {

                var self = this;

                toastr.options.timeOut = 600;
                toastr.info('Authorizing..');

                // load trello script if not defined
                if (typeof Trello == 'undefined') {

                    self.loadScript('https://trello.com/1/client.js?key=' + self.api_key, function () {

                        // script loaded, now open popup
                        self.popup();
                    });
                } else {
                    self.popup();
                }
            },

            auth: function auth() {
                // token exists, going to remove
                if (this.hasToken) {
                    this.saveCred(self.api_key,'')
                    toastr.info('Authorization Removed');
                } else {
                    // auth
                    this.authorize();
                }
            },

            checkAll: function(){
                this.selected = !this.selected;
                this.$refs.org.selectAll(this.selected);
            },

            sendToProcess: function(){
                var self = this;

                var args = {
                    data: {
                        boards:self.selectedBoards
                    },
                    user_id: this.current_user.ID,
                    callback: false,
                };
                var request = {
                    type: 'POST',
                    data: args.data,
                    url: self.base_url+"/pm/v2/tools/trello-import",
                    success (res) {
                        self.requestSent = true;
                        console.log(res);
                        toastr.info(res.msg);
                    }
                };

                self.httpRequest(request);

            },

            allSelected(){
                this.selected = this.$refs.org.isAllSelected
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

            selectedBoards() {
                return  this.$store.state.trello.selectedBoards;
            },
            disableReqBtn(){
                if(this.requestSent || this.selectedBoards.length === 0){
                    return true;
                } else {
                    return false;
                }
            }

        },
        created:function(){
            // initializing on created
            this.api_key = this.getSettings('api_key', '', 'trello_credentials');
            this.apikey =this.getSettings('api_key', '', 'trello_credentials');// 48bd6e943d3f5037d385e6c274d873bf
            this.token = this.getSettings('token', '', 'trello_credentials');
        }

    }
</script>

<style lang="less">

    .trello-credentials{
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

        .trello-api-Key{
            width: 80%;
        }
    }

</style>
