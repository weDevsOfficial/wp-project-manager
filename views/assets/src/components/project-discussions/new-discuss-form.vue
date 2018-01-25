<template>
    <div>
        <!-- <pre>{{ discuss }}</pre> -->
        <form id="myForm" class="pm-message-form" @submit.prevent="formAction()" enctype='multipart/form-data'>
            <div class="item title">
                <input v-model="discuss.title" name="title" required="required" type="text" id="message_title" value="" :placeholder="text.enter_message_title">
            </div>

            <div class="item detail">
                <text-editor :editor_id="editor_id" :content="content"></text-editor>
            </div>

            <div class="item milestone">
                <select v-model="milestone_id">
                    <option value="-1">
                     {{text.milestones_select}}
                    </option>
                    <option v-for="milestone in milestones" :value="milestone.id">
                      {{ milestone.title }}
                    </option>
                </select>

            </div>
            <pm-do-action hook="pm_discuss_form" :actionData="discuss" ></pm-do-action>
            <file-uploader :files="files" :delete="deleted_files"></file-uploader>

            <notify-user v-model="notify_users"></notify-user>

            <div class="submit">
                <input v-if="!discuss.id" type="submit" name="create_message" id="create_message" class="button-primary" :value="text.add_message">
                <input v-if="discuss.id" type="submit" name="update_message" id="update_message" class="button-primary" :value="text.update_message">
                <a href="" @click.prevent="showHideDiscussForm(false, discuss)" class="message-cancel button-secondary">{{text.cancel}}</a>
                <span v-show="show_spinner" class="pm-spinner"></span>
            </div>       
        </form>
    </div>
</template>

<script>
  import editor from '@components/common/text-editor.vue';
  import uploader from '@components/common/file-uploader.vue';
  import notifyUser from '@components/common/notifyUser.vue';



  export default { 
    props: ['discuss'],
    mixins: [PmMixin.projectDiscussions],
    
    data () {
      return {
        submit_disabled: false,
        show_spinner: false,
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
            }
            self.newDiscuss(args);
        }
      },
    }
  
  } 
</script>
