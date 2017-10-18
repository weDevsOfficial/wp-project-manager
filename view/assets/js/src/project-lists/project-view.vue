<template>
    <ul class="pm-project-view ">
        <li><a href="javascript:void(0)" :title="text.List_View" class="change-view" @click.prevent="setcookie('list_view')">  <span class=" dashicons dashicons-menu" v-bind:class="{'active': activeClass('list_view') }" ></span></a></li>
        <li><a href="javascript:void(0)"  :title="text.Grid_View" class="change-view" @click.prevent="setcookie('grid_view')"> <span class=" dashicons dashicons-screenoptions" v-bind:class="{'active': activeClass('grid_view') }" ></span></a></li>
        <div class="clearfix"></div>
    </ul>
</template>

<script>
	export default{
		data(){
			return {
				projects_view: this.$store.state.projects_view,
			}
		},
		created(){
			this.getCookie("project_view");
		},
		methods: {
			setcookie(name="grid_view"){
				var d = new Date();
			    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
			    var expires = "expires="+d.toUTCString();

				document.cookie = "project_view="+name + ';' + expires;
				this.$store.commit('setProjectsView', name);
			},

			getCookie(key){
	            var cookies = document.cookie.split(';'),
	             cookieslen = cookies.length;
	             key=key + "=";

	             for(var i =0; i<cookieslen; i++){
	                var c = cookies[i];
	                while (c.charAt(0) == ' ') {
	                    c = c.substring(1);
	                }

	                if (c.indexOf(name) == 0) {
	                    this.$store.commit('setProjectsView', c.substring(key.length, c.length))
	                    return c.substring(key.length, c.length);
	                }
	             }

	             return "";
	        },
	        activeClass(view){
	        	return this.$store.state.projects_view === view;
	        }
		}
	}
</script>