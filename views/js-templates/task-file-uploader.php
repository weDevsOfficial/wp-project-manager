<div class='cpm-attachment-area'>
    <div id='cpm-upload-container-task'>
        <div class='cpm-upload-filelist'>
            <div class="cpm-uploaded-item" v-if="files.length" v-for="file in files" :key="file.id" >

                <a href="{{file.url}}" target="_blank">
                    <img :src="file.thumb" alt="{{file.name}}" />
                </a>
                <a href="#" data-id="{{file.id}}" id="{{file.id}}" class="cpm-delete-file button" @click.prevent="deletefile(file.id)">{{text.delete_file}}</a>
                <input type="hidden" name="cpm_attachment[]" value="{{file.id}}">
            </div>
        </div>
        <div class='clearfix'></div>
    </div>

      {{text.to_attach}}, <a href='#' id='cpm-upload-pickfiles-task' class="" > {{text.select_file}} </a> {{text.from_computer}}.

</div>