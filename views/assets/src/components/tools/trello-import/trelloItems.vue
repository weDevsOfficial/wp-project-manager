<template>

    <div class="item-list">
        <hr>

        <div v-if="result.length" class="action-bar">
            <input type='checkbox' @click='checkAll()' v-model='selected'> Select All &nbsp;
            <button type="button" class="button button-primary" :disabled="isSelected" @click="sendToProcess()">Import Selected</button>
        </div>

        <ul>
            <li class="list-item" v-for="board in result" :key="board.id">
                <div class="overview">
                    <!--<i v-if="disableImported(board.id)" class="fa fa-check"></i>-->
                    <input type="checkbox" v-bind:value='board.id' v-model="selected_result" @change="updateCheckall()" :disabled="disableImported(board.id)"> &nbsp;&nbsp;&nbsp;&nbsp;
                    <label>
                        {{ board.name }}
                        <b>
                            <a v-if="board.lists.length !== 0" @click="toggle(board)">({{ board.lists.length }} lists)</a>
                            <a v-if="board.lists.length === 0" >({{ board.lists.length }} list)</a>
                        </b>
                    </label> &nbsp;&nbsp;&nbsp;
                     <!--Members : <trello-avatar-->
                                <!--v-for="member in board.members"-->
                                <!--:key="member.idMember"-->
                                <!--:members="member"-->
                                <!--:credentials="{ api_key:api_key, token:token }"-->
                                <!--&gt;-->

                              <!--</trello-avatar>-->
                </div>
                <div v-if="board.clicked" class="flex-box">
                    <div>
                        <ul class="list">
                            <li v-for="list in board.lists">
                                <h5>{{ list.name }} ({{ list.cards.length }} tasks) </h5>
                            </li>
                        </ul>
                    </div>
                    <div>


                    </div>
                </div>
            </li>
        </ul>

        <div v-if="result.length" class="action-bar">
            <input type='checkbox' @click='checkAll()' v-model='selected'> Select All &nbsp;
            <button type="button" class="button button-primary" :disabled="isSelected" @click="sendToProcess()">Import Selected</button>
        </div>

        <!--{{ selected_result }}-->
    </div>


</template>

<script>
    import mix from './mixin'
    import travater from './trelloAvatar.vue'
    export default {

        props: {
            credentials: {
                type:Object
            }
        },

        mixins:[mix],

        data(){
            return{
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                savedBefore:[],
                requestSent:false,
                result:[],
            }
        },

        components:{
            'trello-avatar': travater,
        },

        methods:{
            // @param (String, Integer, Boolean)
            cutString(string, length, dot){
                var output = "";
                output = string.substring(0, parseInt(length));
                if(dot && string.length > length){
                    output += "...";
                }
                return output;
            },

            toggle: function (data) {
                if(data.hasOwnProperty('clicked')){
                    data.clicked = !data.clicked;
                }else{
                    //since its the first time , set the value pf clicked to true to show the subitem
                    data = Object.assign({}, data, {clicked: true});
                }
            },

            checkAll: function(){

                this.selected = !this.selected;

                this.selected_result = [];
                if(this.selected){ // Check all
                    for (var key in this.result) {
                        if(!this.savedBefore.includes(this.result[key].id)) {
                            this.selected_result.push(this.result[key].id);
                        }
                    }
                }
                // console.log(this.selected);
            },

            updateCheckall: function(){
                if(this.result.length == this.selected_result.length){
                    this.selected = true;
                }else{
                    this.selected = false;
                }
            },

            sendToProcess: function(){
                var self = this;

                var args = {
                    data: {
                        boards:self.selected_result
                    },
                    user_id: this.current_user.ID,
                    callback: false,
                };
                var request = {
                    type: 'POST',
                    data: args.data,
                    url: self.base_url+"/pm-pro/v2/tools/trello-import",
                    success (res) {
                        self.requestSent = true;
                        console.log(res);
                        toastr.info(res.msg);
                    }
                };

                self.httpRequest(request);

            },
            getExisting:function(){
                var self = this;
                var request = {
                    type: 'GET',
                    url: self.base_url+"/pm-pro/v2/tools/trello-imported",
                    success (res) {
                        self.savedBefore = res;
                    }
                };

                self.httpRequest(request);
            },
            disableImported:function(value){
                return this.savedBefore.includes(value);
            }
        },

        computed:{
            isSelected:function(){
                if(this.selected_result.length === 0 || this.requestSent){
                    return true;
                } else {
                    return false;
                }
            }
        },


        created(){
            this.getExisting();
            this.trelloGet('boards', this.result)
        }

    }
</script>

<style lang="less">

    .item-list{

        ul li.list-item{
            background: #fff;
            border: 0.1px solid #ccc;
            padding: 0.5rem;
            margin-bottom: 0.4rem;
        }

        .overview{
            display: flex;
            align-items: center;
        }

        h4{
            margin: 0.2rem auto;
        }

        h5{
            margin: 0.2rem auto;
        }

        .flex-box {
            display: flex;
            flex-wrap: nowrap;
        }

        .flex-box > div {
            width: 50%;
            margin: 10px;
        }

        .action-bar{
            background: #fff;
            border: 0.1px solid #ccc;
            padding: 0.5rem;
            margin-bottom: 0.4rem;
        }

    }

</style>
