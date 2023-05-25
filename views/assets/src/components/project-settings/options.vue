<template>
    <div class="pm-custom-field-options-wrap">
        <div v-if="options.length" class="pm-custom-field-options">
            <h2 v-if="options.length" class="options-title">{{ __('Options', 'wedevs-project-manager') }}</h2>
            <div v-if="options.length" class="option-list-wrap">
                <div
                    class="option-list"
                    v-if="options.length"
                    v-for="(option, index) in options"
                    :key="index"
                >
                    <div class="icon-wrap list-color-wrap">
                        <span
                            :style="{
                                border: '1px solid '+option.color,
                                background: option.color,
                                color: checkTextColor(option.color)
                            }"
                            class="check"
                            v-html="'&#x02713;'"
                            @click.prevent="activeColoerUpdateMode(option)"
                        />

                        <pm-click-wrap
                            v-if="option.updateColorMode"
                            @clickOutSide="clickOutSideOptionColor(option)"
                        >
                            <div class="color-picker">
                                <pm-color-picker
                                    v-color-picker
                                    :value="option.color"
                                    @input="updateOptionColor($event, option)"
                                />
                            </div>
                        </pm-click-wrap>
                    </div>

                    <pm-click-wrap
                        @clickOutSide="clickOutSideOptionTitle(option)"
                        @clickInSide="clickInsideOptionTitle(option)"
                    >
                        <div class="title-content">
                            <span v-if="!option.update" class="title">{{ option.title }}</span>
                            <span class="update-option-text-field-wrap" v-if="option.update">
                                <input
                                    @keydown.enter.prevent=""
                                    @keypress="characterLimit(option.title, $event)"
                                    @keyup.enter.prevent="clickOutSideOptionTitle(option)"
                                    class="update-option-text-field"
                                    v-model="option.title"
                                    type="text"
                                />
                            </span>
                            <span
                                class="cross"
                                @click.prevent="deleteOption(index)"
                                v-html="'&#x02717;'"
                            />

                        </div>
                    </pm-click-wrap>
                </div>
            </div>

        </div>

        <div
            v-if="optionField"
            class="fields-wrap"
            :style="{
                'margin-top': options.length ? '13px' : 0
            }"
        >

            <div v-if="optionField" class="child-field">
                <div class="text-color-field-warp">
                    <pm-click-wrap
                        @clickOutSide="clickOutSideNewOptionColorField()"
                    >
                        <pm-color-picker
                            :value="fields.color"
                            @input="setColor"
                        />

                    </pm-click-wrap>

                    <input class="option-name"
                        @keydown.enter.prevent=""
                        @keypress="characterLimit(fields.title, $event)"
                        @keyup.enter="addNewOption()"
                        v-model="fields.title"
                        type="text"
                        :placeholder="__( 'Type an option name', 'wedevs-project-manager' )"
                    />
                </div>
                <div>
                    <a href="#" @click.prevent="addNewOption()" class="pm-button pm-primary">{{ __('Add option', 'wedevs-project-manager') }}</a>
                </div>

            </div>

            <a class="add-new-options" @click.prevent="toggleOptionField()" href="#">
                <span v-if="!optionField" v-html="'&#43;'"></span>
                <span v-if="optionField" v-html="'&#8722;'"></span>
                <span>{{ 'Close', 'wedevs-project-manager' }}</span>
            </a>
        </div>

        <div v-if="!optionField">
            <a class="add-new-options" @click.prevent="toggleOptionField()" href="#">
                <span v-if="!optionField" v-html="'&#43;'"></span>
                <span v-if="optionField" v-html="'&#8722;'"></span>
                <span>{{ 'Add an option', 'wedevs-project-manager' }}</span>
            </a>
        </div>
    </div>
</template>

<style lang="less">
    .pm-custom-field-options-wrap {
        margin-top: 15px;

        .pm-custom-field-options {
            padding: 5px 12px;
            background: #f6f8fa;
            .options-title {
                margin: 0;
                padding: 0;
            }
            .option-list-wrap {
                margin: 10px 0 0 0;

                .option-list {
                    padding-bottom: 5px;
                    display: flex;
                    align-items: baseline;
                    margin: 0;
                    line-height: initial;
                    &:last-child {
                        padding-bottom: 0;
                    }
                    .cross-wrap {
                        width: 16px;
                    }
                    .title-content {
                        width: 80%;
                        display: flex;
                        align-items: center;
                    }
                    .update-option-text-field-wrap {
                        width: 80%;
                        .update-option-text-field {
                            min-height: inherit !important;
                            height: 22px;
                            width: 100%;
                        }
                    }

                    .list-color-wrap {
                        position: relative;
                        .color-picker {
                            position: absolute;
                            z-index: 99;
                            margin-top: 6px;
                            margin-left: -12px;
                            .hex-input {
                                display: none;
                            }
                        }
                        .button-group {
                            display: none;
                        }
                        .color-picker-button {
                            display: none;
                        }
                    }
                    .icon-wrap {
                        min-height: 22px;
                        .check {
                            border-radius: 16px;
                            width: 16px;
                            height: 16px;
                            text-align: center;
                            font-size: 10px;
                            margin-right: 6px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: 1;
                            font-size: 10px;
                            margin-right: 6px;
                            cursor: pointer;
                        }
                    }

                    .title {
                        font-size: 12px;
                        color: #24292e;
                        font-weight: 500;
                        line-height: 1.8;
                        min-height: 22px;
                    }
                    .cross {
                        font-size: 16px;
                        margin-left: 6px;
                        color: #943636;
                        cursor: pointer;
                        display: none;
                        line-height: 0;
                    }
                    &:hover {
                        .cross {
                            display: block;
                        }
                    }
                }
            }
        }
        .fields-wrap {
            .add-new-options {
                font-size: 12px;
            }
            .child-field {
                display: flex;
                position: relative;

                .option-name {
                    width: 62.5%;
                }

                .color-picker-container {
                    position: absolute;
                    left: 67.5%;
                }

                .text-color-field-warp {
                    position: relative;
                    flex: 1;

                    .color-picker-container {
                        .hex-input {
                            display: none;
                        }
                        .button-group {
                            display: none;
                        }

                    }
                }
            }
        }
    }

</style>

<script>
    Vue.directive('color-picker',{
        inserted: function (element) {
            element.getElementsByClassName('color-picker-button')[0].click();
        }
    })
    export default {
        props: {
            options: {
                type: [Array]
            },
            modal: {
                type: [Object]
            }
        },
        data () {
            return {
                fields: {
                    title: '',
                    color: '',
                    key: ''
                },
                optionField: false
            }
        },

        methods: {
            clickOutSideNewOptionColorField () {
                let colorButton = document.getElementsByClassName('child-field')[0]
                    .getElementsByClassName('color-picker-container')[0]
                    .getElementsByClassName('button-group');

                if(colorButton.length) {
                    colorButton[0]
                        .getElementsByClassName('button-small')[1].click();
                }
            },
            modalSubmitButtonDisable () {
                this.modal.submitButtonDisabled = true;
            },
            modalSubmitButtonEnable () {
                this.modal.submitButtonDisabled = false;
            },
            toggleOptionField () {
                this.optionField = this.optionField ? false : true;
            },
            characterLimit (title, event) {
                if(title.length > 39) {
                    pm.Toastr.warning(__('Maximum character limit 40', 'wedevs-project-manager'));
                    event.preventDefault();
                }
            },
            clickOutSideOptionColor (option) {
                if(option.update) {
                    option.update = false;
                } else {
                    Vue.set( option, 'updateColorMode', false );
                }
            },
            activeColoerUpdateMode (option) {
                if(option.update) {
                    option.update = true;
                } else {
                    Vue.set( option, 'updateColorMode', true );
                }
            },
            clickOutSideOptionTitle (option) {
                if(option.update) {
                    option.update = false;
                } else {
                    Vue.set( option, 'update', false );
                }
            },
            clickInsideOptionTitle (option) {
                if(option.update) {
                    option.update = true;
                } else {
                    Vue.set( option, 'update', true );
                }
            },

            addNewOption () {
                if( this.fields.title == '' ) {
                    pm.Toastr.warning( __( 'Option name required', 'wedevs-project-manager' )  );
                    return;
                }

                this.fields.key = this.fields.title.toLowerCase();
                this.fields.key = this.fields.key.replace( ' ', '_' );


                this.options.push({ ...this.fields })

                this.fields.title = '';
                this.fields.color = '';
                this.fields.key = '';

                this.clickOutSideNewOptionColorField();
            },

            deleteOption (index) {
                this.options.splice( index, 1 )
            },
            setColor (color) {
                this.fields.color = color;
            },

            updateOptionColor(color, option) {
                option.color = color;
            },
            checkTextColor (background) {
                if(typeof background == 'undefined') {
                    return '#848484';
                }

                if( background == '') {
                    return '#848484';
                }

                let textColor = this.getTextColor(background);

                if(textColor == '') {
                    return '#848484';
                }

                return textColor;
            },
        }
    }
</script>
