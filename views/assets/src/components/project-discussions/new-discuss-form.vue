<template>
    <div class="pm-msg-edit-form">
        <div class="pm-message-form-wrap" >
            <form class="pm-form pm-message-form" @submit.prevent="formAction()" enctype='multipart/form-data'>
            <div class="item title">
                <input v-model="discuss.title" name="title" required="required" type="text" id="message_title" value="" :placeholder="Enter_Message_Title">
            </div>

            <div class="item detail">
                <text-editor :editor_id="editor_id" :content="content"></text-editor>
            </div>

            <div class="item milestone">
                <select v-model="milestone_id">
                    <option value="-1">
                     {{ __( '- Milestone -', 'wedevs-project-manager') }}
                    </option>
                    <option v-for="milestone in milestones" :key="milestone.id" :value="milestone.id">
                      {{ milestone.title }}
                    </option>
                </select>

            </div>
            <pm-do-action hook="pm_discuss_form" :actionData="discuss" ></pm-do-action>
            <file-uploader :files="files" :delete="deleted_files"></file-uploader>

            <notify-user v-model="notify_users"></notify-user>

            <div class="submit">
                <input v-if="!discuss.id" type="submit" name="create_message" id="create_message" class="button-primary" :value="Add_message">
                <input v-if="discuss.id" type="submit" name="update_message" id="update_message" class="button-primary" :value="update_message">
                <a href="" @click.prevent="showHideDiscussForm(false, discuss)" class="message-cancel button-secondary">{{ __( 'Cancel', 'wedevs-project-manager') }}</a>
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>       
            </form>
        </div>
    </div>
</template>

<style lang="less">
    .pm-message-form-wrap .notify-users .pm-user-list {
        padding: 10px 10px 10px 16px !important;
    }
</style>

<script>
  import editor from '@components/common/text-editor.vue';
  import uploader from '@components/common/file-uploader.vue';
  import notifyUser from '@components/common/notify-user.vue';
  import Mixins from './mixin';


  export default { 
    props: ['discuss'],
    mixins: [Mixins],
    
    data () {
      return {
        submit_disabled: false,
        show_spinner: false,
        Enter_Message_Title: __( 'Enter message title', 'wedevs-project-manager'),
        Add_message: __( 'Add Message', 'wedevs-project-manager'),
        update_message: __( 'Update Message', 'wedevs-project-manager'),
        content: {
            html: typeof this.discuss.description == 'undefined' ? '' : this.discuss.description,
        },
        milestone_id: typeof this.discuss.milestone === 'undefined' ? '-1' : this.discuss.milestone.data.id,
        files: typeof this.discuss.files === 'undefined' ? [] : this.discuss.files.data,
        deleted_files: [],
        pfiles: [],
        notify_users:[],
        
      }
    },

    watch: {
        milestone_id (milestone_id) {
            this.discuss.milestone_id = milestone_id;
        },
      /**
       * Observe onchange comment message
       *
       * @param string new_content 
       * 
       * @type void
       */
        content: {
            handler: function( new_content ) {
                this.discuss.description = new_content.html;
            },
            deep: true
        }
    },

    components: {
        'text-editor': editor,
        'file-uploader': uploader,
        notifyUser: notifyUser
    },
    
    computed: {
        milestones () {
            return this.$root.$store.state.milestones;
        },
        /**
        * Editor ID
        * 
        * @return string
        */
        editor_id () {
            var discuss_id = ( typeof this.discuss.id === 'undefined' ) ? '' : '-' + this.discuss.id;
            return 'pm-discuss-editor' + discuss_id;
        }
    },
    methods: {
        filesChange ($event, $files) {
            this.pfiles = $files;
        },

      formAction () {
        var self = this;
        var discuss_id = typeof self.discuss.id === 'undefined' ? false : this.discuss.id;

        var args = {
            title: this.discuss.title,
            description: typeof this.discuss.description === 'undefined' ? '' : this.discuss.description,
            milestone_id: this.discuss.milestone_id,
            order: 0,
            deleted_files: this.deleted_files,
            files: this.files,
            notify_users: this.notify_users,
        }
        
        if (discuss_id) {
            args.discuss_id = discuss_id;
            self.updateDiscuss(args);
        
        } else {
            args.callback = function(res) {
                self.lazyAction();
                self.$router.push({
                    name: 'individual_discussions', 
                    params: { 
                        project_id: self.project_id,
                        discussion_id: res.id 
                    }
                });
            }
            self.newDiscuss(args);
        }
      },
    }
  
  } 
</script>
