export default {
	data () {
		return {

		}
	},
	computed: {
        ...pm.Vuex.mapState('projectLists',
            {
                projects_view: state => state.projects_view,
            }
        ),

        isFetchProjects () {
        	return this.$store.state.projectLists.isFetchProjects;
        }
    },
	methods: {

		projects_view_class (){
            return 'grid_view' === this.projects_view ? 'pm-project-grid': 'pm-project-list'
        },

        projectFetchStatus (status) {
        	this.$store.commit( 'projectLists/projectFetchComplete', status );
        }
	}
}