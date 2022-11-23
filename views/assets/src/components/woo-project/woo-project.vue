<template>
  <div class="pm-page woo-project pm-woo-project pm-module" @mouseenter="addPromptsOverlay" @mouseleave="removePromptsOverlay">
    <div id="icon-themes" class="icon32"><br/></div>
    <h2 style="display: none"></h2>
    <div class="woo-project-outer">
      <div class="order-placement">{{ __( 'After Product Order Placement', 'wedevs-project-manager' ) }}</div>
      <div class="pm-wp-repeat pm-row">
        <div class="wcp-option-inner">
          <div class="wcp-option-inner">
            <div class="pm-wp-product pm-col-3">
              <strong> {{ __( 'Order Products', 'wedevs-project-manager' ) }} </strong>
              <div tabindex="-1" class="multiselect">
                <div class="multiselect__select"></div>
                <div class="multiselect__tags">
                  <div class="multiselect__tags-wrap" style="display: none;"></div>
                  <div class="multiselect__spinner" style="display: none;"></div>
                  <input name="" type="text" autocomplete="off" placeholder="Search Product" tabindex="0" class="multiselect__input" style="display: none;">
                  <span>
                    <span class="multiselect__single">{{ __( 'Search Product', 'wedevs-project-manager' ) }}</span>
                  </span>
                </div>
                <div class="multiselect__content-wrapper" style="max-height: 300px; display: none;">
                  <ul class="multiselect__content" style="display: block;">
                    <li style="display: none;">
                      <span class="multiselect__option">
                        <span>{{ __( 'Oops! No product found. Consider changing the search query.', 'wedevs-project-manager' ) }}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="pm-wp-action pm-col-2" style="margin-left: 20px;">
            <strong> {{ __( 'Project', 'wedevs-project-manager' ) }}  </strong>
            <ul>
              <li><label><input type="radio" value="create" checked="checked"> {{ __( 'Create', 'wedevs-project-manager' ) }}</label></li>
              <li><label><input type="radio" value="duplicate"> {{ __( 'Duplicate', 'wedevs-project-manager' ) }}</label></li>
            </ul>
          </div>
          <div class="wcp-option-inner"></div>
          <div class="pm-wp-assignees pm-col-3">
            <strong>{{ __( 'Assignees Users', 'wedevs-project-manager' ) }}</strong>
            <div class="assains-user">
              <div class="pm-form-item project-users">
                <input type="text" name="user" placeholder="Select User to project" class="pm-project-coworker ui-autocomplete-input" autocomplete="off" style="width: 100%;">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="woo-footer">
        <a class="pm-report-submit-button button button-primary"> {{ __( 'Save Change', 'wedevs-project-manager' ) }} </a>
        <a class="button pm-right"> {{ __( 'Add New', 'wedevs-project-manager' ) }} </a>
      </div>
    </div>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less">
.pm-woo-project {
  .woo-project-outer {
    transition: all 1s ease-out;
  }
  .order-placement {
    width: 100%;
    background: #fff;
    margin: 0 0 10px 0;
    padding: 10px;
    font-weight: 600;
  }
  .pm-wp-repeat {
    background-color: #FFF;
    clear: both;
    min-height: 100px;
    display: table;
    margin-bottom: 10px;
    position: relative;
  }
  .pm-wp-repeat span.wcp-remove {
    position: absolute;
    right: 4px;
    top: 4px;
    visibility: hidden;
    cursor: pointer;
  }
  .pm-wp-repeat:hover span.wcp-remove {
    visibility: visible;
  }
  .pm-wp-repeat strong {
    display: block;
    padding: 5px 2px;
  }
  .pm-wp-action select {
    width: 250px;
  }
  .woo-footer {
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .pm .woo-project .multiselect__tags {
    border-radius: 0px !important;
  }
  .pm .woo-project .multiselect input {
    border-width: 0px;
    box-shadow: none;
    padding: 5px;
  }
  .woo-project .pm-project-role, .woo-project .project-users {
    margin-top: 10px;
  }
  a.pro-button.button-upgrade-to-pro {
    position: fixed !important;
    transform: translate(-2%, -50%) !important;
  }
}

</style>

<script>
import UpgraderOverlay from '@components/upgrade/overlay';

export default {
  components: {
    UpgraderOverlay,
  },

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {
    addPromptsOverlay() {
      document.querySelector( '.pm-project-module-content-overlay' ).style.display = 'block';
    },

    removePromptsOverlay() {
      document.querySelector( '.pm-project-module-content-overlay' ).style.display = 'none';
    },
  },
}
</script>
