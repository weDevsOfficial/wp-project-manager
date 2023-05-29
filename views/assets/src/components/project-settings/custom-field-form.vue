<template>
    <div class="pm-custom-fields">
        <div class="inline-two-field">
            <div class="field" :style="{ 'margin-right': isUpdateMode ?  '0' : '20px' }">
                <label for="field-name" class="label">{{ __( 'Field Title', 'pm-pro' ) }}</label>
                <div class="item">
                    <input id="field-name" class="text" v-model="fields.title" type="text" :placeholder="__('e.g Priority, Stage, Status', 'pm-pro')" />
                </div>
            </div>
            <div v-if="!isUpdateMode" class="field">
                <label for="type" class="label">
                    {{ __( 'Type', 'pm-pro' ) }}
                </label>
                <div class="item">
                    <select id="type" class="select" v-model="fields.type">
                        <option value="dropdown">{{ __('Drop-down', 'pm-pro') }}</option>
                        <option value="text">{{ __('Text', 'pm-pro') }}</option>
                        <option value="number">{{ __('Number', 'pm-pro') }}</option>
                        <option value="url">{{ __('URL', 'pm-pro') }}</option>
                    </select>
                </div>
            </div>
        </div>
        <options-field v-if="fields.type == 'dropdown'" :modal="modal" :options="fields.options"></options-field>
        <div class="field-description">
            <a v-if="!hasDescription" @click.prevent="descriptionStatus()" href="#"  class="des-label">
                <!-- <span v-if="!hasDescription" v-html="'&#43;'"></span>
                <span v-if="hasDescription" v-html="'&#8722;'"></span> -->
                <span>{{ __( 'Add description', 'pm-pro' ) }}</span>
            </a>
            <textarea v-description-textarea v-if="hasDescription" id="description" class="description-textarea" v-model="fields.description"></textarea>
        </div>

    </div>
</template>

<style lang="less">
    .label-color {
        color: #24292e;
    }
    .field-width {
        width: 100%;
    }
    .field-focus {
        &:focus {
            border-color: #007cba;
            color: #016087;
            box-shadow: 0 0 0 1px #007cba;
        }
    }
    .pm-custom-fields {
        .inline-two-field {
            display: flex;
            .first-field {
                padding-right: 10px;
            }
            .field {
                .item {
                    #field-name {
                        color: #444;
                    }
                }
                &:first-child {
                    margin-right: 20px;
                }
                flex: 1;

                .label {
                    display: block;
                    .label-color();
                    margin-bottom: 5px;
                }
                .text, .select {
                    .field-width();
                    .field-focus();
                }
            }

        }
        .options-title {
            font-size: 14px;
            font-weight: 600;
            color: #24292e;
        }
        // .field {
        //     display: flex;
        //     align-items: center;
        //     margin-bottom: 15px;

        //     .text, .select {
        //         width: 80%;
        //     }
        //     .label {
        //         flex: 1;
        //     }
        //     .item {
        //         flex: 3;
        //     }
        // }
        .field-description {
            margin-top: 15px;
            .des-label {
                display: block;
                width: 100%;
            }
            .description-textarea {
                .field-width();
                .field-focus();
            }
        }
    }
</style>

<script>
    import OptionsDropdown from './options.vue';

    Vue.directive('description-textarea', {
        inserted: function (element, text, vnode) {
            if(vnode.context.fields.description) {
                return;
            }
            element.focus();
        }
    })

    export default {
        props: {
            fields: {
                type: [Object]
            },
            modal: {
                type: [Object]
            }
        },
        data () {
            return {
                hasDescription: false
            }
        },
        computed: {
            isUpdateMode () {
                return parseInt(this.fields.id) ? true : false;
            }
        },
        components: {
            'options-field': OptionsDropdown
        },
        created () {
            this.hasDescription = this.fields.description ? true : false;
        },
        methods: {
            descriptionStatus () {
                this.hasDescription = this.hasDescription ? false : true;
            }
        }
    }
</script>
