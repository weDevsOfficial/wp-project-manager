<div class="cpm-attachment-area">
    <div id="cpm-upload-container">
        <div class="cpm-upload-filelist">
        	<div class="cpm-uploaded-item" v-for="file in files" :key="file.id">
        		<a :href="file.url" target="_blank">
        			<img :src="file.thumb" :alt="file.name">
        		</a> 
        		
        		<a href="#" @click.prevent="deletefile(file.id)" class="button"><?php _e( 'Delete File', 'cpm' ); ?></a>
        			
        	</div>
 
                       
        </div>
        <?php printf( __( 'To attach, %sselect files%s from your computer.', 'cpm' ), sprintf( '<a id="cpm-upload-pickfiles%s" href="#">', '' ), '</a>' ); ?>
    </div>
</div>