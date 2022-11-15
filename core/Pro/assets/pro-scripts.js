;( function($) {
    $( '.button-upgrade-to-pro' ).on( 'click', function () {
        let popupWindow = $( '.pm-popup-window' );
        // append the popup window to the body for styling
        $( 'body' ).css( 'position', 'relative' );
        $( 'body' ).append( popupWindow );
        $( '.pm-popup-window' ).addClass( 'state-show' );
    } );

    $( '.popup-close-button' ).on( 'click', function () {
        closePopUp();
    } );

    // Init swiffyslider.
    $( window ).on( 'load', function () {
        swiffyslider.initSlider( document.getElementById( 'pm-slider' ) );
    } );

    // Show the overlay on hovering over to each modules.
    // $( '.pm-wrap.module-list-area .plugin-card' ).on( 'mouseover', function () {
    //     let overlay = $( '.form-create-overlay' );
    //     overlay.appendTo( this );
    // } );

    $( '#pm-upgrade-popup' ).on( 'click', function( e ) {
        let modal = $( '.modal-window' );

        // clicking outside the popup modal
        if ( ! modal.is( e.target ) && modal.has( e.target ).length === 0) {
            closePopUp();
        }
    } );

    // close the 'upgrade to pro' popup on the module page
    function closePopUp() {
        $( '.pm-popup-window' ).removeClass( 'state-show' );
        $( 'body' ).css( 'position', 'initial' );
    }
})(jQuery);
