<div class="cpm-attachment-area">
    <div id="cpm-upload-container">
        <div class="cpm-upload-filelist">
        	<div class="cpm-uploaded-item" v-for="file in files" :key="file.id">
        		<a :href="file.url" target="_blank">
        			<img :src="file.thumb" :alt="file.name">
        		</a> 
        		
        		<a href="#" data-id="373" class="cpm-delete-file button">Delete File</a>
        			
        	</div>
 
                       
        </div>
        <?php printf( '%s, <a id="cpm-upload-pickfiles%s" href="#">%s</a> %s.', __( 'To attach', 'cpm' ), '', __( 'select files', 'cpm' ), __( 'from your computer', 'cpm' ) ); ?>
    </div>
</div>