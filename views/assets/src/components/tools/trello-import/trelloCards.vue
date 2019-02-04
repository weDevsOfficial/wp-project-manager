<template>
    <span></span>
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
        mixins:[mix],
        created(){
            this.getExisting(this.savedBefore);
        }
    }
</script>

<style scoped>

</style>
