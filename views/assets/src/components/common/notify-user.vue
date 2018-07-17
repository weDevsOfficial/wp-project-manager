<template>
    <div class="notify-users" v-if="assain_users.length">    
        <h2 class="pm-box-title"> 
            {{ __( 'Notify users', 'wedevs-project-manager') }}               
            <label class="pm-small-title" for="select-all"> 
                <input type="checkbox" v-model="select_all" id="select-all" @change="select_all_user()" class="pm-toggle-checkbox" > 
                {{ __( 'Select all', 'wedevs-project-manager') }}
            </label>
        </h2>
        <ul class="pm-user-list">
            
            <li v-for="user in assain_users" :key="user.id">
                <label>
                    <input type="checkbox" ref="users" v-model="notify_users"   :value="user.id"> 
                    {{user.display_name}}
                </label>
            </li>
            <div class="clearfix"></div>
        </ul>
    </div>
</template>

<style>
    .pm-small-title input[type="checkbox"] {
        margin: -3px 0 0 !important;
    }
    .pm-user-list input[type="checkbox"] {
        margin: -1px 0 0 !important;
    }
</style>
    
<script>
    
export default {
    props: {
        value: {
            type: [Array],
            default () {
                return [];
            }
        },
        users: {
            type: [Array],
            default () {
                return this.$root.$store.state.project_users;
            }
        }
    },
    data () {
        return {
            notify_users: this.value,
            select_all: false,
        }
    },
    watch: {
        notify_users (value) {
            if(this.assain_users.length == value.length ){
                this.select_all = true;
            }
            if(this.assain_users.length !== value.length ){
                this.select_all = false;
            }
            this.$emit('input', value);
        },
        value (v) {
            this.notify_users = v;
        }
    },
    computed: {
        assain_users () {
            return this.users.filter( user => user.id !== this.current_user.ID );
        }
    },
    methods: {
        select_all_user () {
            var self = this;
            if(this.select_all){
                this.notify_users = [];
                this.assain_users.forEach(function(user){
                self.notify_users.push(user.id);
            })
            }else{
                this.notify_users = [];
            }
        }
    }
}
</script>