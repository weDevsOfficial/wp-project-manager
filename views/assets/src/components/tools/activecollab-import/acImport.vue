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
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                ac_username : "",
                ac_password : ""
            }
        },

        methods:{
            auth: function(){
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
                    url: self.base_url+"/pm/v2/tools/activeCollab-auth", //tools/activeCollab-auth
                    success (res) {
                        console.log(res);
                        // toastr.info(res);
                    }
                };

                if(self.ac_username && self.ac_password){
                    self.httpRequest(request);
                }

            },

            anotherTest(){
                jQuery.ajax({
                    url: "https://app.activecollab.com/189169/activecollab/api.php",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + btoa("abc:123"));
                    },
                    type: 'POST',
                    dataType: 'jsonp',
                    contentType: 'application/json',
                    processData: false,
                    data: {
                        api_subscription:{
                            email: "farazi@wedevs.com",
                            password: "!!@@1122FFff",
                            client_name: "SubscriptionTest",
                            client_vendor: "A51"
                        }
                    },
                    success: function (data) {
                        alert(JSON.stringify(data));
                        console.log(data);
                    },
                    error: function(){
                        alert("Cannot get data");
                    }
                });
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
