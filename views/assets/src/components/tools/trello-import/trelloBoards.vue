<template>
    <div class="boards-flex">
        <div v-for="(board, index) in boards" class="board-box-column" @click="selectBoard(board.id,index)">
            <span v-if="!checkImportStatus(savedBefore, board.id) && !board.clicked" class="fa fa-2x fa-square-o btn"></span>
            <span v-if="!checkImportStatus(savedBefore, board.id) && board.clicked" class="fa fa-2x fa-check btn"></span>
            <span v-if="checkImportStatus(savedBefore, board.id)" class="fa fa-2x fa-square btn"></span>
            <span v-if="checkImportStatus(inProgress, board.id)" class="fa fa-2x fa-lock btn"></span>
            <div class="board-content">
                <span class="board-title">{{ cutString(board.name, 21, true) }}</span>
                <board-lists :board-id="board.id" :credentials="{ api_key:api_key, token:token }" ></board-lists>
            </div>
        </div>
    </div>
</template>

<script>
    import mix from './mixin.js'
    import lists from './trelloLists.vue'
    export default {
        props:{
            boards:{
                type:Array
            },
            credentials: {
                type:Object
            }
        },
        mixins:[mix],
        data(){
            return{
                // boards:[],
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                savedBefore:[],
                inProgress:[],
                requestSent:false
            }
        },
        components:{
            'board-lists':lists
        },
        methods:{

            selectBoard(boardId,index){
                if(!this.checkImportStatus(this.savedBefore, boardId) && !this.checkImportStatus(this.inProgress, boardId)) {
                    this.boards[index].clicked = !this.boards[index].clicked;
                    if (this.boards[index].clicked) {
                        this.$store.commit('trello/setBoards', boardId);
                    } else {
                        this.$store.commit('trello/unsetBoards', boardId);
                    }
                } else {
                    console.log("this board already imported")
                }
            }

        },

        created(){
            this.getImportStatus(this.inProgress, 'trello-in-process');
            this.getImportStatus(this.savedBefore, 'trello-imported');
        }
    }
</script>

<style lang="less">

</style>
