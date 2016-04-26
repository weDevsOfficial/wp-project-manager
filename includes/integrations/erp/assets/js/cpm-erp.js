;
( function( $ ) {
    var empTask = {
        init: function() {
            $( '.cpm-my-tasks' ).on( 'click', '#cpm-emp-assign-task', this.newTaskForm );
            $( 'body' ).on( 'change', '#erp-project', this.showTask );
            $( 'body' ).on( 'change', '#erp-employee-task-list-drop', this.showTaskFrom );
        },
        initFields: function() {
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
        },
        showTaskFrom: function( e ) {
            e.preventDefault();

            var self = $( this ),
                    list_id = self.val(),
                    form = $( '#cpm-task-form-' + list_id ).clone();

            if( list_id === '-1' ) {
                $( '.cpm-employee-task-form' ).hide();
                return;
            }
            $( '.cpm-employee-task-form' ).show();
        },
        showTask: function( e ) {
            e.preventDefault();

            var self = $( this ),
                    project_id = self.val(),
                    options = $( '#erp-employee-task-list-drop' );

            options.find( 'option' ).not( ':first' ).remove();

            if( project_id === '-1' ) {
                options.closest( '.erp-employee-task-list-drop' ).hide();
                $( '.cpm-employee-task-form' ).hide();

                return;
            }

            $.each( cpm_attr.project_attr, function( key, project ) {
                if( project_id == project.project_id ) {
                    options.append( new Option( project.list_title, project.list_id, false, false ) );
                }
            } );

            options.closest( '.erp-employee-task-list-drop' ).show();
        },
        newTaskForm: function( e ) {
            e.preventDefault();

            var self = $( this );

            $.erpPopup( {
                title: cpm_attr.popup_title,
                button: cpm_attr.submit,
                id: 'erp-employee-task',
                content: wp.template( 'erp-custom-address' )( { company_id: self.data( 'id' ) } ).trim(),
                extraClass: 'medium',
                onReady: function() {
                    empTask.initFields();
                },
                onSubmit: function( modal ) {
                    var text_field = $( '#task_text' ).val();

                    if( text_field == '' ) {
                        alert( cpm_attr.alert );
                        return;
                    }

                    wp.ajax.send( {
                        data: this.serialize(),
                        success: function( res ) {
                            location.reload();
                        },
                        error: function( error ) {
                            alert( error );
                        }
                    } );
                }
            } );

        }
    }

    empTask.init();
} )( jQuery );