<script type="text/tmpl" id="cpm-comment-edit">
    <form class="cpm-comment-edit" method="post" action="">
        <p>
            <textarea name="cpm_message" class="required" cols="55" rows="4" placeholder="<?php esc_attr_e( 'Enter your message', 'cpm' ); ?>"><%= text %></textarea>
        </p>
        <p>
            <label for="privacy"><?php _e( 'Privacy', 'cpm' ); ?>: </label>
            <input type="radio" name="privacy" value="1" <% if(privacy == '1') { %> checked="checked" <% } %> /> Yes
            <input type="radio" name="privacy" value="0" <% if(privacy == '0') { %> checked="checked" <% } %> /> No
        </p>


        <% if(files.length > 0 ) { %>
            <div class="cpm-upload-container">
                <% _.each(files, function(file) { %>
                    <div class="cpm-uploaded-item">
                        <a target="_blank" href="<%= file.url %>"><%= file.name %></a>
                        <a class="cpm-delete-file button" data-id="<%= file_id %>" href="#">Delete File</a>
                    </div>
                <% }); %>
            </div>
        <% } %>

        <p>
            <input type="hidden" name="action" value="cpm_update_comment" />
            <input type="hidden" name="comment_id" value="<%= id %>" />
            <input type="submit" class="button-primary update-comment" value="<?php esc_attr_e( 'Update Comment', 'cpm' ); ?>" />
            <a class="button cpm-comment-edit-cancel" href="#">Cancel</a>
        </p>
    </form>
</script>