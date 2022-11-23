;( function($) {

    // $( window ).on( 'load', () => {
    //     const contentElement = document.querySelector( '#wpcontent' ),
    //         overlayElement   = document.querySelector( '.pm-content-overlay' );
    //
    //     if ( null === overlayElement ) {
    //         const elemDiv = document.createElement( 'div' ),
    //             promptBtn = `<a href="#pm-upgrade-popup" class="pro-button button-upgrade-to-pro">Upgrade to PRO
    //                 <svg class="crown-icon" xmlns="http://www.w3.org/2000/svg" width="20" fill="#fff" height="15" xmlns:v="https://vecta.io/nano">
    //                     <path d="M19.213 4.116c.003.054-.001.108-.015.162l-1.234 6.255a.56.56 0 0 1-.541.413l-7.402.036h-.003-7.402c-.257 0-.482-.171-.544-.414L.839 4.295a.53.53 0 0 1-.015-.166C.347 3.983 0 3.548 0 3.036c0-.632.528-1.145 1.178-1.145s1.178.514 1.178 1.145a1.13 1.13 0 0 1-.43.884L3.47 5.434c.39.383.932.602 1.486.602.655 0 1.28-.303 1.673-.81l2.538-3.272c-.213-.207-.345-.494-.345-.809C8.822.514 9.351 0 10 0s1.178.514 1.178 1.145c0 .306-.125.584-.327.79l.002.003 2.52 3.281c.393.512 1.02.818 1.677.818a2.11 2.11 0 0 0 1.481-.597l1.554-1.512c-.268-.21-.44-.531-.44-.892 0-.632.528-1.145 1.177-1.145S20 2.405 20 3.036c0 .498-.329.922-.787 1.079zm-1.369 8.575c0-.301-.251-.545-.561-.545H2.779c-.31 0-.561.244-.561.545V14c0 .301.251.546.561.546h14.505c.31 0 .561-.244.561-.546v-1.309z"/>
    //                 </svg>
    //             </a>`;
    //
    //         elemDiv.classList.add( 'pm-content-overlay' );
    //         elemDiv.innerHTML = promptBtn;
    //         contentElement.appendChild( elemDiv );
    //     }
    // });

    $( '.pm-content-overlay' ).on( 'click', '.button-upgrade-to-pro', function () {
        // let popupWindow = $( '.pm-popup-window' );
        // append the popup window to the body for styling
        // $( 'body' ).append( popupWindow );
        // $( 'body' ).css( 'position', 'relative' );
        // $( '.pm-popup-window' ).addClass( 'state-show' );
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


    // show tooltips on crown icons
    // $('.menu-item').on('mouseover', function() {
    //     let tooltip = $( '.pm-pro-field-tooltip' );
    //     let windowWidth = $( window ).width();
    //     let windowHeight = $( window ).height();
    //     let iconBounding = $( this )[0].getBoundingClientRect();
    //     let spaceTop = iconBounding.y;
    //     let iconBoundingRight = iconBounding.right;
    //     let iconBoundingBottom = iconBounding.bottom;
    //     let spaceRight = windowWidth - iconBoundingRight;
    //     let spaceBottom = windowHeight - iconBoundingBottom;
    //     let tooltipHeight = tooltip.outerHeight();
    //     let tooltipWidth = tooltip.outerWidth();
    //
    //     console.log( 'hello world' );
    //
    //     if ( spaceTop > tooltipHeight ) {
    //         $( '.pm-pro-field-tooltip i' ).css( 'left', '50%' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'top', '100%' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'transform', 'initial' );
    //         $( '.pm-pro-field-tooltip' ).css( 'left', '50%' );
    //         $( '.pm-pro-field-tooltip' ).css( 'top', '0' );
    //     } else if ( spaceTop < tooltipHeight && spaceRight > tooltipWidth ) {
    //         $( '.pm-pro-field-tooltip i' ).css( 'left', '-5px' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'top', '22px' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'transform', 'rotate(90deg)' );
    //         $( '.pm-pro-field-tooltip' ).css( 'left', '185px' );
    //         $( '.pm-pro-field-tooltip' ).css( 'top', '310px' );
    //     } else if ( spaceBottom > tooltipHeight ) {
    //         $( '.pm-pro-field-tooltip' ).css( 'left', '10px' );
    //         $( '.pm-pro-field-tooltip' ).css( 'top', '360px' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'top', '-10px' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'left', '150px' );
    //         $( '.pm-pro-field-tooltip i' ).css( 'transform', 'rotate(180deg)' );
    //     }
    //
    //     tooltip.appendTo( this );
    // });
})(jQuery);
