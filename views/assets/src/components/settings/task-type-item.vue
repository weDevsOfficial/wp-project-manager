<template>
	<fragment>
		<tr class="tr-wrap">
            <td>
                <div class="title">{{ taskType.title }}</div>

            </td>
            <td>{{ taskType.description }}</td>

            <td>
                <div class="action-wrap">
                    <span><a @click.prevent="isUpdateMode = isUpdateMode ? false : true" href="#">{{ __( 'Edit', 'wedevs-project-manager' ) }}</a></span>
                    <span class="pipe">|</span>
                    <span><a @click.prevent="selfRemove( taskType.id )" href="#">{{ __( 'Delete', 'wedevs-project-manager' ) }}</a></span>
                </div>
            </td>
        </tr>

        <tr class="tr-wrap" v-if="isUpdateMode">
            <td colspan="3">
                <div class="new-type-form">
                    <new-task-type-form 
                    	:taskType="taskType"
                    	@udpateFormClose="isUpdateMode=false"
                    />
                    	
                </div>
            </td>
        </tr>
	</fragment>
</template>

<script>
	import NewLabelForm from './new-task-type-form.vue'

	export default {
		props: {
			taskType: {
				type: [Object],
				default () {
					return {}
				}
			}
		},
		
		data () {
			return {
				isUpdateMode: false
			}
		},

		components: {
            'new-task-type-form': NewLabelForm
        },

        methods: {
            selfRemove (id) {
                if(!confirm(__('Are you sure?', 'wedevs-project-manager') )) {
                    return false;
                }
                
                var self = this;
                var request = {
                    type: 'POST',
                    url: self.base_url + 'pm/v2/settings/task-types/'+id+'/delete',
                    success (res) {
                        self.$store.commit( 'settings/deleteTaskType', id );
                    }
                };

                self.httpRequest(request);
            },

            remove (args) {

                
            },
        }
	}
</script>
