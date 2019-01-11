<template>
    <div>
        <div class="ac-credentials">
            <h3 class="title"><i class="fa fa-adn"></i>Import From Asana</h3>
            <div class="flex-box">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                //   0/4464cb380fa65cf7d898eb7a70d442d2
                // authUrl:"https://app.asana.com/-/oauth_authorize?client_id=221567401716679&redirect_uri="+window.location.href+"&response_type=token&state=wppm",
                authUrl:"https://app.asana.com/api/1.0/users/me",
            }
        },

        methods:{
            authenticateAsana(){
                var self = this;
                jQuery.ajax({
                    url: self.authUrl,
                    async: false,
                    // beforeSend: function(xhr) {
                    //     xhr.setRequestHeader("Authorization", "Basic " + btoa("abc:123"));
                    // },
                    crossDomain: true,
                    type: 'GET',
                    headers: {
                        Authorization: "Bearer 0/4464cb380fa65cf7d898eb7a70d442d2"
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    error: function(){
                        alert("Cannot get data");
                    }
                });
            }
        },

        created(){
            this.authenticateAsana();
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
    }

</style>
