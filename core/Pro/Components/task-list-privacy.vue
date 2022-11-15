<template>
    <div class="item pm-make-privacy" v-if="user_can('view_private_list')">
        <label>
            <input value="yes" v-model="privacy" type="checkbox">
            {{ __('Private','pm-pro') }}           
        </label>
    </div>
</template>

<script>
    export default {
        name: 'ListPrivacy',
        props: {
            actionData: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data () {
            return {
                privacy: typeof this.actionData.meta !== 'undefined' ? this.actionData.meta.privacy == '1' : false ,
            }
        },
        created () {
            if (this.user_can('view_private_list')){
                pm_add_filter( 'before_task_list_save', [this, 'append_privacy'], 1 );
            }
        },
        destroyed () {
            pm_remove_filter( 'before_task_list_save', [this, 'append_privacy']);
        },
        methods: {
            append_privacy ( value ) {
                value.privacy = this.privacy;
                return value;
            }
        }
    }
</script>