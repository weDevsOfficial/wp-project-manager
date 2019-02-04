<template>
    <div>
        <span v-show="spinner" class="pm-spinner"></span>
        <img v-if="!spinner" @click="test(members.idMember)" class="travatar" :src="avater" :alt="members.fullName">
    </div>
</template>

<script>
    import mix from './mixin'
    export default {

        props: {
            members: {
                type:Object
            },
            credentials: {
                type:Object
            }
        },
        data(){
            return{
                avater: '',
                api_key: this.credentials.api_key,
                token: this.credentials.token,
                spinner: false,
            }
        },
        mixins:[mix],
        methods:{
            getAvatar(id){
                var self = this;
                self.spinner = true;
                jQuery.get(self.api_url_all+'members/'+id+'?fields=avatarHash,gravatarHash,fullName&key='+self.api_key+'&token='+self.token, function(response){
                    if(response.avatarHash !== null){
                        self.avater = 'https://trello-avatars.s3.amazonaws.com/'+response.avatarHash+'/50.png';
                    } else {
                        self.avater = 'https://via.placeholder.com/50x50.png?text=no+img';
                    }

                    self.spinner = false;
                })
            },
            test(f){
                this.$store.commit('setSelectedBoards', f)
                console.log(this.boardsD)
            }
        },
        computed:{
            boardsD() {
                return  this.$store.state.selectedBoards;
            }
        },
        created(){
            this.getAvatar(this.members.idMember)
        }

    }
</script>

<style lang="less">

    .travatar{
        border-radius: 50%;
        border:0.5px solid #ccc;
        margin: 0.2rem;
        width:28px;
        height:28px;
    }

</style>
