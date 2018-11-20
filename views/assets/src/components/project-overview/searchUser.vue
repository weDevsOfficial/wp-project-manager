<template>
<div>

    <div v-if="value" id="pm-add-user-wrap">
        <div class="nonsortable">

            <div class="popup-mask">
                <div class="popup-container">
                     <span class="close-modal">
                        <a  @click.prevent="closeModal()"><span class="dashicons dashicons-no"></span></a>
                    </span>
                    <div class="popup-body">
                        <h3>Add User</h3>
                        <input type="text" class="pm-users-search" @keyup="searchUser" v-model="searchChar">
                    </div>

                    <ul class="user_list">
                        <li v-for="user in users" :key="user.id">
                            <img alt="admin" :src="user.avatar_url" class="avatar avatar-34 photo" height="34" width="34">
                            <a  :href="myTaskRedirect(user.id)">
                                {{ user.display_name }}
                            </a>
                        </li>
                    </ul>

                    <div v-if="pm_abort" class="popup-body">
                        <div class="btn-box">
                            <a class="button button-primary">Add</a>
                            <a class="button button-cancel">Cancel</a>
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

        props: {
            value:{
                type: Boolean,
                default: false
            }
        },

        data() {
          return {
              searchChar : '',
              pm_abort: null,
              users:[],
          }
        },
        methods: {

            searchUser:function () {

                var $ = jQuery;

                if(this.searchChar.length > 2){
                    var args = {
                        conditions: {
                            query : this.searchChar
                        },
                        callback: function (res) {
                            this.users = res.data
                            console.log(this.users);
                        }
                    }

                    if ( this.pm_abort ) {
                        this.pm_abort.abort();
                    }
                    this.pm_abort = this.get_search_user(args);

                } else {
                    this.users = [];
                }
            },

            closeModal:function () {
                this.searchChar = '';
                this.users = [];
                this.$emit('input', false);
            }

        }
    }
</script>

<style lang="less">

    #pm-add-user-wrap{
        ul.user_list {
            margin: 0;
            padding: 0;
            border-top: 0.2px solid #ccc;

            li {
                margin: 0;
                padding: 8px;
                display: block;
                height: auto;
                clear: left;
                border-bottom: 0.2px solid #ccc;
                overflow: auto;
                &:hover {
                    background: rgba(0, 185, 235, 0.1);
                }
            }

            li img {
                border-radius: 50px;
                float: left;
                margin-right: 10px;
            }

            li a {
                font-weight: 600;
            }
        }

        .popup-mask {
            .popup-container {
                height: auto !important;
                width: auto !important;
                .popup-body {
                    height: auto !important;
                    input{
                        width: 100%;
                        }
                    }
            }
        }
    }

</style>
