<template>
    <div>
        <div class="ac-credentials">
            <h3 class="title"><i class="fa fa-adn"></i> Import From Active Collab</h3>
            <div class="flex-box">
                <div>
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
                <div v-if="accounts">
                    <h5>select account</h5>
                    <ul>
                        <li v-for="(account, index) in accounts" class="button" @click="tokenize(index)">#{{ index }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                ac_username : "kutsnalmas@gmail.com",
                ac_password : "wedevstest",
                accounts:{}
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
                        self.accounts = res
                        console.log(self.accounts);
                        // toastr.info(res);
                    }
                };

                if(self.ac_username && self.ac_password){
                    self.httpRequest(request);
                }

            },

            tokenize(account){
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
                        console.log(res)
                        // toastr.info(res);
                    }
                };

                if(self.ac_username && self.ac_password){
                    self.httpRequest(request);
                }
            }

        },



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
    }

</style>
