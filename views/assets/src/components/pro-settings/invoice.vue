<template>
  <div id="pm_invoice" class="group pm-project-module-page">
    <form method="post" @submit.prevent="">
      <h2>{{ __( 'Invoices', 'wedevs-project-manager' ) }}</h2>
      <table class="form-table">
        <tbody>
        <tr>
          <th scope="row">
            <label for="pm_invoice[theme_color]">{{ __( 'Theme Color', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <pm-color-picker v-model="themeColor"></pm-color-picker>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[currency]">{{ __( 'Currency', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <select class="regular">
              <option value="USD">{{ __( 'US Dollar', 'wedevs-project-manager' ) }}</option>
            </select>
          </td>
        </tr>
        <tr>
          <th scope="row"><label for="pm_invoice[payment_gateway]">{{ __( 'Payment Gateway', 'wedevs-project-manager' ) }}</label></th>
          <td>
            <fieldset>
              <label for="wpuf-pm_invoice[payment_gateway][paypal]">
                <input type="checkbox" class="checkbox" >
                {{ __( 'Paypal', 'wedevs-project-manager' ) }}
              </label>
            </fieldset>
            <fieldset>
              <label for="wpuf-pm_invoice[payment_gateway][paypal]">
                <input type="checkbox" class="checkbox" >
                {{ __( 'Stripe', 'wedevs-project-manager' ) }}
              </label>
            </fieldset>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label>{{ __( 'PayPal email', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <input type="text" class="regular-text">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[paypal_sand_box]">
              {{ __( 'Enable demo/sandbox mode forPayPal', 'wedevs-project-manager' ) }}
            </label>
          </th>
          <td>
            <fieldset>
              <label for="wpuf-pm_invoice[paypal_sand_box]">
                <input type="checkbox" class="checkbox">
                {{ __( 'When sandbox mode is active, all payment gateway will be used in demo mode', 'wedevs-project-manager' ) }}
              </label>
            </fieldset>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[gate_instruct_paypal]">{{ __( 'PayPal Instruction', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <textarea rows="5" cols="55" class="regular-text" id="pm_invoice[gate_instruct_paypal]" name="pm_invoice[gate_instruct_paypal]">{{ __( 'Pay with your credit card', 'wedevs-project-manager' ) }}</textarea>
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[organization]">
              {{ __( 'Organization', 'wedevs-project-manager' ) }}
            </label>
          </th>
          <td>
            <input type="text" class="regular-text" id="pm_invoice[organization]" name="pm_invoice[organization]">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[address_line_1]">{{ __( 'Address Line 1', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <input type="text" class="regular-text" id="pm_invoice[address_line_1]" name="pm_invoice[address_line_1]">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[address_line_2]">{{ __( 'Address Line 2', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <input type="text" class="regular-text" id="pm_invoice[address_line_2]" name="pm_invoice[address_line_2]" value="adsfadf">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[city]">{{ __( 'City', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <input type="text" class="regular-text">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[state]">{{ __( 'State/Province', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <input type="text" class="regular-text" id="pm_invoice[state]" name="pm_invoice[state]">
          </td>
        </tr>
        <tr>
          <th scope="row"><label for="pm_invoice[zip]">{{ __( 'Zip/Postal Code', 'wedevs-project-manager' ) }}</label></th>
          <td>
            <input type="text" class="regular-text">
          </td>
        </tr>
        <tr>
          <th scope="row">
            <label for="pm_invoice[country]">{{ __( 'Country', 'wedevs-project-manager' ) }}</label>
          </th>
          <td>
            <select class="regular">
              <option value="BD">{{ __( 'Bangladesh', 'wedevs-project-manager' ) }}</option>
            </select>
          </td>
        </tr>
        </tbody>
      </table>
      <pm-do-action hook="pm_invoice_settings"></pm-do-action>
      <div style="padding-left: 10px">
        <p class="submit">
          <input type="submit" name="submit" id="submit" class="button button-primary" :value="__( 'Save Changes', 'wedevs-project-manager' )">
        </p>
      </div>
    </form>
    <UpgraderOverlay />
  </div>
</template>

<style lang="less" scoped>
#pm_invoice {
  position: relative;
  padding-bottom: 100px;

  select {
    width: 114px;
  }

  .pm-project-module-content-overlay {
    width: 101.7%;
    margin: -19px 0 0 -20px;
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
      themeColor: '#82b541',
    }
  },

  mounted() {

  },

  methods: {

  },
}
</script>
