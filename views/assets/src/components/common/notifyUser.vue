<template>
	<div class="notify-users">    
    	<h2 class="pm-box-title"> 
    		{{text.notify_user}}               
    		<label class="pm-small-title" for="select-all"> 
    			<input type="checkbox" v-model="select_all" id="select-all" @change="select_all_user()" class="pm-toggle-checkbox" > 
    			{{text.select_all}}
    		</label>
    	</h2>
        <ul class="pm-user-list">
        	
            <li v-for="user in assain_users">
            	<label for="pm_notify_1">
            		<input type="checkbox" ref="users" v-model="notify_users" id="pm_notify_1"   :value="user.id"> 
            		{{user.nicename}}
            	</label>
            </li>
            <div class="clearfix"></div>
        </ul>
    </div>
</template>

<script>
	
export default {
  props: ['value'],
	data () {
		return {
			notify_users: [],
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
    }
  },
  computed: {
    assain_users () {
      return this.$root.$store.state.project_users;
    }

  },
  methods: {
    select_all_user () {
      var self = this;
      console.log(this.select_all);
      if(this.select_all){
        this.notify_users=[];
        this.assain_users.forEach(function(user){
          self.notify_users.push(user.id);
        })
      }else{
        this.notify_users=[];
      }
    }
  }
}
</script>