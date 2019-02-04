<template>
    <div class="board-lists">{{ listQuantity() }}</div>
</template>

<script>
    import mix from './mixin.js'
    export default {
        props:{
            boardId:{
                type:String
            },
            credentials: {
                type:Object
            }
        },
        data(){
            return{
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                boardLists:[]
            }
        },
        methods:{
            listQuantity(){
                if(this.boardLists.length > 1){
                    return this.boardLists.length+' lists'
                } else {
                    return this.boardLists.length+' list'
                }
            }
        },
        mixins:[mix],
        created(){
            this.trelloGet_of_byid('boards','lists',this.boardId,'&fields=id,name',this.boardLists);
        }
    }
</script>

<style lang="less">

    .board-lists{

    }

</style>
