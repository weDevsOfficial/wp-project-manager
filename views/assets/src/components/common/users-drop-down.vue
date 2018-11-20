<template>
	<div  class="pm-multiselect pm-multiselect-single-task">
        <div class="pm-multiselect-content">
            <div class="assign-to">{{ __('Assign to', 'wedevs-project-manager') }}</div>
            <multiselect
                v-model="selected"
                :options="users"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="true"
                :show-labels="true"
                :searchable="true"
                :placeholder="__('Search User', 'wedevs-project-manager')"
                select-label=""
                selected-label="selected"
                deselect-label=""
                label="display_name"
                track-by="id"
                :allow-empty="true">

                <template slot="option" slot-scope="props">
                    <img class="option__image" :src="props.option.avatar_url" alt="No Man’s Sky">
                    <div class="option__desc">
                        <span class="option__title">{{ props.option.display_name }}</span>
                    </div>
                </template>

            </multiselect>

        </div>
    </div>
</template>

<script type="text/javascript">
	import Multiselect from 'vue-multiselect';

	export default {
		props: {
			users: {
				type: [Array],
				default () {
					return []
				}
			},

			selected: {
				type: [Array],
				default () {
					return []
				}
			}
		},

		components: {
			'multiselect': Multiselect
		},

		watch: {
			selected () {
				
			}
			
		}
	}
</script>
