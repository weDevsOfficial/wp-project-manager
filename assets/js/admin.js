;
( function( $ ) {

    var weDevs_CPM = {
        init: function() {

            $( '#cpm-create-user-wrap' ).on( 'submit', 'form.cpm-user-create-form', this.Project.UserCreate );
            // $( "button.click" ).on('click', this.Project.openDialogUserCreateForm);
            $( "a#cpm-create-project" ).on( 'click', this.Project.openDialog );
            $( "#cpm-project-dialog" ).on( 'click', 'a.project-cancel', this.Project.closeDialog );
            $( "a.cpm-project-delete-link" ).on( 'click', this.Project.remove );
            $( "#cpm-project-dialog" ).on( 'submit', 'form.cpm-project-form', this.Project.create );
            $( '.cpm-edit-project' ).on( 'submit', 'form.cpm-project-form', this.Project.edit );
            $( '.cpm-project-head' ).on( 'click', 'a.cpm-icon-edit', this.Project.toggleEditForm );
            $( '.cpm-project-head' ).on( 'click', 'a.project-cancel', this.Project.toggleEditForm );
            $( '.cpm-load-more' ).on( 'click', this.Project.loadActivity );
            $( '.cpm-loads-more' ).on( 'click', this.Project.loadAllActivity );

            /* =============== Milestones ============ */
            $( '#cpm-milestone-page' ).on( 'click', '.milestone-link', this.Milestone.showMilestonePart );
            $( '.cpm-links' ).on( 'click', '.cpm-milestone-delete', this.Milestone.remove );
            $( '.cpm-links' ).on( 'click', '.cpm-milestone-complete', this.Milestone.markComplete );
            $( '.cpm-links' ).on( 'click', '.cpm-milestone-open', this.Milestone.markOpen );
            $( '.cpm-links' ).on( 'click', 'a.cpm-icon-edit', this.Milestone.get );
            $( '.cpm-new-milestone-form' ).on( 'submit', 'form.cpm-milestone-form', this.Milestone.add );
            $( '.cpm-new-milestone-form' ).on( 'click', 'a.milestone-cancel', this.Milestone.hide );
            $( 'a#cpm-add-milestone' ).on( 'click', this.Milestone.show );
            $( '.cpm-milestone' ).on( 'click', 'a.milestone-cancel', this.Milestone.cancelUpdate );
            $( '.cpm-milestone' ).on( 'submit', 'form.cpm-milestone-form', this.Milestone.update );

            /* =============== Comments ============ */
            $( 'body' ).on( 'click', '.cpm-edit-comment-link', this.Comment.get );
            $( 'body' ).on( 'click', '.cpm-comment-edit-cancel', this.Comment.cancelCommentEdit );
            $( 'body' ).on( 'click', '.cpm-delete-comment-link', this.Comment.deleteComment );
            $( 'body' ).on( 'submit', 'form.cpm-comment-form', this.Comment.update );
            $( 'body' ).on( 'click', '.cpm-delete-file', this.Uploader.deleteFile );

            /* =============== Project Duplicate ============ */
            $( '.cpm-duplicate-project' ).on( 'click', this.Project.ProjectDuplicate );

            /* =============== Project archive ============ */
            $( '.cpm-archive' ).on( 'click', this.Project.ProjectArchive );

            /* =============== Project setting  ============ */
            $( '.cpm-settings-bind' ).on( 'click', this.Project.Settings );

            /* =============== Project view  ============ */
            $( '.cpm-project-view' ).on( 'click', 'a.change-view', this.Project.View );
            /* ================= */

            // User List on message and comments



            // add new commenttoggleForm
            $( '.cpm-comment-form' ).validate( {
                submitHandler: function( form ) {
                    weDevs_CPM.Comment.addNew.call( form );
                    return false;
                }
            } );
            // toggle all user notification checkbox
            $( '.cpm' ).on( 'change', '.cpm-toggle-checkbox', function( e ) {
                var $checkBoxes = $( this ).closest( '.notify-users' ).find( 'input[type=checkbox][name="notify_user[]"]' );
                $checkBoxes.prop( 'checked', $( this ).prop( "checked" ) );
            } );
            /* =============== Messages ============ */
            // new message

            $( 'body' ).on( 'click', '#cpm-add-message', this.Message.show );
            $( 'body' ).on( 'click', '#cpm-add-message-new', this.Message.showasblank );
            $( 'body' ).on( 'click', '.dicussion-list .cpm-col-9', this.Message.showDiscussion );
            $( 'body' ).on( 'click', '.dicussion-list .comment-count', this.Message.showDiscussion );
            $( 'body' ).on( 'click', 'a.message-cancel', this.Message.hide );
            $( 'body' ).on( 'click', 'a.cpm-msg-edit', this.Message.get );
            $( 'body' ).on( 'click', 'a.message-cancel', this.Message.hideEditForm );
            $( 'body' ).on( 'submit', 'form.cpm-message-form', this.Message.update );
            $( 'body' ).on( 'click', 'a.delete-message', this.Message.remove );
            $( 'body' ).on( 'click', '#create_message', this.Message.addNew );

            /* =============== Uploder ============ */

            // Vue component for TinyMCE

            Vue.component( 'texteditor', {
                template: '<textarea id="vue-text-editor-{{ editorId }}" name="{{inputname}}" class="vue-text-editor">{{ content }}</textarea>',
                props: [ 'content', 'inputname' ],
                data: function() {
                    return {
                        editorId: this._uid
                    };
                },
                computed: {
                    shortcodes: function() {
                       // return this.tinymceSettings.shortcodes;
                    },
                    pluginURL: function() {
                        return CPM_Vars.pluginURL;
                    }
                },
                ready: function() {
                    var component = this;

                    window.tinymce.init( {
                        selector: 'textarea#vue-text-editor-' + this.editorId,
                        height: 300,
                        menubar: false,
                        convert_urls: false,
                        theme: 'modern',
                        skin: 'lightgray',
                        content_css: component.pluginURL + '/assets/css/text-editor.css',
                        setup: function( editor ) {
                            // editor change triggers
                            editor.on( 'change', function() {
                                component.$set( 'content', editor.getContent() );
                            } );
                            editor.on( 'keyup', function() {
                                component.$set( 'content', editor.getContent() );
                            } );
                            editor.on( 'NodeChange', function() {
                                component.$set( 'content', editor.getContent() );
                            } );
                        },
                        fontsize_formats: '10px 11px 13px 14px 16px 18px 22px 25px 30px 36px 40px 45px 50px 60px 65px 70px 75px 80px',
                        font_formats: 'Arial=arial,helvetica,sans-serif;' +
                                'Comic Sans MS=comic sans ms,sans-serif;' +
                                'Courier New=courier new,courier;' +
                                'Georgia=georgia,palatino;' +
                                'Lucida=Lucida Sans Unicode, Lucida Grande, sans-serif;' +
                                'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                                'Times New Roman=times new roman,times;' +
                                'Trebuchet MS=trebuchet ms,geneva;' +
                                'Verdana=verdana,geneva;',
                        plugins: 'textcolor colorpicker wplink   hr',
                        toolbar1: 'bold italic strikethrough bullist numlist alignleft aligncenter alignjustify alignright link',
                        toolbar2: 'formatselect forecolor backcolor underline blockquote hr code',
                        toolbar3: 'fontselect fontsizeselect removeformat undo redo',
                    } );
                }
            } );
        },

        tinymceInit: function( id ) {
            tinymce.execCommand( 'mceRemoveEditor', true, id );
            tinymce.execCommand( 'mceAddEditor', true, id );
        },
        Project: {
            UserCreate: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        spinner = self.find( 'input[type=submit]' ).siblings( 'span' );
                spinner.addClass( 'cpm-spinner' );
                if ( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }
                self.attr( 'disabled', true );
                var data = {
                    action: 'cpm_user_create',
                    data: self.serialize(),
                    _wpnonce: CPM_Vars.nonce
                };
                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    self.attr( 'disabled', false );
                    spinner.removeClass( 'cpm-spinner' );
                    if ( resp.success ) {
                        $( "#cpm-create-user-wrap" ).dialog( "close" );
                        $( '.cpm-project-role>table' ).append( resp.data );
                        $( '.cpm-error' ).html( '' );
                        $( "form.cpm-user-create-form input[type=text], input[type=email]" ).val( '' );
                    } else {
                        $( '.cpm-error' ).html( resp.data );
                    }
                } );
                return false;
            },
            Settings: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        status = self.siblings( '.cpm-settings' );
                if ( status.is( ":visible" ) === false ) {
                    status.show();
                } else {
                    status.hide();
                }
            },
            View: function( e ) {
                var uaction = $( this ).attr( 'dir' );
                $( ".change-view span" ).removeClass( 'active' );
                if ( uaction == 'list' ) {
                    $( ".cpm-projects" ).removeClass( "cpm-project-grid" );
                    $( ".cpm-projects" ).addClass( "cpm-project-list" );
                    $( this ).find( "span" ).addClass( 'active' );
                }

                if ( uaction == 'grid' ) {
                    $( ".cpm-projects" ).removeClass( "cpm-project-list" );
                    $( ".cpm-projects" ).addClass( "cpm-project-grid" );
                    $( this ).find( "span" ).addClass( 'active' );
                }
                var data = {
                    action: 'cpm_project_view',
                    _nonce: CPM_Vars.nonce,
                    change_view: uaction,
                };
                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    if ( resp.success ) {

                    }
                    ;
                } );
            },
            ProjectArchive: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        data = {
                            action: 'cpm_project_archive',
                            _nonce: CPM_Vars.nonce,
                            project_id: self.data( 'project_id' ),
                            type: self.data( 'type' ),
                        };
                if ( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }
                self.attr( 'disabled', true );
                self.siblings( 'span' ).addClass( 'cpm-loading' );
                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    self.attr( 'disabled', false );
                    if ( resp.success ) {
                        if ( $( 'article.cpm-project' ).length ) {
                            $( '.cpm-active' ).html( 'Active(' + resp.data.count.active + ')' );
                            $( '.cpm-archive-head' ).html( 'Completed(' + resp.data.count.archive + ')' );
                            self.closest( 'article' ).fadeOut( 'slow', function() {
                                this.remove();
                            } );
                        } else {
                            location.href = resp.data.url;
                        }
                    }
                    ;
                } );
            },
            ProjectDuplicate: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        data = {
                            action: 'cpm_project_duplicate',
                            _nonce: CPM_Vars.nonce,
                            url: self.attr( 'href' ),
                            project_id: self.data( 'project_id' ),
                        };
                if ( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }

                self.attr( 'disabled', true );
                self.siblings( 'span' ).addClass( 'cpm-loading' );
                $.post( CPM_Vars.ajaxurl, data, function( resp ) {
                    self.attr( 'disabled', false );
                    if ( resp.success ) {
                        location.href = resp.data.url;
                    }
                } );
            },
            openDialog: function( e ) {
                e.preventDefault();
                $( "#cpm-project-dialog" ).dialog( "open" );
            },
            closeDialog: function( e ) {
                e.preventDefault();
                $( "#cpm-project-dialog" ).dialog( "close" );
            },
            create: function( e ) {
                e.preventDefault();
                var self = $( this ).find( 'input[type=submit]' );
                if ( self.is( ':disabled' ) ) {
                    return false;
                }

                var name = $.trim( $( '#project_name' ).val() );
                if ( name === '' ) {
                    alert( 'Enter a project name' );
                    return false;
                }
                self.attr( 'disabled', true );
                var form = $( this ),
                        data = form.serialize();
                form.find( '.cpm-loading' ).show(); //append('<div class="cpm-loading">Saving...</div>');
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    self.attr( 'disabled', false );
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        window.location.href = res.url;
                    }
                } );
            },
            toggleEditForm: function( e ) {
                e.preventDefault();
                var container = $( this ).closest( '.cpm-project-head' );
                container.find( '.cpm-edit-project' ).slideToggle();
                container.find( '.cpm-project-detail' ).slideToggle();
            },
            edit: function( e ) {
                e.preventDefault();
                var form = $( this ),
                        spinner = form.find( '.cpm-pro-update-spinner' );
                spinner.show();
                var container = $( this ).closest( '.cpm-project-head' ),
                        data = form.serialize(),
                        button = form.find( 'input[type=submit]' );
                button.attr( 'disabled', true );
                form.append( '<div class="cpm-loading">Saving...</div>' );
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    button.attr( 'disabled', false );
                    spinner.hide();
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        container.find( '.cpm-project-title' ).text( res.title );
                        container.find( '.detail' ).html( res.content );
                        form.find( '.cpm-project-role' ).children( 'table' ).html( res.users );
                        form.closest( '.cpm-edit-project' ).slideUp();
                        container.find( '.cpm-project-detail' ).slideToggle();
                        //re-initialize chosen dropdown
                        // $('#project_coworker').chosen();
                    }
                } );
                $( '.cpm-loading' ).remove();
            },
            remove: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        message = self.data( 'confirm' ),
                        data = {
                            project_id: self.data( 'project_id' ),
                            action: 'cpm_project_delete',
                            url: self.attr( 'href' ),
                            _wpnonce: CPM_Vars.nonce
                        };
                if ( confirm( message ) ) {
                    self.siblings( 'span' ).addClass( 'cpm-loading' );
                    $.post( CPM_Vars.ajaxurl, data, function( res ) {
                        res = $.parseJSON( res );
                        if ( res.success ) {
                            location.href = res.url;
                        }
                    } );
                }
            },
            loadActivity: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        total = self.data( 'total' ),
                        start = parseInt( self.data( 'start' ) ),
                        data = {
                            project_id: self.data( 'project_id' ),
                            offset: start,
                            action: 'cpm_get_activity',
                            _wpnonce: CPM_Vars.nonce
                        };
                self.append( '<div class="cpm-loading">Loading...</div>' );
                $.get( CPM_Vars.ajaxurl, data, function( res ) {
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        start = res.count + start;
                        self.prev( '.cpm_activity_list' ).append( res.content );
                        self.data( 'start', start );
                    } else {
                        self.remove();
                    }

                    $( '.cpm-loading' ).remove();
                } );
            },
            loadAllActivity: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        total = self.data( 'total' ),
                        start = parseInt( self.data( 'start' ) ),
                        data = {
                            projects_id: self.data( 'projects_id' ),
                            offset: start,
                            action: 'cpm_get_projects_activity',
                            _wpnonce: CPM_Vars.nonce
                        };
                self.append( '<div class="cpm-loading">Loading...</div>' );
                $.get( CPM_Vars.ajaxurl, data, function( res ) {
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        start = res.count + start;
                        self.siblings( '#cpm-progress-wrap' ).find( '.cpm-activity' ).append( res.content );
                        self.data( 'start', start );
                    } else {
                        self.remove();
                    }
                    $( '.cpm-loading' ).remove();
                } );
            },
        },
        Milestone: {
            showMilestonePart: function( e ) {
                e.preventDefault();
                $( "#cpm-milestone-page li" ).removeClass( 'active' );
                var showID = $( this ).attr( 'data-class' );
                $( this ).parent( 'li' ).addClass( 'active' );
                $( ".cpm-milestone-data" ).hide( 200 );
                $( "." + showID ).show( 300 );
            },
            remove: function( e ) {
                e.preventDefault();
                var self = $( this );
                if ( confirm( self.data( 'confirm' ) ) ) {
                    weDevs_CPM.Milestone.ajaxRequest.call( this, 'cpm_delete_milestone' );
                }
            },
            markComplete: function( e ) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call( this, 'cpm_milestone_complete' );
            },
            markOpen: function( e ) {
                e.preventDefault();
                weDevs_CPM.Milestone.ajaxRequest.call( this, 'cpm_milestone_open' );
            },
            show: function( e ) {
                e.preventDefault();
                $( '.cpm-new-milestone-form' ).slideDown();
            },
            hide: function( e ) {
                e.preventDefault();
                $( '.cpm-new-milestone-form' ).slideUp();
            },
            get: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        parent = self.closest( '.cpm-milestone' ),
                        data = {
                            id: self.data( 'id' ),
                            project_id: self.data( 'project_id' ),
                            action: 'cpm_milestone_get',
                            '_wpnonce': CPM_Vars.nonce
                        };
                self.addClass( 'cpm-milestones-spinner' );
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        parent.find( '.milestone-detail' ).hide()
                                .next( '.cpm-milestone-edit-form' ).html( res.content ).fadeIn();
                        $( '.datepicker' ).datepicker();

                    }
                } );
            },
            add: function( e ) {
                e.preventDefault();
                var form = $( this ),
                        spinner = form.find( '.cpm-loading' ),
                        data = form.serialize(),
                        btn = form.find( 'input[name=create_milestone]' );
                spinner.show();
                btn.attr( 'disabled', true );
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    spinner.hide();
                    btn.attr( 'disabled', false );
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        window.location.reload();
                    }
                } );
            },
            update: function( e ) {
                e.preventDefault();
                var form = $( this ),
                        spinner = form.find( '.cpm-loading' ),
                        btn = form.find( 'input[name=create_milestone]' ),
                        data = form.serialize();
                spinner.show();
                btn.attr( 'disabled', true );
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    //spinner.hide();
                    //btn.attr( 'disabled', false );
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        window.location.reload();
                    }
                } );
            },
            cancelUpdate: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        parent = self.closest( '.cpm-milestone' ),
                        spinner = parent.find( '.cpm-milestones-spinner' ),
                        id = self.data( 'milestone_id' );
                spinner.removeClass( 'cpm-milestones-spinner' );
                parent.find( '.cpm-milestone-edit-form' ).hide().prev( '.milestone-detail' ).fadeIn();
            },
            ajaxRequest: function( action ) {
                var that = $( this ),
                        data = {
                            milestone_id: that.data( 'id' ),
                            project_id: that.data( 'project' ),
                            action: action,
                            '_wpnonce': CPM_Vars.nonce
                        };
                that.addClass( 'cpm-milestones-spinner' );
                $.post( CPM_Vars.ajaxurl, data, function( response ) {
                    location.reload();
                } );
            }
        },
        Uploader: {
            deleteFile: function( e ) {
                e.preventDefault();
                if ( confirm( 'This file will be deleted permanently' ) ) {
                    var that = $( this ),
                            data = {
                                file_id: that.data( 'id' ),
                                action: 'cpm_delete_file',
                                '_wpnonce': CPM_Vars.nonce
                            };
                    $.post( CPM_Vars.ajaxurl, data, function() {} );
                    that.closest( '.cpm-uploaded-item' ).fadeOut( function() {
                        $( this ).remove();
                    } );
                }
            }
        },
        Comment: {
            addNew: function() {
                var that = $( this ),
                        btn = that.find( 'input[name=cpm_new_comment]' ),
                        spnier = that.find( '.cpm-loading' ),
                        data = that.serialize() + '&_wpnonce=' + CPM_Vars.nonce + '&feature=' + 'old';
                var form = $( this ),
                        text = $.trim( form.find( 'input[name=cpm_message]' ).val() );

                if ( text.length < 1 ) {
                    alert( 'Please enter some text' );
                    return false;
                }

                btn.attr( 'disabled', true );
                spnier.show();
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    btn.attr( 'disabled', false );
                    spnier.hide();

                    res = JSON.parse( res );
                    
                    if ( res.success ) {
                        $( '.cpm-comment-wrap' ).append( res.content ).fadeIn( 'slow' );
                        $( '.cpm-comment-form-wrap textarea' ).val( '' );
                        $( '.cpm-comment-form-wrap input[type=checkbox]' ).attr( 'checked', false );
                        $( '.cpm-comment-form-wrap #cpm-comment-editor-cm' ).val( '' );
                        $( '.cpm-comment-form-wrap .cpm-upload-filelist' ).html( '' );
                        $( '.cpm-comment-form-wrap trix-editor *' ).html( '' );
                    }
                    $( '.cpm-colorbox-img' ).prettyPhoto();

                } );
            },
            get: function( e ) {
                e.preventDefault();
                var that = $( this ),
                        parent = that.closest( '.cpm-comment' ),
                        data = {
                            comment_id: that.data( 'comment_id' ),
                            project_id: that.data( 'project_id' ),
                            object_id: that.data( 'object_id' ),
                            action: 'cpm_comment_get',
                            '_wpnonce': CPM_Vars.nonce,
                            'feature' : 'old'
                        };
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    res = $.parseJSON( res );
                    if ( res.success && parent.find( 'form' ).length === 0 ) {

                        parent.find( '.cpm-comment-content' ).hide();
                        parent.find( '.cpm-comment-edit-form' ).hide().html( res.form ).fadeIn();
                        //re-initialize the uploader
                        new CPM_Uploader_Old( 'cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id );

                    }
                } );
            },
            cancelCommentEdit: function( e ) {
                e.preventDefault();
                var that = $( this ),
                        id = that.data( 'comment_id' );
                that.parents( '.cpm-comment' ).find( '.cpm-comment-content' ).fadeIn();
                that.closest( '.cpm-comment-edit-form' ).html( '' );
            },
            update: function( e ) {
                e.preventDefault();

                var form = $( this ),
                        btn = form.find( 'input[name=cpm_new_comment]' ),
                        spnier = form.find( '.cpm-loading' ),
                        container = form.closest( '.cpm-comment-container' ),
                        data = form.serialize() + '&_wpnonce=' + CPM_Vars.nonce + '&feature=' + 'old';
                        text = $.trim( form.find( 'input[name=cpm_message]' ).val() );

                if ( text.length < 1 ) {
                    alert( 'Please enter some text' );
                    return false;
                }


                btn.attr( 'disabled', true );
                spnier.show();
                $.post( CPM_Vars.ajaxurl, data, function( res ) {

                    btn.attr( 'disabled', false );
                    spnier.hide();
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        container.find( '.cpm-comment-content' ).html( res.content ).fadeIn();
                        form.parent().remove();
                        $( '.cpm-comment-form-wrap input[type=checkbox]' ).attr( 'checked', false )
                        $( '.cpm-comment-form-wrap .cpm-upload-filelist' ).html( '' );
                        $( '.cpm-comment-form-wrap #cpm-comment-editor-cm' ).val( '' );
                        $( '.cpm-comment-form-wrap trix-editor *' ).html( '' );
                    }
                    $( '.cpm-colorbox-img' ).prettyPhoto();
                } );
            },
            deleteComment: function( e ) {
                e.preventDefault();

                var self = $( this ),
                        confirmMsg = self.data( 'confirm' ),
                        data = {
                            comment_id: self.data( 'id' ),
                            project_id: self.data( 'project_id' ),
                            action: 'cpm_comment_delete_old',
                            '_wpnonce': CPM_Vars.nonce,
                            'feature' : 'old'
                        };
                if ( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }

                if ( confirm( confirmMsg ) ) {
                    self.addClass( 'cpm-comment-spinner' );
                    self.attr( 'disabled', 'disabled' );
                    $.post( CPM_Vars.ajaxurl, data, function( res ) {

                        self.removeClass( 'cpm-comment-spinner' );
                        self.removeAttr( 'disabled' );
                        res = $.parseJSON( res );
                        if ( res.success ) {
                            self.closest( 'li' ).fadeOut( function() {
                                $( this ).remove();
                            } );
                        }
                    } );
                }
            }
        },
        Message: {
            show: function( e ) {
                e.preventDefault();
                $( '#cpm-new-message-form-content' ).html( '' );
                $( '#cpm-signle-message' ).slideUp();
                $( '.cpm-new-message-form' ).slideDown(400, function(){
                    uploadernd.uploader.refresh();
                });
                $( '#cpm-new-message-form-content' ).hide();
            },
            showasblank: function( e ) {
                e.preventDefault();
                $( '.cpm-new-message-form' ).slideDown(400, function(){
                    uploadernd.uploader.refresh();
                });
            },
            hide: function( e ) {
                e.preventDefault();
                new CPM_Uploader_Old( 'cpm-upload-pickfiles-0', 'cpm-upload-container-0' );
                $( '.cpm-new-message-form' ).slideUp();
            },
            addNew: function( e ) {
                //e.preventDefault();
                text = $( "#message_title" ).val();
                if ( text.length < 1 ) {
                    alert( 'Please enter some text' );
                    return false;
                }

                var form = $( ".cpm-message-form" ),
                        data = form.serialize(),
                        btn = form.find( 'input[name=create_message]' ),
                        spnier = form.find( '.cpm-loading' );
                spnier.show();
                $.post( CPM_Vars.ajaxurl, data, function( res ) {

                    btn.attr( 'disabled', false );
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        var url = res.url;
                        // history.pushState(null, null, url ) ;
                        window.location.href = url;
                        var data = {
                            message_id: res.id,
                            project_id: res.project_id,
                            action: 'cpm_show_discussion',
                            '_wpnonce': CPM_Vars.nonce
                        };
                        $.post( CPM_Vars.ajaxurl, data, function( res ) {
                            res = $.parseJSON( res );
                            if ( res.success ) {

                                //window.location.reload();
                                /*
                                 $("#cpm-signle-message").html(res.content);
                                 $('#cpm-signle-message').show();
                                 location.hash = "#" + res.id;

                                 $('.cpm-new-message-form').fadeOut('slow');
                                 $('.cpm-new-message-form input[type=text], .cpm-new-message-form input[type=checkbox]').val('');
                                 $('.cpm-new-message-form .cpm-upload-filelist').html('');
                                 $('trix-editor div').html('');
                                 */
                                showderror();

                            }
                            $( '.cpm-colorbox-img' ).prettyPhoto();
                            spnier.hide();
                        } );

                    }

                    $( '.cpm-loading' ).remove();
                } );
                return false;
            },
            update: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        btn = self.find( 'input[name=create_message]' ),
                        spnier = self.find( '.cpm-loading' ),
                        parent = self.closest( '.cpm-single' ),
                        data = self.serialize();
                btn.attr( 'disabled', true );
                spnier.show();
                $.post( CPM_Vars.ajaxurl, data, function( res ) {

                    btn.attr( 'disabled', false );
                    spnier.hide();
                    res = $.parseJSON( res );
                    if ( res.success ) {
                        var data = {
                            message_id: res.id,
                            project_id: res.project_id,
                            action: 'cpm_show_discussion',
                            '_wpnonce': CPM_Vars.nonce
                        };
                        $.post( CPM_Vars.ajaxurl, data, function( res ) {
                            res = $.parseJSON( res );
                            if ( res.success ) {
                                var did = res.id;

                                $( "#cpm-signle-message" ).html( res.content );
                                $( '#cpm-signle-message' ).show();
                                location.hash = "#" + res.id;
                            }
                            $( '.cpm-colorbox-img' ).prettyPhoto();
                            spnier.hide();
                        } );

                    }
                    $( '.cpm-colorbox-img' ).prettyPhoto();
                    $( '.cpm-loading' ).remove();
                } );
            },
            showDiscussion: function( e ) {
                // e.preventDefault();
                var url = $( this ).attr( 'itemref' );
                window.open( url, "_self" );
            },
            get: function( e ) {
                e.preventDefault();
                var self = $( this );
                if ( self.attr( 'disabled' ) == 'disabled' ) {
                    return false;
                }

                var parent = self.closest( '.cpm-single' ),
                        data = {
                            message_id: self.data( 'msg_id' ),
                            project_id: self.data( 'project_id' ),
                            action: 'cpm_message_get',
                            '_wpnonce': CPM_Vars.nonce
                        };
                self.addClass( 'cpm-single-spinner' );
                self.attr( 'disabled', true );
                $.post( CPM_Vars.ajaxurl, data, function( res ) {
                    self.removeClass( 'cpm-single-spinner' );
                    self.attr( 'disabled', false );
                    res = $.parseJSON( res );
                    if ( res.success ) {

                        parent.find( '.cpm-entry-detail' ).hide().next( '.cpm-msg-edit-form' ).hide().html( res.content ).fadeIn();
                        //re-initialize the uploader
                        new CPM_Uploader_Old( 'cpm-upload-pickfiles-' + res.id, 'cpm-upload-container-' + res.id );

                    }
                } );
            },
            hideEditForm: function( e ) {
                e.preventDefault();

                var parent = $( this ).closest( '.cpm-single' );
                parent.find( '.cpm-entry-detail' ).fadeIn().next( '.cpm-msg-edit-form' ).fadeOut( function() {
                    $( this ).html( '' );
                } );
            },
            remove: function( e ) {
                e.preventDefault();
                var self = $( this ),
                        data = {
                            message_id: self.data( 'msg_id' ),
                            project_id: self.data( 'project_id' ),
                            is_admin: CPM_Vars.is_admin,
                            action: 'cpm_message_delete',
                            '_wpnonce': CPM_Vars.nonce
                        };
                if ( confirm( self.data( 'confirm' ) ) ) {
                    self.css( 'opacity', '1' ).addClass( 'cpm-messages-spinner' );
                    $.post( CPM_Vars.ajaxurl, data, function( res ) {

                        res = $.parseJSON( res );
                        if ( res.success ) {
                            //  window.location.href = res.url;

                            var li = $( ".dicussion-list li" ).length;
                            if ( li == 1 )
                            {
                                window.location.reload();
                            } else {
                                self.closest( "li" ).remove();
                                showderror();
                            }

                        }
                    } );
                }
            }
        }
    };

    //dom ready
    $( function() {
        var cpm_abort;
        weDevs_CPM.init();
        showderror();

        $( '.cpm-colorbox-img' ).prettyPhoto();
        $( ".chosen-select" ).chosen( {
            width: '300px'
        } );
        $( '.cpm-timetraker' ).on( 'click', function() {
            $( this ).runner( 'start' );
        } );
        $( ".datepicker" ).datepicker( {
            dateFormat: 'yy-mm-dd',
        } );
        $( ".date_picker_from" ).datepicker( {
            dateFormat: 'yy-mm-dd',
            changeYear: true,
            changeMonth: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {

                $( ".date_picker_to" ).datepicker( "option", "minDate", selectedDate );
            }
        } );
        $( ".date_picker_to" ).datepicker( {
            dateFormat: 'yy-mm-dd',
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            onClose: function( selectedDate ) {
                $( ".date_picker_from" ).datepicker( "option", "maxDate", selectedDate );
            }
        } );
        if ( $( '#cpm-all-search' ).length || $( '#cpm-single-project-search' ).length ) {
            cpm_all_sinle_project_search();
        }

        function cpm_all_sinle_project_search() {
            $( "#cpm-all-search, #cpm-single-project-search" ).autocomplete( {
                minLength: 1,
                source: function( request, response ) {
                    var self = this.element;
                    var data = {
                        action: 'all_search',
                        item: request.term,
                        project_id: self.data( 'project_id' ),
                        is_admin: CPM_Vars.is_admin
                    };
                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort = $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if ( resp.success ) {
                            var nme = eval( resp.data );
                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    } );
                },
                select: function( event, ui ) {
                    $( this ).val( "" );
                    return false;
                }
            } ).data( "ui-autocomplete" )._renderItem = function( ul, item ) {

                return $( "<li>" )
                        .append( item.label )
                        .appendTo( ul );
            };
        }



        if ( $( "#cpm-search-client" ).length ) {
            cpm_project_search_by_client();
        }

        function cpm_project_search_by_client() {
            $( "#cpm-search-client" ).autocomplete( {
                minLength: 1,
                source: function( request, response ) {
                    var self = this.element,
                            data = {
                                action: 'search_client',
                                user: request.term,
                                is_admin: CPM_Vars.is_admin
                            };
                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort = $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if ( resp.success ) {
                            var nme = eval( resp.data );
                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    } );
                },
                select: function( event, ui ) {
                    $( this ).val( "" );
                    return false;
                }
            } ).data( "ui-autocomplete" )._renderItem = function( ul, item ) {

                return $( "<li>" )
                        .append( item.label )
                        .appendTo( ul );
            };
        }

        if ( $( ".cpm-project-coworker" ).length ) {
            cpm_coworker_search()
        }

        function cpm_coworker_search() {

            $( ".cpm-project-coworker" ).autocomplete( {
                minLength: 3,
                source: function( request, response ) {
                    var data = {
                        action: 'cpm_user_autocomplete',
                        term: request.term
                    };
                    if ( cpm_abort ) {
                        cpm_abort.abort();
                    }

                    cpm_abort = $.post( CPM_Vars.ajaxurl, data, function( resp ) {

                        if ( resp.success ) {
                            var nme = eval( resp.data );
                            response( eval( resp.data ) );
                        } else {
                            response( '' );
                        }

                    } );
                },
                search: function() {
                    $( this ).addClass( 'cpm-spinner' );
                },
                open: function() {
                    var self = $( this );
                    self.autocomplete( 'widget' ).css( 'z-index', 9999 );
                    self.removeClass( 'cpm-spinner' );
                    return false;
                },
                select: function( event, ui ) {
                    if ( ui.item.value == 'cpm_create_user' ) {
                        $( "form.cpm-user-create-form" ).find( 'input[type=text]' ).val( '' );
                        $( "#cpm-create-user-wrap" ).dialog( "open" );
                    } else {
                        $( '.cpm-project-role>table' ).append( ui.item._user_meta );
                        $( "input.cpm-project-coworker" ).val( '' );
                    }
                    return false;
                }
            } ).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li>" )
                        .append( "<a>" + item.label + "</a>" )
                        .appendTo( ul );
            };
        }

        $( '.cpm-project-form' ).on( 'click', '.cpm-project-role .cpm-del-proj-role', function() {
            $( this ).closest( 'tr' ).remove();
        } );
    } );
    window.uploadernd = new CPM_Uploader_Old( 'cpm-upload-pickfiles-nd', 'cpm-upload-container-nd' );
    window.uploadercm = new CPM_Uploader_Old( 'cpm-upload-pickfiles-cm', 'cpm-upload-container-cm' );
    window.uploadercd = new CPM_Uploader_Old( 'cpm-upload-pickfiles-cd', 'cpm-upload-container-cd' );

    function  showderror() {

        var li = $( ".dicussion-list li" ).length;
        if ( li == 0 )
        {
            $( ".cpm-blank-template.discussion" ).show( '500' );
            $( ".3discussion-page" ).hide();
        } else {
            $( ".discussion-page" ).show();
            $( ".3cpm-blank-template.discussion" ).hide();
        }
    }

    $( ".hasDatepicker" ).datepicker( {
        dateFormat: 'yy-mm-dd'
    } );

    function dateFormat( date, format ) {
        date = new Date( date );
        var month = ( "0" + ( date.getMonth() + 1 ) ).slice( -2 ),
                day = ( "0" + date.getDate() ).slice( -2 ),
                year = date.getFullYear(),
                monthArray = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                monthShortArray = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec" ],
                monthName = monthArray[date.getMonth()],
                monthShortName = monthShortArray[date.getMonth()];

        var pattern = {
            Y: year,
            m: month,
            F: monthName,
            M: monthShortName,
            d: day,
            j: day
        };

        var dateStr = format.replace( /Y|m|d|j|M|F/gi, function( matched ) {
            return pattern[matched];
        } );

        return dateStr;
    }

} )( jQuery );

