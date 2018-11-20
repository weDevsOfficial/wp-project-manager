<template>

    <ul class="pm-view-style-group pm-list-inline">
        <li>
            <a v-bind:class="{'active': activeClass('grid_view') }" href="javascript:void(0)" :title="grid_view" @click.prevent="setcookie('grid_view')"> 
                <i class="pm-icon flaticon-menu-1"></i>
                <span>Grid View</span>
            </a>
        </li>
        <li>
            <a v-bind:class="{'active': activeClass('list_view') }" href="javascript:void(0)" :title="list_view" @click.prevent="setcookie('list_view')">  
                <i class="pm-icon flaticon-list" ></i>   
                <span>List View</span>
            </a>
        </li>
    </ul>
</template>

<script>
    import Mixins from './mixin';
    
    export default{
        data(){
            return {
                list_view: __( 'List View', 'wedevs-project-manager'),
                grid_view: __( 'Grid View', 'wedevs-project-manager'),
                //projects_view: this.$store.state.projects_view,
            }
        },

        mixins: [Mixins],

        created(){
            this.getCookie("project_view");
            
        },
        methods: {
            ...pm.Vuex.mapMutations( 'projectLists',
                [
                    'setProjectsView'
                ]
            ),
            setcookie(name="grid_view"){
                var d = new Date();
                d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
                var expires = "expires="+d.toUTCString();

                document.cookie = "project_view="+name + ';' + expires;
                this.setProjectsView(name);
                //this.$store.commit('projectLists/setProjectsView', name);
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

                    if (c.indexOf(key) == 0) {
                        this.setProjectsView( c.substring(key.length, c.length) );
                        //this.$store.commit('projectLists/setProjectsView', c.substring(key.length, c.length))
                        return c.substring(key.length, c.length);
                    }
                 }

                 return "";
            },
            activeClass(view){
                if ( view == this.projects_view ) {
                    return view;
                }
                
                //return this.$store.state.projects_view === view;
            }
        }
    }
</script>