<template>
  <div id="pm-upgrade-popup" class="pm-popup-window" @click="backDrop">
    <div class="modal-window">
      <div class="modal-window-inner">
        <div class="content-area">
          <div class="popup-close-button" @click.prevent="closePopup">
            <img :src="getAssetUrl( 'images/modules/x.svg' )" :alt="__( 'Close Icon', 'wedevs-project-manager' )" />
          </div>
          <div class="pm-popup-header">
            <div class="popup-diamond">
              <img :src="getAssetUrl( 'images/modules/diamond.svg' )" :alt="__( 'Diamond Icon', 'wedevs-project-manager' )" />
              <h2 class="font-orange header-one">{{ __( 'Upgrade to', 'wedevs-project-manager' ) }}</h2>
            </div>
            <h2 class="header-two">
              {{ __( 'WP Project Manager', 'wedevs-project-manager' ) }} 
              <span class="font-bold">{{ __( 'Pro', 'wedevs-project-manager' ) }}</span>
            </h2>
            <h2 class="header-three font-gray">
              {{ __( 'unlock and take advantage of our premium features 🎉', 'wedevs-project-manager' ) }}
            </h2>
          </div>
          <div class="pm-popup-list-area">
            <div class="single-checklist">
              <div class="check-icon">
                <img :src="getAssetUrl( 'images/modules/check.svg' )" :alt="__( 'Check Icon', 'wedevs-project-manager' )" />
              </div>
              <div class="check-list">
                <p>
                  {{ __( 'Give your team & projects additional pace with 10+ premium modules such as -', 'wedevs-project-manager' ) }}
                  <span class="bold font-black">
                    {{ __( 'Stripe Gateway, Time Tracker, Sub Task, Invoice, Kanban Board, Gantt Chart, WooCommerce Order, BuddyPress', 'wedevs-project-manager' ) }}
                  </span> 
                  {{ __( 'etc', 'wedevs-project-manager' ) }}
                </p>
              </div>
            </div>
            <div class="single-checklist">
              <div class="check-icon">
                <img :src="getAssetUrl( 'images/modules/check.svg' )" :alt="__( 'Check Icon', 'wedevs-project-manager' )" />
              </div>
              <div class="check-list">
                <p>
                  {{ __( 'Experience the', 'wedevs-project-manager' ) }} 
                  <span class="bold font-black">{{ __( 'Advanced Files Manager', 'wedevs-project-manager' ) }}</span>
                  {{ __( 'that helps you to', 'wedevs-project-manager' ) }}
                  <span class="bold font-black">{{ __( 'upload, store', 'wedevs-project-manager' ) }}</span>
                  {{ __( 'or', 'wedevs-project-manager' ) }}
                  <span class="bold font-black">{{ __( 'create files, documents, custom fields,', 'wedevs-project-manager' ) }}</span>
                  {{ __( 'and', 'wedevs-project-manager' ) }} 
                  <span class="bold font-black">{{ __( 'images', 'wedevs-project-manager' ) }}</span> 
                  {{ __( 'from one place and keeps you hassle-free', 'wedevs-project-manager' ) }}
                </p>
              </div>
            </div>
            <div class="single-checklist">
              <div class="check-icon">
                <img :src="getAssetUrl( 'images/modules/check.svg' )" :alt="__( 'Check Icon', 'wedevs-project-manager' )" />
              </div>
              <div class="check-list">
                <p>
                  {{ __( 'Get more', 'wedevs-project-manager' ) }} 
                  <span class="bold font-black">{{ __( 'Advanced Reporting, Automatic', 'wedevs-project-manager' ) }}</span>
                  {{ __( 'Daily Digest Mail, and', 'wedevs-project-manager' ) }} 
                  <span class="bold font-black">{{ __( 'Real-Time Updates', 'wedevs-project-manager' ) }}</span>
                </p>
              </div>
            </div>
            <div class="single-checklist">
              <div class="check-icon">
                <img :src="getAssetUrl( 'images/modules/check.svg' )" :alt="__( 'Check Icon', 'wedevs-project-manager' )" />
              </div>
              <div class="check-list">
                <p>
                  <span class="bold font-black">{{ __( 'Collaborate', 'wedevs-project-manager' ) }}</span>
                  {{ __( 'with your team members privately with', 'wedevs-project-manager' ) }}
                  <span class="bold font-black">{{ __( 'Built-in Private Messenger', 'wedevs-project-manager' ) }}</span>
                </p>
              </div>
            </div>
          </div>
          <a target="_blank" class="pro-button button-upgrade-to-pro"
            href="https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=wpdashboard&utm_medium=popup">
            {{ __( 'Upgrade to PRO ', 'wedevs-project-manager' ) }}
            <svg class="crown-icon" xmlns="http://www.w3.org/2000/svg" width="20" fill="#fff" height="15" xmlns:v="https://vecta.io/nano">
              <path d="M19.213 4.116c.003.054-.001.108-.015.162l-1.234 6.255a.56.56 0 0 1-.541.413l-7.402.036h-.003-7.402c-.257 0-.482-.171-.544-.414L.839 4.295a.53.53 0 0 1-.015-.166C.347 3.983 0 3.548 0 3.036c0-.632.528-1.145 1.178-1.145s1.178.514 1.178 1.145a1.13 1.13 0 0 1-.43.884L3.47 5.434c.39.383.932.602 1.486.602.655 0 1.28-.303 1.673-.81l2.538-3.272c-.213-.207-.345-.494-.345-.809C8.822.514 9.351 0 10 0s1.178.514 1.178 1.145c0 .306-.125.584-.327.79l.002.003 2.52 3.281c.393.512 1.02.818 1.677.818a2.11 2.11 0 0 0 1.481-.597l1.554-1.512c-.268-.21-.44-.531-.44-.892 0-.632.528-1.145 1.177-1.145S20 2.405 20 3.036c0 .498-.329.922-.787 1.079zm-1.369 8.575c0-.301-.251-.545-.561-.545H2.779c-.31 0-.561.244-.561.545V14c0 .301.251.546.561.546h14.505c.31 0 .561-.244.561-.546v-1.309z"/>
            </svg>
          </a>
        </div>
        <div class="slider-area">
          <div class="pm-slider slider-indicators-outside slider-indicators-round slider-nav-mousedrag slider-nav-autoplay slider-nav-autopause" id="pm-slider">
            <div class="swiffy-slider">
              <ul class="slider-container">
                <li><img :src="getAssetUrl( 'images/modules/popup-slider/slider-1.jpg' )"></li>
                <li><img :src="getAssetUrl( 'images/modules/popup-slider/slider-2.jpg' )"></li>
                <li><img :src="getAssetUrl( 'images/modules/popup-slider/slider-3.jpg' )"></li>
                <li><img :src="getAssetUrl( 'images/modules/popup-slider/slider-4.jpg' )"></li>
              </ul>

              <div class="slider-indicators">
                <button class="active"></button>
                <button></button>
                <button></button>
                <button></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <div class="footer-feature">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" xmlns:v="https://vecta.io/nano">
              <path fill-rule="evenodd" fill="#139F84" d="M8.927 1.134c-.33-.33-.865-.33-1.195 0L3.374 5.492 1.897 4.015c-.33-.33-.865-.33-1.195 0s-.33.865 0 1.195l2.075 2.075c.33.33.865.33 1.195 0l4.955-4.955c.33-.33.33-.865 0-1.195zM.992 4.853c.01.012.02.024.031.035l2.075 2.075a.39.39 0 0 0 .552 0l4.955-4.955a.39.39 0 0 0 .031-.517.39.39 0 0 1-.031.517L3.65 6.963a.39.39 0 0 1-.552 0L1.023 4.888c-.011-.011-.022-.023-.031-.035z"/>
            </svg>
            {{ __( '10,000+ successful businesses', 'wedevs-project-manager' ) }}
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" xmlns:v="https://vecta.io/nano">
              <path fill-rule="evenodd"
                d="M8.927 1.134c-.33-.33-.865-.33-1.195 0L3.374 5.492 1.897 4.015c-.33-.33-.865-.33-1.195 0s-.33.865 0 1.195l2.075 2.075c.33.33.865.33 1.195 0l4.955-4.955c.33-.33.33-.865 0-1.195zM.992 4.853c.01.012.02.024.031.035l2.075 2.075a.39.39 0 0 0 .552 0l4.955-4.955a.39.39 0 0 0 .031-.517.39.39 0 0 1-.031.517L3.65 6.963a.39.39 0 0 1-.552 0L1.023 4.888c-.011-.011-.022-.023-.031-.035z"
                fill="#139F84"/>
            </svg>
            {{ __( '14 days no questions asked refund policy', 'wedevs-project-manager' ) }}
          </p>
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" xmlns:v="https://vecta.io/nano">
              <path fill-rule="evenodd"
                d="M8.927 1.134c-.33-.33-.865-.33-1.195 0L3.374 5.492 1.897 4.015c-.33-.33-.865-.33-1.195 0s-.33.865 0 1.195l2.075 2.075c.33.33.865.33 1.195 0l4.955-4.955c.33-.33.33-.865 0-1.195zM.992 4.853c.01.012.02.024.031.035l2.075 2.075a.39.39 0 0 0 .552 0l4.955-4.955a.39.39 0 0 0 .031-.517.39.39 0 0 1-.031.517L3.65 6.963a.39.39 0 0 1-.552 0L1.023 4.888c-.011-.011-.022-.023-.031-.035z"
                fill="#139F84"/>
            </svg>
            {{ __( 'Industry leading 24x7 support', 'wedevs-project-manager' ) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.font-gray {
  color: #656668;
}

.font-bold {
  font-weight: bold;
}

.header-one {
  font-size: 30px;
  font-weight: 500;
}

.font-black {
  color: #000;
}

.header-two {
  font-size: 30px;
  font-weight: 400;
}

.font-orange {
  color: #ff9000;
}

.header-three {
  font-size: 20px;
  font-weight: 400;
}

.modal-window h2 {
  margin: 0;
  padding: 0;
  line-height: 1.6em;
}

.pm-toggle-switch {
  width: 50px;
  height: 26px;
  display: inline-block;
  position: relative;
}

.pm-toggle-switch input {
  display: none;
}

.pm-toggle-switch .slider {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  position: absolute;
  transition: .4s;
  background-color: #ccc;
  -webkit-transition: .4s;
}

.pm-toggle-switch .slider:before {
  left: 3px;
  width: 18px;
  bottom: 4px;
  height: 18px;
  content: "";
  position: absolute;
  transition: .4s;
  background-color: white;
  -webkit-transition: .4s;
}

.pm-toggle-switch input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

.pm-toggle-switch input:checked + .slider {
  background-color: #0073aa;
}

.pm-toggle-switch input:checked + .slider:before {
  transform: translateX(26px);
  -ms-transform: translateX(26px);
  -webkit-transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.pm-popup-window {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  z-index: 9999; /* to display over WP admin menu */
  position: fixed;
  background: rgba(0, 0, 0, .5);
}

.pm-popup-window.state-show {
  display: block;
}

.pm-popup-window .content-area .pm-popup-header {
    margin-bottom: 22px;
}

ul.slider-container li img {
  height: auto;
  max-width: 100%;
}

.modal-window {
  top: 50%;
  left: 50%;
  width: 55%;
  padding: 30px 80px 30px;
  position: fixed;
  transform: translate(-50%, -50%);
  background: #fff;
  line-height: initial;
  border-radius: 5px;
}

.modal-window-inner {
  margin: 0 auto;
  display: grid;
  align-items: end;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
}

.modal-window a.pro-button.button-upgrade-to-pro {
  color: #fff;
  padding: 10px 15px;
  background: #ff9000;
  min-height: auto;
  border-radius: 5px;
}

.modal-window-inner a.pro-button.button-upgrade-to-pro:hover {
  background: #d07805;
}

.popup-close-button {
  top: 25px;
  right: 25px;
  cursor: pointer;
  display: block;
  padding: 10px;
  opacity: .4;
  position: absolute;
  transition: .4s;
  -webkit-transition: .4s;
}

.popup-close-button:hover {
  opacity: 1;
}

.popup-diamond {
  display: flex;
  align-items: center;
}

.popup-diamond img {
  padding: 6px;
  background: linear-gradient(220.03deg, #FFF3DD 39.57%, #FFE3AD 97.5%);
  border-radius: 5px;
}

.popup-diamond h2 {
  margin-left: 12px;
  font-weight: 600;
}

.pm-popup-list-area {
  margin-bottom: 60px;
}

.modal-window span.pro-icon {
  margin-left: 5px;
}

.single-checklist {
  display: flex;
}

.single-checklist p,
.modal-window .header-three {
  color: #656668;
  margin-bottom: 2px;
  padding-right: 32px;
}

.single-checklist p span.bold {
  font-weight: 500;
}

.check-icon {
  margin: 1em 14px 0 0;
}

.check-icon img {
  padding: 6px 5px;
  background: #139F84;
  border-radius: 20px;
}

.modal-window a.pro-button.button-upgrade-to-pro {
  text-decoration: none;
  padding: 15px 30px;
}

.slider-area {
  margin-left: 10px;
  overflow: hidden;
  text-align: center;
}

.slider-area .single-slider img {
  width: 100%;
}

#pm-slider .slider-indicators {
  position: initial;
}

.slider-indicators button {
  filter: invert(94%) sepia(8%) saturate(249%) hue-rotate(178deg) brightness(99%) contrast(84%);
}

.slider-indicators button.active {
  filter: invert(62%) sepia(30%) saturate(1208%) hue-rotate(119deg) brightness(92%) contrast(80%);
}

.footer-feature {
  display: flex;
  justify-content: space-between;
  margin-top: 35px;
}

.footer-feature p svg {
  margin-right: 10px;
}
</style>

<script>
export default {
  data() {
    return {

    }
  },

  mounted() {
    swiffyslider.initSlider( document.getElementById( 'pm-slider' ) );
  },

  methods: {
    backDrop( e ) {
      const modal = document.querySelector( '.modal-window' );
      // clicking outside the popup modal
      if ( ! modal.contains( e.target ) ) {
        this.closePopup();
      }
    },

    closePopup() {
      const popup       = document.querySelector( '.pm-popup-window' ),
        firstIndicator  = document.querySelector( '.pm-popup-window .slider-indicators button:first-child' ),
        activeIndicator = document.querySelector( '.pm-popup-window .slider-indicators button.active' );

      popup.classList.remove( 'state-show' );
      activeIndicator.classList.remove( 'active' );
      firstIndicator.classList.add( 'active' );
    },
  },
}
</script>
