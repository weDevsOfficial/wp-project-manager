;
( function( $ ) {
    var report = {
        init: function() {
            $( '#cpm-report' ).on( 'change', '.cpm-report-action', this.reportAction );
            $( '#cpm-report' ).on( 'click', '.cpm-report-more', this.reportAddmore );
            $( '#cpm-report' ).on( 'click', '.cpm-report-cross', this.cross );
            $( '#cpm-report' ).on( 'click', '.cpm-report-cross', this.showAdvanceSearch );
            //this.datepickerAction();
            this.datepicker()
        },
        datepickerAction: function() {
            $( '.cpm-projects-from' ).addClass( 'date-picker-from' );
            $( '.cpm-projects-to' ).addClass( 'date-picker-to' );
            report.datepicker();
        },
        search: function( e ) {
            e.preventDefault();

            var self = $( this ),
                    data = {
                        action: 'cpm_project_reports',
                        _nonce: CPM_Vars.nonce,
                        data: self.serialize()
                    };

            $.post( CPM_Vars.ajaxurl, data, function( res ) {
                if ( res.success ) {
                    $( '#cpm-report-table-wrap' ).html( res.data.table );
                }
            } );
        },
        cross: function() {
            var self = $( this );
            self.closest( '.cpm-action-parent' ).remove();
        },
        reportAddmore: function() {
            var self = $( this );
            report.actionDropdown( self );
        },
        actionDropdown: function( $this ) {
            var action = $( '#cpm-report .cpm-report-content' ).find( '.cpm-report-action-wrap' );

            if ( action.length > 3 ) {
                alert( CPM_Vars.message.report_total_frm_field_limit );
                return;
            }
            var action_dropdown = $( '#cpm-report-action-wrap' ).find( '.cpm-action-parent' ).clone(),
                    wrap = $this.closest( '.cpm-action-parent' );

            wrap.after( action_dropdown );
            $( '.cpm-report-content' ).find( '.cpm-report-action-wrap' ).show()
        },
        reportAction: function() {
            var self = $( this ),
                    action = self.val();

            switch ( action ) {
                case 'project':
                    report.project( self );
                    break;

                case 'co-worker':
                    report.coWorker( self );
                    break;

                case 'status':
                    report.actionStatus( self );
                    break;

                case 'time':
                    report.actionTime( self );
                    break;

                case '-1':
                    report.actionReset( self );
                    break;
            }
        },
        actionReset: function( $this ) {
            $this.closest( 'label' ).siblings( 'div' ).remove();
        },
        project: function( $this ) {
            if ( $( '#cpm-report-form' ).find( '.cpm-report-projects-wrap' ).length ) {
                $this.find( 'option[value="-1"]' ).attr( 'selected', 'selected' );
                alert( CPM_Vars.message.report_frm_field_limit );
                return;
            }
            ;

            report.actionReset( $this );

            var clone = $( '#cpm-report-projects-wrap' ).find( '.cpm-report-projects-wrap' ).clone();
            $this.closest( '.cpm-report-action-wrap' ).find( '.cpm-clear' ).before( clone.show() );
        },
        coWorker: function( $this ) {
            if ( $( '#cpm-report-form' ).find( '.cpm-report-co-worker-wrap' ).length ) {
                $this.find( 'option[value="-1"]' ).attr( 'selected', 'selected' );
                alert( CPM_Vars.message.report_frm_field_limit );
                return;
            }
            ;

            report.actionReset( $this );

            var clone = $( '#cpm-report-co-worker-wrap' ).find( '.cpm-report-co-worker-wrap' ).clone();
            $this.closest( '.cpm-report-action-wrap' ).find( '.cpm-clear' ).before( clone.show() );
        },
        actionStatus: function( $this ) {
            if ( $( '#cpm-report-form' ).find( '.cpm-report-status-wrap' ).length ) {
                $this.find( 'option[value="-1"]' ).attr( 'selected', 'selected' );
                alert( CPM_Vars.message.report_frm_field_limit );
                return;
            }
            ;

            report.actionReset( $this );

            var clone = $( '#cpm-report-status-wrap' ).find( '.cpm-report-status-wrap' ).clone();
            $this.closest( '.cpm-report-action-wrap' ).find( '.cpm-clear' ).before( clone.show() );
        },
        actionTime: function( $this ) {
            if ( $( '#cpm-report-form' ).find( '.cpm-report-time-wrap' ).length ) {
                $this.find( 'option[value="-1"]' ).attr( 'selected', 'selected' );
                alert( CPM_Vars.message.report_frm_field_limit );
                return;
            }
            ;

            report.actionReset( $this );

            var clone = $( '#cpm-report-time-wrap' ).find( '.cpm-report-time-wrap' ).clone();
            $( clone ).find( '.cpm-report-from' ).addClass( 'date-picker-from' );
            $( clone ).find( '.cpm-report-to' ).addClass( 'date-picker-to' );
            $this.closest( '.cpm-report-action-wrap' ).find( '.cpm-clear' ).before( clone.show() );
            report.datepicker();
        },
        datepicker: function() {
            $( '.date-picker-from' ).datepicker( {
                dateFormat: 'yy-mm-dd',
                changeYear: true,
                changeMonth: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".date-picker-to" ).datepicker( "option", "minDate", selectedDate );
                }
            } );

            $( ".date-picker-to" ).datepicker( {
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                numberOfMonths: 1,
                onClose: function( selectedDate ) {
                    $( ".date-picker-from" ).datepicker( "option", "maxDate", selectedDate );
                }
            } );
        }
    }
    report.init();



} )( jQuery );
