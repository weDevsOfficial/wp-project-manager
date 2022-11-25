<template>
  <div class="pm-pro-field-tooltip">
    <i></i>
    <h3 class="tooltip-header">{{ __( 'Available in Pro. Unlock & enjoy:', 'wedevs-project-manager' ) }}</h3>
    <ul>
      <li v-for="( feature, key ) in features" @click.stop>
        <span class="tooltip-check" :key="key">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" fill="#139F84" xmlns:v="https://vecta.io/nano">
            <path fill-rule="evenodd" d="M8.927 1.134c-.33-.33-.865-.33-1.195 0L3.374 5.492 1.897 4.015c-.33-.33-.865-.33-1.195 0s-.33.865 0 1.195l2.075 2.075c.33.33.865.33 1.195 0l4.955-4.955c.33-.33.33-.865 0-1.195zM.992 4.853c.01.012.02.024.031.035l2.075 2.075a.39.39 0 0 0 .552 0l4.955-4.955a.39.39 0 0 0 .031-.517.39.39 0 0 1-.031.517L3.65 6.963a.39.39 0 0 1-.552 0L1.023 4.888c-.011-.011-.022-.023-.031-.035z" />
          </svg>
        </span>
        <span>{{ __( feature, 'wedevs-project-manager' ) }}</span>
      </li>
    </ul>
    <div class="pro-link">
      <a target="_blank" class="pro-button button-upgrade-to-pro"
        href="https://wedevs.com/wp-project-manager-pro/pricing/?utm_source=freeplugin&utm_medium=pm-action-link&utm_campaign=pm-pro-prompt">
        {{ 'Upgrade to PRO', 'wedevs-project-manager' }}
        <svg class="crown-icon pro-icon" xmlns="http://www.w3.org/2000/svg" width="20" fill="#fff" height="15" xmlns:v="https://vecta.io/nano">
          <path d="M19.213 4.116c.003.054-.001.108-.015.162l-1.234 6.255a.56.56 0 0 1-.541.413l-7.402.036h-.003-7.402c-.257 0-.482-.171-.544-.414L.839 4.295a.53.53 0 0 1-.015-.166C.347 3.983 0 3.548 0 3.036c0-.632.528-1.145 1.178-1.145s1.178.514 1.178 1.145a1.13 1.13 0 0 1-.43.884L3.47 5.434c.39.383.932.602 1.486.602.655 0 1.28-.303 1.673-.81l2.538-3.272c-.213-.207-.345-.494-.345-.809C8.822.514 9.351 0 10 0s1.178.514 1.178 1.145c0 .306-.125.584-.327.79l.002.003 2.52 3.281c.393.512 1.02.818 1.677.818a2.11 2.11 0 0 0 1.481-.597l1.554-1.512c-.268-.21-.44-.531-.44-.892 0-.632.528-1.145 1.177-1.145S20 2.405 20 3.036c0 .498-.329.922-.787 1.079zm-1.369 8.575c0-.301-.251-.545-.561-.545H2.779c-.31 0-.561.244-.561.545V14c0 .301.251.546.561.546h14.505c.31 0 .561-.244.561-.546v-1.309z"/>
        </svg>
      </a>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pm-pro-field-tooltip {
  top: 354px;
  left: 50%;
  color: #fff;
  width: 270px;
  opacity: 0;
  padding: 30px 25px;
  z-index: 20000;
  display: none;
  position: absolute;
  transform: translate(-50%, -100%);
  box-sizing: border-box;
  background: #000;
  transition: opacity 0.8s;
  border-radius: 5px;

  h3.tooltip-header {
    color: #fff;
    font-size: 14px;
    line-height: 10px;
    margin: 0px 0 18px;
  }

  ul {
    li {
      display: flex;
      font-size: 14px;
      line-height: 25px;
      font-weight: 400;
      align-items: center;
      white-space: break-spaces;

      .tooltip-check {
        margin-right: 10px;
      }

      span {
        color: #fff;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .pro-link {
    display: flex;
    margin-top: 20px;
    justify-content: center;

    a.pro-button.button-upgrade-to-pro {
      top: 50%;
      color: #fff;
      padding: 8px 18px;
      display: flex;
      background: #ff9000;
      min-height: auto;
      align-items: center;
      border-radius: 5px;

      .crown-icon {
        height: 1em;
        margin-left: 10px;
      }
    }
  }

  i {
    top: -8px;
    left: 50%;
    width: 24px;
    height: 12px;
    overflow: hidden;
    position: absolute;
    margin-left: -12px;

    &:after {
      top: 8px;
      left: 50%;
      width: 12px;
      height: 12px;
      content: '';
      position: absolute;
      transform: translate(-50%, -50%) rotate(45deg);
      background-color: #000;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      features: [
        'Enjoy 10+ premium modules',
        'Advanced reporting filters',
        '24/7 customer support',
        'Real-time project updates',
        'Complete control of user roles & permissions',
      ],
    }
  },

  mounted() {

  },

  methods: {

  },
}
</script>
