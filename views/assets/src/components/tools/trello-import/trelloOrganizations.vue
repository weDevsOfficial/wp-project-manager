<template>
    <div class="orgs">
        <ul class="org">
            <li class="list-item" v-for="(org, index) in orgs">
                <h4 class="org-name">{{ org.name }}</h4>
                    <boards :boards="org.boards" :credentials="{ api_key:api_key, token:token }"></boards>
            </li>
        </ul>
    </div>
</template>

<script>
    import mix from './mixin';
    import orgBoard from './trelloBoards.vue'
    export default {
        props: {
            credentials: {
                type:Object
            }
        },
        data(){
            return{
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                orgs:[],
                imported:[],
                inProgress:[]
            }
        },
        mixins:[mix],
        components:{
            'boards':orgBoard
        },
        methods:{
            selectAll(status){
                var self = this;
                self.$store.commit('trello/emptyBoards')
                this.orgs.forEach(function(val){
                    val.boards.forEach(function(board){
                        if(!self.checkImportStatus(self.imported, board.id) && !self.checkImportStatus(self.inProgress, board.id)){
                            board.clicked = status;//!board.clicked;
                            if(board.clicked){
                                self.$store.commit('trello/setBoards', board.id);
                            } else {
                                self.$store.commit('trello/unsetBoards', board.id);
                            }
                        }
                    })
                })
            }
        },
        computed:{
            selectable(){
                var totalBoards = parseInt(0)
                var totalImported = parseInt(this.imported.length);
                this.orgs.forEach(function(val){
                        val.boards.forEach(function(board){
                           totalBoards ++
                        })
                })
                return totalBoards - totalImported;
            },
            selectedBoards(){
                return this.$store.state.trello.selectedBoards.length;
            },
            isAllSelected(){
                if(parseInt(this.selectedBoards) === parseInt(this.selectable)){
                    return true
                } else {
                    return false
                }
            }
        },
        watch: {
            selectedBoards: function (val) {
                this.$emit('allSelected')
            }
        },
        created(){
            this.trelloGet('organizations', this.orgs);
            this.getImportStatus(this.imported, 'trello-imported');
            this.getImportStatus(this.inProgress, 'trello-in-process')
        }

    }
</script>

<style lang="less">

    .orgs{
        ul.org{

            li.list-item{
                background: #fff;
                border: 0.1px solid #ccc;
                padding: 0.5rem;
                margin-bottom: 0.4rem;
                .org-name {
                    margin: 0 0 5px 0;
                }

                .boards-flex {
                    display: flex;
                    flex-wrap: wrap;
                    margin: 0 -5px;
                    height: 100%;
                    .board-box-column {
                        flex-basis: 25%;
                        max-width: 25%;
                        padding: 5px;
                        position: relative;
                        .board-content {
                            padding: 10px;
                            border: 1px solid #ccc;
                            min-height: 100px;
                            border-radius: 2.5px;
                            span.board-title{
                                font-size: 16px;
                            }
                        }

                        span.btn{
                            position:absolute;
                            right:3%;
                            top:6%;
                            cursor: pointer;
                            -webkit-text-stroke: 1px white;
                        }
                    }

                }
            }


        }
    }

</style>
