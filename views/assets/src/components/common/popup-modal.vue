<template>
    <div class="pm-popup-mask">
        <div class="popup-container">
        	<form @submit.prevent="submit()">
            
                <div class="head">
                    <span>{{ options.title }}</span>
                </div>

                <div class="content">
              		<slot></slot>

                </div>

                <div class="pm-button-group">
                    <div class="button-group-inside">
                        <div class="cancel-btn-wrap">
                            <a href="#" @click.prevent="close()"  class="pm-button pm-secondary">{{ options.cancelButton }}</a>
                        </div>
                        <div class="update-btn-wrap">
                            <input 
                            	type="submit"
                            	:class="options.loading ? 'submit-btn-text pm-button pm-primary' : 'pm-button pm-primary'"
                            	:value="options.submitButton"
                            />
                            	
                            <div v-if="options.loading" class="pm-circle-spinner"></div>
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
		porps: {
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
					isForm: true
				}
			}
		},

		created () {
			this.options = Object.assign( this.default, this.options )
		},

		methods: {
			submit () {
				this.$emit('submit');
				this.options.loading = true;
			},

			close () {
				this.$emit('close');
			}
		}
	}
</script>
