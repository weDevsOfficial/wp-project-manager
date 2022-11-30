<template>
    <form class="label-form" action="" method="post" @submit.prevent="selfNewLabel()">
        <div class="form-group-wrap">
            <div class="form-group">
                <div class="label-wrap">
                    <label>{{ __( 'Label Name', 'wedevs-project-manager' ) }}</label>
                </div>
                <div>
                    <input v-model="label.title" class="form-control" :placeholder="__( 'Label name...', 'wedevs-project-manager' )" type="text">
                </div>
            </div>

            <div class="form-group">
                <div class="label-wrap">
                    <label>{{ __( 'Description', 'wedevs-project-manager' ) }}</label>
                </div>
                <div>
                    <input v-model="label.description" class="form-control description-control" :placeholder="__( 'Description (optional)', 'wedevs-project-manager' )" type="text">
                </div>
            </div>

            <div class="form-group">
                <div class="label-wrap">
                    <label>{{ __( 'Color', 'wedevs-project-manager' ) }}</label>
                </div>
                <div class="form-control-color-picker">
                    <pm-color-picker v-model="label.color"></pm-color-picker>
                </div>
            </div>
        </div>

        <div>
            <div class="label-action" v-if="labelId">
                <a  @click.prevent="closeEditForm()" class="pm-button pm-secondary" href="#">{{ __('Cancel', 'wedevs-project-manager') }}</a>
                <div class="update-button-wrap">
                    <input :class="getUpdateButtonClass()" type="submit" :value="__('Update', 'wedevs-project-manager')">
                    <div v-if="updating" class="pm-spinner-circle"></div>
                </div>

            </div>
            <div class="label-action" v-else>
                <a @click.prevent="closeNewLabelForm()" class="pm-button pm-secondary" href="#">{{ __('Cancel', 'wedevs-project-manager') }}</a>
                <div class="add-button-wrap">
                    <input v-if="!labelId" :class="getNewLabelButtonClass()" type="submit" :value="__('Create label', 'wedevs-project-manager')">
                    <div v-if="adding" class="pm-spinner-circle"></div>
                </div>
            </div>
        </div>
    </form>
</template>

<style lang="less">
    .label-form {
        .label-action {
            display: flex;
            align-items: center;
            .pm-secondary {
                margin-right: 5px !important;
            }
            .update-button-wrap, .add-button-wrap {
                position: relative;

                .update-text-color, .add-text-color {
                    color: #1A9ED4 !important;
                }

                .pm-spinner-circle {
                    &:after {
                        content: "";
                        border: 2px solid #fff;
                        border-radius: 50%;
                        height: 1em;
                        width: 1em;
                        position: absolute;
                        left: 50%;
                        margin-left: -8.5px;
                        top: 50%;
                        margin-top: -8.5px;
                        border-color: #fff #fff #fff transparent;
                        -webkit-animation: pm-spinner-circle 1s infinite;
                        animation: pm-spinner-circle 1s infinite;
                    }
                }
            }
        }
    }

    @keyframes pm-spinner-circle {
        0% {
            -webkit-transform: rotate(0);
            transform: rotate(0);
            animation-timing-function: cubic-bezier(.55,.055,.675,.19)
        }

        50% {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
            animation-timing-function: cubic-bezier(.215,.61,.355,1)
        }

        to {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }

    @-webkit-keyframes pm-spinner-circle {
        0% {
            -webkit-transform: rotate(0);
            transform: rotate(0);
            animation-timing-function: cubic-bezier(.55,.055,.675,.19)
        }

        50% {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
            animation-timing-function: cubic-bezier(.215,.61,.355,1)
        }

        to {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg)
        }
    }
</style>

<script type="text/javascript">
    export default {
        props: {
            formAction: {
                type: [Object],
                default () {
                    return {}
                }
            },
            taskLabels: {
                type: [Array],
                default () {
                    return []
                }
            },
            taskSingleLabel: {
                type: [Object],
                default () {
                    return {}
                }
            }
        },

        data () {
            return {
                labelId: false,
                label: {
                    color: '',
                    title: '',
                    description: ''
                },
                preventDoubleClick: false,
                updating: false,
                adding: false
            }
        },
        created () {
            if(!jQuery.isEmptyObject(this.taskSingleLabel)) {
                this.labelId = this.taskSingleLabel.id;
                this.label = jQuery.extend( {}, this.taskSingleLabel);
            }
        },
        methods: {
            getNewLabelButtonClass () {
                if(this.adding) {
                    return 'pm-button pm-primary add-text-color';
                }

                return 'pm-button pm-primary';
            },
            getUpdateButtonClass () {
                if(this.updating) {
                    return 'pm-button pm-primary update-text-color';
                }

                return 'pm-button pm-primary';
            },
            closeNewLabelForm () {
                this.formAction.isClickNewForm = false;
            },
            closeEditForm (data) {
                this.taskSingleLabel['editMode'] = false;
                //this.$store.commit('proProSettings/closeEditForm', data);
            },
            checkValidation (label) {
                if(label.title === '') {
                    pm.Toastr.error(__('Label name required!', 'wedevs-project-manager'));
                    return false;
                }

                if(label.color === '') {
                    pm.Toastr.error(__('Label color required!', 'wedevs-project-manager'));
                    return false;
                }

                return true;
            },
            selfNewLabel () {
                var self = this;
                if(this.preventDoubleClick) {
                    return;
                }

                if(!this.checkValidation(self.label)) {
                    return false;
                }

                this.preventDoubleClick = true;

                var args = {
                    data: {
                        title: self.label.title,
                        description: self.label.description,
                        color: self.label.color,
                    },
                    callback(res) {
                        self.preventDoubleClick = false;
                        self.updating = false;
                        self.adding = false;

                        if(self.labelId) {
                            self.setUpdateLabel(res);
                        } else {
                            self.setNewLabel(res);
                        }
                    }
                }

                if(self.labelId) {
                    self.updating = true;
                    this.updateLabel(args);
                } else {
                    self.adding = true;
                    this.newLabel(args);
                }
            },

            setUpdateLabel (res) {
                res.data['editMode'] = false;
                let index = this.getIndex(this.taskLabels, res.data.id, 'id');
                this.taskLabels[index] = res.data;
                this.taskSingleLabel = jQuery.extend( this.taskSingleLabel, res.data );
                this.$store.commit('proProSettings/updateLabel', {
                    'project_id': res.data.project_id,
                    'label_id': res.data.id,
                    'label': res.data
                });

                this.closeEditForm();
            },

            setNewLabel (res) {
                res.data.editMode = false;
                //this.taskLabels.push(res.data);

                this.$store.commit('proProSettings/setLabel', {
                    'project_id': res.data.project_id,
                    'label': res.data
                });

                this.label = {
                    color: '',
                    title: '',
                    description: ''
                }

                jQuery('.color-picker-container')
                    .find('.button-group')
                    .find('.button-small')
                    .trigger('click')
            },

            updateLabel (args) {
                var self = this;
                var pre_define = {};

                var args = jQuery.extend(true, pre_define, args );

                var request = {
                    data: args.data,
                    type: 'POST',
                    url: self.base_url + 'pm-pro/v2/projects/'+self.project_id+'/settings/labels/'+self.labelId,
                    success (res) {
                        if(typeof args.callback === 'function') {
                            args.callback(res);
                        }

                    }
                };

                self.httpRequest(request);
            },

            newLabel (args) {
                var self = this;
                var pre_define = {};

                var args = jQuery.extend(true, pre_define, args );

                var request = {
                    data: args.data,
                    type: 'POST',
                    url: self.base_url + 'pm-pro/v2/projects/'+self.project_id+'/settings/labels',
                    success (res) {
                        if(typeof args.callback === 'function') {
                            args.callback(res);
                        }
                    }
                };

                self.httpRequest(request);
            }
        }
    }

</script>
