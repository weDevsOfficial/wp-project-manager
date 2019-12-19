<template>
    <div class="pm-popup-mask">
        <div class="popup-container" :style="{
        	width: data.width
        }">
        	<form @submit.prevent="submit()">
            
                <div class="head">
                    <span>{{ data.title }}</span>
                </div>

                <div class="content" :style="{
                	height: data.height
                }">
              		<slot></slot>

                </div>

                <div class="pm-button-group">
                    <div class="button-group-inside">
                        <div class="cancel-btn-wrap">
                            <a href="#" @click.prevent="close()"  class="pm-button pm-secondary">{{ data.cancelButton }}</a>
                        </div>
                        <div class="update-btn-wrap">
                            <input 
                            	type="submit"
                            	:class="data.loading ? 'submit-btn-text pm-button pm-primary' : 'pm-button pm-primary'"
                            	:value="data.submitButton"
                            />
                            	
                            <div v-if="data.loading" class="pm-circle-spinner"></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    </div>
</template>

<style lang="less">

    .pm-popup-mask {
    	position: fixed;
	    z-index: 9999;
	    top: 0;
	    left: 0;
	    width: 100%;
	    height: 100%;
	    background-color: rgba(0, 0, 0, 0.3);
	    display: table;
	    transition: opacity 0.3s ease;
	    .popup-container {
		    width: 545px;
		    margin-left: auto;
		    margin-right: auto;
		    background: #fff;
		    border-top-right-radius: 0;
		    top: 80px;
		    position: relative;

        	.head {
	            background-color: #f6f8fa;
	            border-bottom: 1px solid #eee;
	            padding: 16px;
	            font-size: 14px;
	            font-weight: 600;
	            color: #24292e;
	        }
	        
            .content {
                padding: 16px;
			    overflow: scroll;
			    overflow-x: hidden;
			    width: auto;
			    height: 60vh;

			    input[type="text"], select, textarea {
			    	padding: 0 8px;
				    line-height: 2;
				    min-height: 30px;
				    box-shadow: 0 0 0 transparent;
				    border: 1px solid #7e8993;
				    background-color: #fff;
				    color: #32373c;

				    &:focus {
				    	border-color: #007cba;
					    box-shadow: 0 0 0 1px #007cba;
					    outline: 2px solid transparent;
				    }
			    }
            }

            .pm-button-group {
                
                background: #f6f8fa;
                border-top: 1px solid #eee;
                padding: 12px;

                .button-group-inside {
                    display: flex;
                    .cancel-btn-wrap {
                        margin-right: 10px;
                        margin-left: auto;
                    }
                    .submit-btn-text {
                        color: #199ed4 !important;
                    }
                    .update-btn-wrap {
                        position: relative;
                        .pm-circle-spinner {
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            margin-left: -16px;
                            margin-top: -11px;

                            &:after {
                                height: 10px;
                                width: 10px;
                                border-color: #fff #fff #fff transparent;
                            }
                        }
                    }
                }

            }
	        
	    }
    }
</style>


<script>
	export default {
		props: {
			options: {
				type: [Object]
			}
		},

		data () {
			return {
				default: {
					title: __( 'Title', 'pm' ),
					cancelButton: __( 'Cancel', 'pm' ),
					submitButton: __( 'Add New', 'pm' ),
					loading: false,
					isForm: true,
					manageLoading: false,
					height: '60vh',
					width: '545px'
				},

				data: {}
			}
		},

		created () {
			this.data = Object.assign(this.default, this.options);
		},

		methods: {
			submit () {
				if(!this.data.manageLoading) {
					this.data.loading = true;
				}

				this.$emit('submit', this.data);

			},

			close () {
				this.$emit('close');
			}
		}
	}
</script>
