<template>
  <div>
    <div class="wpuf-integrations-wrap">
      <div class="wpuf-integrations">
        <slack :slack="slack"></slack>
        <github :github="github"></github>
      </div>
    </div>
  </div>
</template>

<script>
  import Slack from './slack.vue' ;
  import Github from './github-bitbucket.vue';

  export default {
    components: {
      'slack': Slack,
      'github': Github,
    },

    data () {
      return {}
    },
  }
</script>

<style scoped>
    .wpuf-integrations {
        display:flex;
    }
</style>
