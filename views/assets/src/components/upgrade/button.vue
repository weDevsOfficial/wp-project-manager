<template>
  <a href="#pm-upgrade-popup" @click.prevent="showPopup" class="pro-button button-upgrade-to-pro">
    {{ __( 'Upgrade to PRO ', 'wedevs-project-manager' ) }}
    <svg class="crown-icon" xmlns="http://www.w3.org/2000/svg" width="20" fill="#fff" height="15" xmlns:v="https://vecta.io/nano">
      <path d="M19.213 4.116c.003.054-.001.108-.015.162l-1.234 6.255a.56.56 0 0 1-.541.413l-7.402.036h-.003-7.402c-.257 0-.482-.171-.544-.414L.839 4.295a.53.53 0 0 1-.015-.166C.347 3.983 0 3.548 0 3.036c0-.632.528-1.145 1.178-1.145s1.178.514 1.178 1.145a1.13 1.13 0 0 1-.43.884L3.47 5.434c.39.383.932.602 1.486.602.655 0 1.28-.303 1.673-.81l2.538-3.272c-.213-.207-.345-.494-.345-.809C8.822.514 9.351 0 10 0s1.178.514 1.178 1.145c0 .306-.125.584-.327.79l.002.003 2.52 3.281c.393.512 1.02.818 1.677.818a2.11 2.11 0 0 0 1.481-.597l1.554-1.512c-.268-.21-.44-.531-.44-.892 0-.632.528-1.145 1.177-1.145S20 2.405 20 3.036c0 .498-.329.922-.787 1.079zm-1.369 8.575c0-.301-.251-.545-.561-.545H2.779c-.31 0-.561.244-.561.545V14c0 .301.251.546.561.546h14.505c.31 0 .561-.244.561-.546v-1.309z"/>
    </svg>
  </a>
</template>

<style lang="less" scoped>
  a.pro-button.button-upgrade-to-pro {
    top: 50%;
    left: 50%;
    color: #fff;
    padding: 10px 15px;
    display: flex;
    position: absolute;
    transform: translate(-50%, -50%);
    background: #ff9000;
    min-height: auto;
    font-weight: 600;
    align-items: center;
    border-radius: 5px;

    .crown-icon {
      height: 1.2em;
      margin-left: 10px;
    }

    &:hover {
      background: #CF7500 !important;
    }
  }
</style>

<script>
export default {
  data() {
    return {

    }
  },

  methods: {
    showPopup() {
      let popupWindow = document.querySelector( '.pm-popup-window' );
      // append the popup window to the body for styling
      document.body.style.position = 'relative';
      document.body.append( popupWindow );
      popupWindow.classList.add( 'state-show' );
    },
  }
}
</script>
