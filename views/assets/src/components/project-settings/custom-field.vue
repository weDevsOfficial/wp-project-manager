<template>
    <div v-if="tabContent()" class="group" style="">
        <div>
            <div>
                <a href="#" class="pm-button pm-primary" @click.prevent="toggleForm()">{{ __( 'Add New', 'pm-pro' ) }}</a>
                <div>
                    <field-lists />
                </div>
            </div>
        </div>
        <div v-if="isActiveForm">
            <pm-popup-modal
                :options="modal"
                @submit="submit"
                @close="toggleForm"
            >
                <custom-field-form
                    :modal="modal"
                    :fields="fields"
                />

            </pm-popup-modal>
        </div>
    </div>
</template>

<style lang="less">
    .field-wrap {
        display: flex;
    }
    .flaticon-custom-field-icon {
        color: #f39b13;
    }
</style>

<script>

import CustomFieldForm from './custom-field-form.vue'
import fieldLists from './field-lists.vue'

export default {

    props: {
        actionData: {
            type: [Object]
        }
    },

    data () {
        return {
            fields: {
                title: '',
                type: 'dropdown',
                description: '',
                options: []
            },
            modal: {
                title: __( 'Custom Fields', 'pm-pro' ),
                manageLoading: true,
                submitButtonDisabled: false
            },
            isActiveForm: false,
            fieldLoading: true
        }
    },

    created () {
        //set setting custom field tab menu
        this.actionData.tabs.push({
            id: 'custom_field',
            label: __('Custom Field', 'pm-pro'),
            icon: 'flaticon-custom-field-icon',
            active: false
        });
    },

    components: {
        'custom-field-form': CustomFieldForm,
        'field-lists': fieldLists
    },

    computed: {
        fieldItems () {
            return this.$store.state.customFields.fields;
        }
    },

    methods: {
        toggleForm () {
            this.isActiveForm = this.isActiveForm ? false : true;
            this.fields = {
                title: '',
                type: 'dropdown',
                description: '',
                options: []
            }
        },
        submit (options) {

            if(!this.validCustomField()) {
                return false;
            }

            if(this.fields.id) {
                this.update();
            } else {
                this.insert();
            }
        },
        validCustomField () {
            if(this.modal.loading) {
                return false;
            }

            if(this.fields.title == '') {
                pm.Toastr.warning(__('Field title required!', 'pm-pro'));
                return false;
            }

            if(this.fields.type == '') {
                pm.Toastr.warning(__( 'Field type required!', 'pm-pro'));
                return false;
            }

            if(this.fields.type == 'dropdown' && !this.fields.options.length) {
                pm.Toastr.warning(__( 'Field options required!', 'pm-pro'));
                return false;
            }

            return true;
        },
        insert () {
            var self = this;

            this.modal.loading = true;

            var request_data = {
                url: self.base_url + 'pm-pro/v2/projects/'+self.project_id+'/custom-fields',
                type: 'POST',
                data: self.fields,
                success (res) {
                    self.$store.commit('customFields/setField', res.data);
                    self.modal.loading = false;
                    self.fields = {
                        title: '',
                        type: 'dropdown',
                        description: '',
                        options: []
                    }
                    pm.Toastr.success(__('Custom field created successfully!', 'pm-pro'));
                    self.toggleForm();
                },

                error (res) {

                }
            }

            self.httpRequest(request_data);
        },

        update () {
            var self = this;

            this.modal.loading = true;

            var request_data = {
                url: self.base_url + 'pm-pro/v2/projects/'+self.project_id+'/custom-fields/'+self.fields.id+'/update',
                type: 'POST',
                data: self.fields,
                success (res) {
                    self.$store.commit('customFields/updateField', res.data);
                    self.modal.loading = false;
                    self.fields = {
                        title: '',
                        type: 'dropdown',
                        description: '',
                        options: []
                    }
                    pm.Toastr.success(__( 'Custom field updated successfully!', 'pm-pro'));
                    self.toggleForm();
                },

                error (res) {

                }
            }

            self.httpRequest(request_data);
        },

        tabContent () {
            let index = this.getIndex( this.actionData.tabs, 'custom_field', 'id' );
            return this.actionData.tabs[index].active;
        },

        setSettings (field) {
            this.settings = field;
        },

    }

}
</script>
