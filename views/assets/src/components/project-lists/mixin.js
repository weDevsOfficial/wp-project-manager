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
    },
	methods: {

		projects_view_class (){
            return 'grid_view' === this.projects_view ? 'pm-project-grid': 'pm-project-list'
        },
	}
}